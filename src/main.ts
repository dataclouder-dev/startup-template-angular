import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, provideZoneChangeDetection, isDevMode, ApplicationConfig, APP_INITIALIZER, inject, provideAppInitializer } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
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
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// DC Libs
import { DefaultAgentCardsService, provideAgentCardService, provideUserDataExchange } from '@dataclouder/ngx-agent-cards';
import { provideLessonsService, provideNotionService } from '@dataclouder/ngx-lessons';
import { provideAuthConfig } from '@dataclouder/app-auth';
import { HttpCoreService, HTTP_CORE_CONFIG, provideToastAlert } from '@dataclouder/ngx-core';
// Local
import { ToastAlertService } from './app/services/toast.service';
import { LessonsService } from './app/pages/lessons/lessons.service';
import { authInterceptor } from './app/services/interception.service';
import { MyPreset } from './mypreset';
import { UserDataExchangeService } from './app/core/user-data-exchange.service';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { NotionService } from './app/services/notion.service';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyFieldInput } from './app/pages/generics/generic-form/formly-components/input';
import { FormlyFieldTextArea } from './app/pages/generics/generic-form/formly-components/textarea';
import { provideServiceWorker } from '@angular/service-worker';
import { APP_CONFIG, IAppConfig } from './app/services/app-config.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

fetch('/assets/config.json')
  .then(response => response.json())
  .then((config: IAppConfig) => {
    bootstrapApplication(AppComponent, {
      providers: [
        { provide: APP_CONFIG, useValue: config },

        provideAppInitializer(() => {
          const httpCore = inject(HttpCoreService);
          httpCore.setConfig({
            primaryUrl: config.backendNodeUrl,
            secondaryUrl: config.backendPythonUrl,
          });
        }),

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
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        // 🔥 Firebase

        { provide: FIREBASE_OPTIONS, useValue: config.firebase },
        provideFirebaseApp(() => initializeApp(config.firebase)),
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
        provideToastAlert(ToastAlertService),
        provideLessonsService(LessonsService),
        provideUserDataExchange(UserDataExchangeService),
        provideNotionService(NotionService),
        provideAgentCardService(DefaultAgentCardsService),
        provideAuthConfig({
          clientIds: {
            androidClientId: config.mobile.androidClientId,
            webClientId: config.mobile.iosClientId,
            iosClientId: config.mobile.iosClientId,
          },
          settings: {
            loginRedirectUri: '/auth/signin',
            signupRedirectUri: '/auth/signup',
            afterLoginRedirectUri: '/',
            appleRedirectURI: config.mobile.appleRedirectURI,
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
          enabled: !isDevMode(),
          registrationStrategy: 'registerWhenStable:30000',
        }),
      ],
    }).catch(err => console.error(err));
  });
