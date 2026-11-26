import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { filter } from 'rxjs';

/**
 * Automatic PWA update & reload manager backed by Angular Service Worker (`ngsw-worker.js`).
 *
 * - Checks for new deploys periodically, when returning to the tab (`visibilitychange`) and on reconnect (`online`).
 * - When `VERSION_READY` arrives: activates and reloads automatically after a brief toast, unless a screen
 *   temporarily pauses reloads via `holdAutoReload(key, true)` (in which case it applies on the next navigation or tab focus).
 * - Recovers automatically from `unrecoverable` SW cache states and protects against reload loops via `sessionStorage`.
 * - Cleans up foreign root-scope service workers that could displace `ngsw-worker.js`.
 */
@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly router = inject(Router);
  private readonly toast = inject(TOAST_ALERTS_TOKEN);
  private readonly destroyRef = inject(DestroyRef);

  public readonly updateReady = signal(false);
  public readonly checking = signal(false);

  private static readonly CHECK_INTERVAL_MS = 5 * 60 * 1000;
  private static readonly AUTO_RELOAD_DELAY_MS = 1500;
  private static readonly RELOAD_GUARD_MS = 60 * 1000;
  private static readonly RELOAD_GUARD_KEY = 'dc_sw_last_reload';

  private readonly holdKeys = new Set<string>();
  private activating = false;
  private started = false;

  public init(): void {
    if (this.started || !this.swUpdate.isEnabled) return;
    this.started = true;

    void this.reclaimRootScope();

    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(evt => this.onVersionReady(evt));

    this.swUpdate.unrecoverable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(evt => {
      console.error('[AppUpdate] Unrecoverable service worker state:', evt.reason);
      this.reloadOnce();
    });

    this.schedulePeriodicChecks();
    this.watchActivationMoments();
    void this.checkForUpdate();
  }

  public async checkForUpdate(): Promise<boolean> {
    if (!this.swUpdate.isEnabled || this.checking() || document.hidden || !navigator.onLine) return false;
    this.checking.set(true);
    try {
      return await this.swUpdate.checkForUpdate();
    } catch (error) {
      console.warn('[AppUpdate] Could not check for updates:', error);
      return false;
    } finally {
      this.checking.set(false);
    }
  }

  public async applyUpdateNow(): Promise<void> {
    if (this.activating || !this.updateReady()) return;
    this.activating = true;
    try {
      await this.swUpdate.activateUpdate();
      this.reloadOnce();
    } catch (error) {
      console.error('[AppUpdate] Failed to activate update:', error);
      this.activating = false;
    }
  }

  /** Temporarily postpones automatic reload while an editor/form has unsaved work. */
  public holdAutoReload(key: string, active: boolean): void {
    if (active) this.holdKeys.add(key);
    else this.holdKeys.delete(key);
  }

  private onVersionReady(evt: VersionReadyEvent): void {
    console.log(`[AppUpdate] New version ready: ${evt.currentVersion.hash} -> ${evt.latestVersion.hash}`);
    this.updateReady.set(true);

    if (this.holdKeys.size > 0) {
      this.toast.info({
        title: 'Actualización lista',
        subtitle: 'Se aplicará automáticamente al cambiar de sección.',
      });
      return;
    }

    this.toast.info({
      title: 'Nueva versión disponible',
      subtitle: 'Actualizando la aplicación…',
    });

    setTimeout(() => {
      void this.applyIfSafe();
    }, AppUpdateService.AUTO_RELOAD_DELAY_MS);
  }

  private schedulePeriodicChecks(): void {
    const intervalId = setInterval(() => void this.checkForUpdate(), AppUpdateService.CHECK_INTERVAL_MS);
    const onOnline = () => void this.checkForUpdate();
    window.addEventListener('online', onOnline);

    this.destroyRef.onDestroy(() => {
      clearInterval(intervalId);
      window.removeEventListener('online', onOnline);
    });
  }

  private watchActivationMoments(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => void this.applyIfSafe());

    const onVisibilityChange = () => {
      if (document.hidden) return;
      if (this.updateReady()) void this.applyIfSafe();
      else void this.checkForUpdate();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    this.destroyRef.onDestroy(() => document.removeEventListener('visibilitychange', onVisibilityChange));
  }

  private async applyIfSafe(): Promise<void> {
    if (!this.updateReady() || this.holdKeys.size > 0) return;
    await this.applyUpdateNow();
  }

  private reloadOnce(): void {
    const lastReload = Number(sessionStorage.getItem(AppUpdateService.RELOAD_GUARD_KEY) ?? 0);
    if (Date.now() - lastReload < AppUpdateService.RELOAD_GUARD_MS) {
      console.warn('[AppUpdate] Reload skipped: already reloaded within the last 60s.');
      this.activating = false;
      return;
    }
    sessionStorage.setItem(AppUpdateService.RELOAD_GUARD_KEY, String(Date.now()));
    document.location.reload();
  }

  private async reclaimRootScope(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        const scriptURL = (registration.active ?? registration.waiting ?? registration.installing)?.scriptURL ?? '';
        const isRootScope = new URL(registration.scope).pathname === '/';
        if (isRootScope && !scriptURL.includes('ngsw-worker.js')) {
          console.warn(`[AppUpdate] Unregistering foreign root-scope SW: ${scriptURL}`);
          await registration.unregister();
        }
      }
    } catch (error) {
      console.warn('[AppUpdate] Could not inspect root SW scope:', error);
    }
  }
}
