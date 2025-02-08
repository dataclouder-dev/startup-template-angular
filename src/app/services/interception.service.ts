import { mergeMap } from 'rxjs/operators';
import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { FirebaseAuthService } from '@dataclouder/app-auth';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const fbAuthService = inject(FirebaseAuthService);

  return fbAuthService.tokenId$.pipe(
    mergeMap(token => {
      const modifiedRequest = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(modifiedRequest);
    })
  );
}
