# Authentication Section

The Authentication section handles user sign-in, account creation, and the overall security flow of the application.

## Overview
This section is managed via the `/auth` route and uses a dedicated layout for authentication pages. It integrates with `@dataclouder/ngx-auth` for authentication logic and redirection.

## Route Structure
- `/auth`: Main route for authentication.
  - `/signin`: Login page (`LoginComponent`).
  - `/signup`: Registration page (`AppSignupComponent`).
  - `redirectToIfAuth('page/home')`: Automatically redirects authenticated users to the home page.

## Components

### [AuthLayoutComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/auth/auth-layout.component.ts)
A layout component that provides the visual wrap for authentication pages. It includes a router outlet to render child auth pages.

### [LoginComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/login/login.page.ts)
Handles user sign-in.
- **Key Features**:
  - Uses `DCLoginComponent` from `@dataclouder/ngx-auth`.
  - Configures social sign-in providers (Apple, Google).
  - Handles forgot password navigation.

### [AppSignupComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/login/signup.component.ts)
Handles new user registration.
- **Key Features**:
  - Uses `DCSignupComponent` from `@dataclouder/ngx-auth`.
  - Configured with `authProviders` including Apple and Google.

## Guards and Services

### [redirectToIfAuth](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/app.routes.ts#L3)
A guard used to prevent authenticated users from accessing login/signup pages by redirecting them to a protected route (e.g., `/page/home`).

### [authAndUserGuard](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/app.routes.ts#L6)
A guard from `@dataclouder/ngx-users` that ensures the user is authenticated and their user profile is loaded before accessing pages under `/page`.
