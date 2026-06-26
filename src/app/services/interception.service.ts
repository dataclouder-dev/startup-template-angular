import { mergeMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

import { FirebaseAuthService } from '@dataclouder/ngx-auth';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const fbAuthService = inject(FirebaseAuthService);

  return fbAuthService.tokenId$.pipe(
    mergeMap(token => {
      if (!token || token === 'null' || token === 'undefined') {
        console.log('No token yet!!!')
        return next(req);
      }
      const modifiedRequest = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(modifiedRequest);
    })
  );
}
