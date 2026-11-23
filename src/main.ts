import { bootstrapApplication } from '@angular/platform-browser';
import { isDevMode, inject, provideAppInitializer } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// Ionic
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
// PrimeNG
import { DialogService } from 'primeng/dynamicdialog';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
// Third Party
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideMarkdown } from 'ngx-markdown';
// DC Libs
import { AGENT_CARDS_STATE_SERVICE, DefaultAgentCardsService, IAgentCard, provideAgentCardService } from '@dataclouder/ngx-agent-cards';
import { provideLessonsService, provideNotionService, DefaultLessonsService } from '@dataclouder/ngx-lessons';
import { localJwtAuthInterceptor, provideLocalJwtAuth } from '@dataclouder/ngx-auth';
import { provideDcAnalytics } from '@dataclouder/ngx-analytics';
import { HttpCoreService, provideToastAlert, APP_CONFIG, IAppConfig, DC_ENTITY_ACTION_POLICY, IEntityAction } from '@dataclouder/ngx-core';
import { provideDcTour } from '@dataclouder/ngx-tour';
import { provideMasterState } from '@dataclouder/ngx-knowledge';
import { UserService } from '@dataclouder/ngx-users';
// Local
import { ToastAlertService } from './app/services/toast.service';
import { MyPreset } from './mypreset';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { NotionService } from './app/services/notion.service';
import { AppUserService } from './app/services/app-user.service';

interface TemplateAppConfig extends IAppConfig {
  auth?: {
    provider?: 'local-jwt' | 'firebase';
    googleClientId?: string;
    googleTrustNote?: string;
  };
  analytics?: {
    appId?: string;
    metaPixelId?: string;
    googleTagId?: string;
  };
}

fetch('/config.json')
  .then(response => response.json())
  .then((config: TemplateAppConfig) => {
    bootstrapApplication(AppComponent, {
      providers: [
        { provide: APP_CONFIG, useValue: config },

        { provide: UserService, useExisting: AppUserService },
        {
          provide: DC_ENTITY_ACTION_POLICY,
          useFactory: () => {
            const userService = inject(UserService);
            return (action: IEntityAction) => (action.id === 'create' ? userService.isAdmin() : true);
          },
        },

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
        provideDcTour({
          voiceStorageKey: 'template.tour.voice',
          voiceByDefault: false,
        }),
        provideHttpClient(withInterceptors([localJwtAuthInterceptor])),
        ...provideLocalJwtAuth({
          apiBaseUrl: config.backendNodeUrl,
          googleClientId: config.auth?.googleClientId || '',
          googleTrustNote: config.auth?.googleTrustNote || 'Acceso seguro con tu cuenta Dataclouder',
          loginRoute: '/auth/signin',
          afterLoginRoute: '/page/home',
          withCredentials: true,
        }),
        provideDcAnalytics({
          apiBaseUrl: config.backendNodeUrl,
          appId: config.analytics?.appId || 'startup-template',
          metaPixelId: config.analytics?.metaPixelId,
          googleTagId: config.analytics?.googleTagId,
          autoPageViews: false,
        }),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideMarkdown(),
        DialogService,
        MessageService,

        provideToastAlert(ToastAlertService),
        provideNotionService(NotionService),
        provideAgentCardService(DefaultAgentCardsService),

        provideServiceWorker('ngsw-worker.js', {
          enabled: !isDevMode(),
          registrationStrategy: 'registerWhenStable:30000',
        }),
      ],
    }).catch(err => console.error(err));
  });
