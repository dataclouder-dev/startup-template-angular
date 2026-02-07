import { mergeMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

import { FirebaseAuthService } from '@dataclouder/ngx-auth';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
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
