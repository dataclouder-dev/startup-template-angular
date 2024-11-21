import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, Route, UrlSegment } from '@angular/router';

import { fromEvent, Observable, of } from 'rxjs';
import { mergeMap, concatMap, tap, first } from 'rxjs/operators';
import { FirebaseAuthService } from './firebase-auth.service';
// import { Store } from '@ngrx/store';
// import { NGXLogger } from 'ngx-logger';

// import { FirebaseAuthService } from '../core/firebase-auth.service';
// import { UserActions, UserSelectors } from './store/user';
// import { UserService } from './data-services/user.service';
// import { StoreUtilService } from './store/store-util.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private fbAuthService: FirebaseAuthService,
    private router: Router // private userService: UserService, // private storeUtil: StoreUtilService,
  ) {}

  offlineEvent = fromEvent(window, 'offline');

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    console.log('AuthGuardService -> canActivate -> next', next);

    return this.isAuthAndLoaded$();
  }

  private isAuthAndLoaded$() {
    return this.fbAuthService.authState$.pipe(
      tap(isAuth => {
        console.log('AuthGuardService -> isAuthAndLoaded$ -> isAuth', isAuth);
      }),
      concatMap(isAuth => {
        if (!isAuth) {
          this.router.navigateByUrl('auth/login');
          return of(false);
        } else {
          // this.router.navigateByUrl('/page/home');
          return of(true);
        }
      })
    );

    // const isLoadedUser$ = this.store.select(UserSelectors.getIsLoaded);

    // const isAuthAndLoaded$ = this.fbAuthService.authState$.pipe(
    //   concatMap((isAuth) => {
    //     if (!isAuth) {
    //       this.router.navigateByUrl('auth/login');
    //       return of(false);
    //     } else {
    //       // TODO: creo que is loaded lo saco syncrono para reducir complejidad y asi saco al obserbable.

    //     }
    //   }),
    // );

    // return isAuthAndLoaded$;
  }

  getLoadedUserOrLoad() {
    return of(true);
  }

  // TODO no se que hacer aquí para mejorar el lazy loading. quizá abstaer los métodos e implementar algo para obtener el privilegio que requiere desde el token.
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // throw new Error('Method not implemented.');
    return of(true);
  }
}
