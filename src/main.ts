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
import { AGENT_CARDS_STATE_SERVICE, DefaultAgentCardsService, IAgentCard, provideAgentCardService } from '@dataclouder/ngx-agent-cards';
import { provideLessonsService, provideNotionService, DefaultLessonsService } from '@dataclouder/ngx-lessons';
import { provideAuthConfig } from '@dataclouder/ngx-auth';
import { HttpCoreService, provideToastAlert, APP_CONFIG, IAppConfig } from '@dataclouder/ngx-core';
// Local
import { ToastAlertService } from './app/services/toast.service';
import { authInterceptor } from './app/services/interception.service';
import { MyPreset } from './mypreset';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { NotionService } from './app/services/notion.service';

import { provideServiceWorker } from '@angular/service-worker';
import { provideMarkdown } from 'ngx-markdown';
import { provideMasterState } from '@dataclouder/ngx-knowledge';
import { AppUserService } from './app/services/app-user.service';
import { UserService } from '@dataclouder/ngx-users';

import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

fetch('/config.json')
  .then(response => response.json())
  .then((config: IAppConfig) => {
    bootstrapApplication(AppComponent, {
      providers: [
        { provide: APP_CONFIG, useValue: config },

        { provide: UserService, useExisting: AppUserService },

        provideMasterState<IAgentCard>(AGENT_CARDS_STATE_SERVICE, {
          pathTable: 'agent-cards',
          sourceCoreEndPoint: 'api/agent-cards/query',
          userStateEndPoint: 'api/knowledge/learning-experience',
        }),

        provideTranslateService({
          loader: provideTranslateHttpLoader({
            prefix: '/i18n/',
            suffix: '.json',
          }),
          fallbackLang: 'en',
          lang: 'en',
        }),

        // provideTranslateService({
        //   loader: provideTranslateHttpLoader({
        //     prefix: '/i18n/',
        //     suffix: '.json',
        //   }),

        //   defaultLanguage: 'en',
        // }),

        provideAppInitializer(() => {
          const httpCore = inject(HttpCoreService);
          httpCore.setConfig({
            primaryUrl: config.backendNodeUrl,
            secondaryUrl: config.backendPythonUrl,
          });
        }),

        provideLessonsService(DefaultLessonsService),

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
        provideMarkdown(),
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
        MessageService,

        provideToastAlert(ToastAlertService),
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

        provideServiceWorker('ngsw-worker.js', {
          enabled: !isDevMode(),
          registrationStrategy: 'registerWhenStable:30000',
        }),
      ],
    }).catch(err => console.error(err));
  });
