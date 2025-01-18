import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/services/interception.service';
import { environment } from './environments/environment';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { provideAuth } from '@angular/fire/auth';
import { importProvidersFrom } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Capacitor } from '@capacitor/core';
import { AUTH_CONFIG } from '@dataclouder/app-auth';
import { provideChatAIService, provideToastAlert } from '@dataclouder/conversation-system';
import { ConversationAIService } from './app/services/chat-ai-service';
import { ToastAlertService } from './app/services/toast.service';

import { provideLessonsService } from '@dataclouder/lessons';
import { LessonsService } from './app/services/lessons.service';

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log('Before interception request:', req.url);
  console.log(req.url);

  return next(req);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideFirebaseApp(() => {
      if (!environment.firebase?.apiKey || !environment.firebase?.projectId) {
        alert('Please add the Firebase Credentials');
        throw new Error('Firebase configuration is missing required fields');
      }
      return initializeApp(environment.firebase);
    }),
    provideAuth(() => {
      if (Capacitor.isNativePlatform()) {
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence,
        });
      } else {
        return getAuth();
      }
    }),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    provideChatAIService(ConversationAIService),
    provideToastAlert(ToastAlertService),
    provideLessonsService(LessonsService),

    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),

    {
      provide: AUTH_CONFIG,
      useValue: {
        clientIds: {
          androidClientId: environment.mobile.androidClientId,
          webClientId: environment.mobile.iosClientId,
          iosClientId: environment.mobile.iosClientId,
        },
        settings: {
          loginRedirectUri: '/auth/signin',
          signupRedirectUri: '/auth/signup',
          afterLoginRedirectUri: '/',
          appleRedirectURI: environment.mobile.appleRedirectURI,
        },
      },
    },
  ],
});
