import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { redirectToIfAuth } from '@dataclouder/app-auth';
import { RouteNames } from './core/enums';

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
    children: [
      {
        path: '',
        redirectTo: RouteNames.Signup,
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
    canActivate: [AuthGuardService],
    loadComponent: () => import('./ionic-layout/ionic-layout.component').then(m => m.IonicLayoutComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'explore',
        loadComponent: () => import('./pages/explore/explore.page').then(m => m.ExplorePage),
      },

      {
        path: 'test',
        loadComponent: () => import('./pages/test/test.component').then(m => m.TestComponent),
      },
      {
        path: 'chat',
        loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponentPage),
      },
    ],
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
  },
];
