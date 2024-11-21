import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  IdTokenResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  signInWithCredential,
} from '@angular/fire/auth';
import { from, of } from 'rxjs';

import { take, concatMap } from 'rxjs/operators';
import { RouteNames } from '../core/enums';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  // public providerData: { phoneNumber: string, displayName: string, photoURL: string, providerId: string, uid: string } | any;

  constructor(private router: Router, private auth: Auth) {}
  public authState$ = authState(this.auth);

  public tokenId$ = this.authState$.pipe(
    take(1),
    concatMap(auth => {
      if (auth === null) {
        return of(null);
      }
      return from(auth.getIdToken());
    })
  );

  public refreshToken(): void {
    this.authState$.pipe(take(1)).subscribe((auth: any) => {
      auth.getIdToken(true).then((_: any) => {
        // this.logger.info('token refreshed');
      });
    });
  }

  public async logOut(): Promise<void> {
    // TODO: verificar que al cerrar sesión no recuerde los datos del estado.
    // TODO! revisar como reiniciar los estados que sea automáticamente y no aquí
    // this.store.dispatch(UserActions.resetUserInitialState());
    // this.store.dispatch(VerbActions.resetInitialState());
    // this.store.dispatch(WordActions.resetInitialState());
    // this.store.dispatch(TopicsActions.setInitialState());

    // hydrateStorage(StorageStateEnum.User, null);
    // hydrateStorage(StorageStateEnum.Words, null);
    // hydrateStorage(StorageStateEnum.Verbs, null);

    const response = await this.auth.signOut();
    // this.logger.debug('Cerrando sesión', response);
    this.router.navigateByUrl('/auth/login');
  }

  public async signWithProvider(privider: 'google' | 'facebook'): Promise<void> {
    let authResult = null;
    if (privider === 'google') {
      // this.logger.info('Iniciando auth con google');
      authResult = await signInWithPopup(this.auth, new GoogleAuthProvider());
    } else if (privider === 'facebook') {
      authResult = await signInWithPopup(this.auth, new FacebookAuthProvider());
    } else {
      throw new Error('No se tiene un provedor válido');
    }
    console.log(authResult);
    this.router.navigateByUrl('/' + RouteNames.Home);
  }

  public async register(email: string, password: string): Promise<void> {
    try {
      const credentials = await createUserWithEmailAndPassword(this.auth, email, password);
      sendEmailVerification(credentials.user);

      this.router.navigateByUrl('/' + RouteNames.Home);
    } catch (err: any) {
      console.log('Ocurrió un error al registrar el usuario', err);
      throw new Error(err.message);
    }
  }

  public sendEmailVerification(): void {
    // sendEmailVerification(this.auth.currentUser);
  }

  public async signWithEmailPassword(email: string, password: string): Promise<any> {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('El usuario es', user.user);
      return user;
      // this.router.navigateByUrl('/' + RouteNames.Home);
    } catch (err: any) {
      console.log('Ocurrió un problema al iniciar sesión', err);
      // this.logger.warn('Ocurrió un problema al iniciar sesión', err);
      throw new Error(err.message);
    }
  }

  // NotUsed
  public async getTokenResult(): Promise<IdTokenResult> {
    return this.auth.currentUser?.getIdTokenResult() as Promise<IdTokenResult>;
  }

  public sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  public async signInWithCredential(credential: any): Promise<any> {
    try {
      const data = await signInWithCredential(this.auth, credential);
      console.log(data);
      this.router.navigateByUrl('/' + RouteNames.Home);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
