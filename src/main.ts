import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// Firebase
import { provideStorage, getStorage } from '@angular/fire/storage';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, initializeAuth, indexedDBLocalPersistence } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
// Ionic
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
// PrimeNG
import { DialogService } from 'primeng/dynamicdialog';
import { providePrimeNG } from 'primeng/config';
// Third Party
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// DC Libs
import { DefaultAgentCardsService, provideAgentCardService, provideUserDataExchange } from '@dataclouder/ngx-agent-cards';
import { provideLessonsService, provideNotionService } from '@dataclouder/ngx-lessons';
import { provideAuthConfig } from '@dataclouder/app-auth';
import { HTTP_CORE_CONFIG, provideToastAlert } from '@dataclouder/ngx-core';
// Local
import { environment } from './environments/environment';
import { ToastAlertService } from './app/services/toast.service';
import { LessonsService } from './app/pages/lessons/lessons.service';
import { authInterceptor } from './app/services/interception.service';
import { MyPreset } from './mypreset';
import { UserDataExchangeService } from './app/core/user-data-exchange.service';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { NotionService } from './app/services/notion.service';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyFieldInput } from './app/pages/generics/generic-form/formly-components/input';
import { FormlyFieldTextArea } from './app/pages/generics/generic-form/formly-components/textarea';
import { provideServiceWorker } from '@angular/service-worker';

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log('Before interception request:', req.url);
  console.log(req.url);

  return next(req);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular Providers
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Ionic Providers
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    // Firebase Providers
    provideFirebaseApp(() => {
      if (!environment.firebase?.apiKey || !environment.firebase?.projectId) {
        alert('Please add the Firebase Credentials');
        throw new Error('Firebase configuration is missing required fields');
      }
      return initializeApp(environment.firebase);
    }),
    { provide: HTTP_CORE_CONFIG, useValue: { primaryUrl: environment.backendNodeUrl, secondaryUrl: environment.backendPythonUrl } },

    provideStorage(() => getStorage()),

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

    // Translate Providers
    DialogService,
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    //  📊 Dataclouder Providers
    // provideChatAIService(AgentCardService),
    provideToastAlert(ToastAlertService),
    provideLessonsService(LessonsService),
    provideUserDataExchange(UserDataExchangeService),
    provideNotionService(NotionService),
    provideAgentCardService(DefaultAgentCardsService), // Trick provide the same.

    provideAuthConfig({
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
    }),
    importProvidersFrom(
      FormlyModule.forRoot({
        types: [
          { name: 'input', component: FormlyFieldInput },
          { name: 'textarea', component: FormlyFieldTextArea },
        ],
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      })
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
