import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin',
  template: `
    <p-tabs [value]="activeTab()" style="width: 100%">
      <p-tablist>
        <p-tab value="pricing" routerLink="pricing">Planes y Precios</p-tab>
        <p-tab value="users" routerLink="users">Usuarios</p-tab>
        <p-tab value="agent-rules" routerLink="agent-rules">Reglas de Agentes</p-tab>
      </p-tablist>
      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </p-tabs>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;
      }
      .admin-content {
        padding-top: 12px;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabsModule, RouterModule],
})
export class AdminComponent {
  private readonly router = inject(Router);
  public readonly activeTab = signal(this.resolveTab(this.router.url));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(event => {
        this.activeTab.set(this.resolveTab(event.urlAfterRedirects));
      });
  }

  private resolveTab(url: string): string {
    if (url.includes('/admin/users')) return 'users';
    if (url.includes('/admin/agent-rules')) return 'agent-rules';
    return 'pricing';
  }
}
