import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LocalJwtAuthService } from '@dataclouder/ngx-auth';
import { UserService } from '@dataclouder/ngx-users';

/**
 * Guard principal para rutas privadas en modo `'local-jwt'` (sin Firebase).
 * Restaura sesión vía cookie HttpOnly si aún no hay Access Token en memoria
 * y asegura que el perfil del usuario esté cargado en `UserService`.
 */
export const localJwtUserGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(LocalJwtAuthService);
  const userService = inject(UserService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated() || (await authService.restoreSession());
  if (!isAuthenticated) {
    return router.parseUrl(authService.loginRoute);
  }

  if (!userService.user()) {
    try {
      await userService.refreshUserFromServer(true);
    } catch (error) {
      console.error('Failed to load user in localJwtUserGuard, redirecting.', error);
      return router.parseUrl(authService.loginRoute);
    }
  } else {
    void userService.refreshUserInBackground();
  }

  return true;
};

/**
 * Restringe rutas internas/demo (`admin`, `generics`, `test`, `ai-playground`, `design-system`, `deck`)
 * exclusivamente a usuarios con rol admin para que cualquier app clonada se vea 100 % orientada al cliente final.
 */
export const adminOnlyGuard: CanActivateFn = (): boolean | UrlTree => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.isAdmin() ? true : router.parseUrl('/page/home');
};
