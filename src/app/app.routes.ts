import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { redirectToIfAuth } from '@dataclouder/app-auth';

import { RouteNames } from './core/enums';
import { authAndUserGuard } from '@dataclouder/ngx-users';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
        canActivate: [redirectToIfAuth('page/home')],
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
      },
      {
        path: 'terms',
        loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent),
      },
      {
        path: 'intro',
        loadComponent: () => import('./intro/intro.page').then(m => m.IntroPage),
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: RouteNames.Signin,
        pathMatch: 'full',
      },
      {
        path: RouteNames.Signin,
        loadComponent: () => import('./login/login.page').then(m => m.LoginComponent),
        canActivate: [redirectToIfAuth('page/home')],
      },
      {
        path: RouteNames.Signup,
        loadComponent: () => import('./login/signup.component').then(m => m.AppSignupComponent),
        canActivate: [redirectToIfAuth('page/home')],
      },
    ],
  },
  {
    path: 'page',
    canActivate: environment.authenticationRequired ? [authAndUserGuard] : [],

    loadComponent: () => import('./ionic-layout/ionic-layout.component').then(m => m.IonicLayoutComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },

      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent),
          },
          {
            path: 'users',
            loadComponent: () => import('@dataclouder/ngx-users').then(m => m.AdminUserComponent),
          },
        ],
      },

      {
        path: 'lessons',
        loadComponent: () => import('./pages/lessons/explore.page').then(m => m.ExplorePage),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/lessons/lesson-list/lesson-list.component').then(m => m.LessonListComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () => import('./pages/lessons/lesson-details/lesson-details.component').then(m => m.LessonDetailsComponent),
          },
          {
            path: 'list',
            loadComponent: () => import('./pages/lessons/lesson-list/lesson-list.component').then(m => m.LessonListComponent),
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/lessons/explore-edit/explore-edit.component').then(m => m.ExploreEditComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/lessons/explore-edit/explore-edit.component').then(m => m.ExploreEditComponent),
          },
        ],
      },

      {
        path: 'generics',
        loadComponent: () => import('./pages/generics/generics.component').then(m => m.GenericsComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/generics/generic-list/generic-list.component').then(m => m.GenericListComponent),
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/generics/generic-form/generic-form.component').then(m => m.GenericFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/generics/generic-form/generic-form.component').then(m => m.GenericFormComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () => import('./pages/generics/generic-detail/generic-detail.component').then(m => m.GenericDetailComponent),
          },
        ],
      },

      {
        path: 'deck',

        children: [
          {
            path: '',
            loadComponent: () => import('./deck-commander/deck-commander-list/deck-commander-list.component').then(m => m.DeckCommanderListComponent),
          },
          {
            path: 'edit',
            loadComponent: () => import('./deck-commander/deck-commander-form/deck-commander-form.component').then(m => m.DeckCommanderFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./deck-commander/deck-commander-form/deck-commander-form.component').then(m => m.DeckCommanderFormComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () => import('./deck-commander/deck-commander-detail/deck-commander-detail.component').then(m => m.DeckCommanderDetailComponent),
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./deck-commander/dashboard-commander/deck-commander-dashboard').then(m => m.DeckCommanderComponent),
          },
        ],
      },

      {
        path: 'test',
        loadComponent: () => import('./pages/test/test.component').then(m => m.TestComponent),
      },
      {
        path: 'agents',
        loadComponent: () => import('./pages/agent-cards/agent-card-router').then(m => m.AgentCardRouter),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/agent-cards/agent-card-list/agent-card-list').then(m => m.AgentCardListPage),
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/agent-cards/agent-card-form/agent-card-form').then(m => m.AgentCardFormPage),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/agent-cards/agent-card-form/agent-card-form').then(m => m.AgentCardFormPage),
          },
          {
            path: 'details/:id',
            loadComponent: () => import('./pages/agent-cards/agent-card-details/agent-card-details').then(m => m.AgentCardDetailsPage),
          },
        ],
      },
    ],
  },

  {
    path: 'page/stack',
    canActivate: [AuthGuardService],

    loadComponent: () => import('./ionic-layout/stack-ionic/stack-ionic.component').then(m => m.StackIonicComponent),
    children: [
      {
        path: 'conversation-form',
        loadComponent: () => import('./pages/agent-cards/agent-card-form/agent-card-form').then(m => m.AgentCardFormPage),
      },
      {
        path: 'conversation-form/:id',
        loadComponent: () => import('./pages/agent-cards/agent-card-form/agent-card-form').then(m => m.AgentCardFormPage),
      },

      {
        path: 'chat',
        loadComponent: () => import('./pages/agent-cards/agent-card-chat/agent-card-chat').then(m => m.AgentCardChatComponent),
      },
      {
        path: 'chat/:id',
        loadComponent: () => import('./pages/agent-cards/agent-card-chat/agent-card-chat').then(m => m.AgentCardChatComponent),
      },

      {
        path: 'conversation-details',
        loadComponent: () => import('./pages/agent-cards/agent-card-details/agent-card-details').then(m => m.AgentCardDetailsPage),
      },

      {
        path: 'conversation-details/:id',
        loadComponent: () => import('./pages/agent-cards/agent-card-details/agent-card-details').then(m => m.AgentCardDetailsPage),
      },

      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
      },
    ],
  },

  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
