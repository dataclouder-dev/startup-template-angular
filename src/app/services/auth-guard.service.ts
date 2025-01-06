import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, Route, UrlSegment } from '@angular/router';

import { fromEvent, Observable, of } from 'rxjs';
import { mergeMap, concatMap, tap, first } from 'rxjs/operators';
import { FirebaseAuthService } from './firebase-auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private fbAuthService: FirebaseAuthService,
    private router: Router, // private userService: UserService, // private storeUtil: StoreUtilService,
    private userService: UserService
  ) {}

  offlineEvent = fromEvent(window, 'offline');

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    console.log('AuthGuardService -> canActivate -> next', next);
    return this.isAuthAndLoaded$();
  }

  private isAuthAndLoaded$() {
    const user = this.userService.user;

    return this.fbAuthService.authState$.pipe(
      tap(isAuth => {
        console.log('AuthGuardService -> isAuthAndLoaded$ -> isAuth', isAuth);
      }),
      concatMap(isAuth => {
        if (!isAuth) {
          this.router.navigateByUrl('auth/login');
          return of(false);
        } else {
          if (user) {
            return of(true);
          } else {
            this.userService.findUser().then(user => {
              console.log('AuthGuardService -> isAuthAndLoaded$ -> user', user);
              return of(true);
            });
            return of(true);
          }
        }
      })
    );
  }
}
