import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocalJwtAuthService, PlanType, TokenStatus } from '@dataclouder/ngx-auth';
import { APP_CONFIG, TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { NGXStripeService, PricingStorefrontComponent } from '@dataclouder/ngx-payment';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [DatePipe, RouterLink, ButtonModule, CardModule, MessageModule, TagModule, PricingStorefrontComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto flex max-w-5xl flex-col gap-5 p-4 md:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="m-0 text-2xl font-bold text-strong">Planes y suscripción</h1>
          <p class="mt-1 mb-0 text-sm text-muted">
            Elige tu plan o administra tu método de pago, facturas y cancelación desde Stripe.
          </p>
        </div>

        @if (userService.isAdmin()) {
          <p-button
            label="Administrar planes y precios"
            icon="pi pi-sliders-h"
            severity="secondary"
            [outlined]="true"
            routerLink="/page/admin/pricing" />
        }
      </div>

      @if (activatingPayment()) {
        <p-message severity="info">Confirmando tu pago con Stripe y activando tu plan…</p-message>
      }

      @if (activationSuccess()) {
        <p-message severity="success">{{ activationSuccess() }}</p-message>
      }

      @if (activationError()) {
        <p-message severity="error">{{ activationError() }}</p-message>
      }

      <p-card>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-medium uppercase tracking-wide text-muted">Tu estado actual</span>
            <div class="flex flex-wrap items-center gap-2">
              <strong class="text-lg text-strong">{{ currentPlanLabel() }}</strong>
              <p-tag
                [value]="userService.isPremium() ? 'Activo' : 'Gratuito'"
                [severity]="userService.isPremium() ? 'success' : 'secondary'" />
            </div>
            @if (planExpirationDate(); as exp) {
              <p class="m-0 text-sm text-muted">Vigente hasta el {{ exp | date: 'dd/MM/yyyy' }}</p>
            }
          </div>

          <p-button
            label="Ir a mi perfil"
            icon="pi pi-user"
            severity="secondary"
            [outlined]="true"
            routerLink="/page/stack/profile" />
        </div>
      </p-card>

      <dc-pricing-storefront
        [currency]="'mxn'"
        [showPortalButton]="true"
        ctaLabel="Suscribirme ahora"
        portalTitle="Gestiona tu facturación"
        portalSubtitle="Actualiza tu tarjeta, descarga recibos o cancela tu suscripción en cualquier momento desde Stripe."
        portalButtonLabel="Abrir portal de Stripe" />
    </div>
  `,
})
export class BillingComponent implements OnInit {
  public readonly userService = inject(AppUserService);
  private readonly stripeService = inject(NGXStripeService);
  private readonly authService = inject(LocalJwtAuthService);
  private readonly toastService = inject(TOAST_ALERTS_TOKEN);
  private readonly config = inject(APP_CONFIG);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly activatingPayment = signal(false);
  public readonly activationSuccess = signal('');
  public readonly activationError = signal('');

  public readonly currentPlanLabel = computed(() => {
    const type = this.userService.getPlan();
    if (this.userService.isPremium() || type === PlanType.Premium) {
      return `${this.config.projectName || 'Plan'} Premium`;
    }
    return 'Plan Básico';
  });

  public readonly planExpirationDate = computed<Date | null>(() => {
    const rawExp = this.userService.user()?.claims?.plan?.exp;
    if (!rawExp) return null;
    const parsed = new Date(rawExp);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  });

  public ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id')?.trim();
    if (sessionId) {
      void this.confirmCheckoutSession(sessionId);
    }
  }

  private async confirmCheckoutSession(sessionId: string): Promise<void> {
    this.activatingPayment.set(true);
    this.activationError.set('');
    this.activationSuccess.set('');

    try {
      for (let attempt = 0; attempt < 10; attempt++) {
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const result = await this.stripeService.updateUserSubscriptionIfPaid(sessionId);
        const claims = result?.claims;
        if (claims && (claims.status === TokenStatus.Welcome || claims.plan?.type === PlanType.Premium)) {
          await this.authService.refreshSession();
          await this.userService.refreshUserFromServer(true);

          await this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { session_id: null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });

          this.activationSuccess.set('¡Tu suscripción Premium ya está activa! Disfruta acceso completo.');
          this.toastService.success({
            title: 'Suscripción activada',
            subtitle: 'Ya tienes acceso completo a tu plan Premium.',
          });
          return;
        }

        if (!result?.pending) {
          break;
        }
      }

      this.activationError.set(
        'Tu pago aún se está confirmando. Espera unos segundos y recarga la página, o vuelve a iniciar sesión.'
      );
      this.toastService.warn({
        title: 'Confirmación pendiente',
        subtitle: 'Stripe todavía está procesando tu pago. Recarga en unos momentos.',
      });
    } catch {
      this.activationError.set('No pudimos verificar tu sesión de pago. Si el cargo se realizó, recarga en unos segundos.');
      this.toastService.error({
        title: 'No se pudo verificar el pago',
        subtitle: 'Intenta recargar la página en unos segundos.',
      });
    } finally {
      this.activatingPayment.set(false);
    }
  }
}
