# Project Architecture Summary

This document provides a high-level overview of the project's architecture, structure, and technologies.

## 1. Architecture & Technologies

- **Core Framework:** Angular (v19+) using standalone components.
- **UI Framework:**
  - Ionic Framework (v8+) for core UI components, navigation, and mobile look-and-feel.
  - PrimeNG (v19+) for additional UI components (e.g., data tables, dialogs). Includes a custom theme preset (`MyPreset`).
- **Mobile Platform:** Capacitor (v6+) for building native iOS and Android applications from the web codebase.
- **Backend Integration:** Firebase is used for backend services:
  - Firebase Authentication
  - Firebase Cloud Storage
- **Authentication Methods:**
  - Firebase Email/Password
  - Google Sign-In (`@codetrix-studio/capacitor-google-auth`)
  - Apple Sign-In (`@capacitor-community/apple-sign-in`)
  - Custom authentication logic via `@dataclouder/app-auth`.
- **State Management:** Primarily handled via Angular services and RxJS. custom services like `UserDataExchangeService` might manage specific state slices.
- **Forms:** Angular Reactive Forms, enhanced with Formly (`@ngx-formly/core`, `@ngx-formly/primeng`) for dynamic form generation.
- **Key Libraries & Features:**
  - **Internationalization (i18n):** `@ngx-translate/core` and `@ngx-translate/http-loader`.
  - **User Tours:** `angular-shepherd` / `shepherd.js`.
  - **Rich Text Editing:** `@ckeditor/ckeditor5-angular`.
  - **Speech Recognition:** `@capacitor-community/speech-recognition`.
  - **Dataclouder Suite:** Significant integration with custom `@dataclouder/` modules:
    - `@dataclouder/app-auth`
    - `@dataclouder/ngx-agent-cards`
    - `@dataclouder/ngx-lessons`
    - `@dataclouder/ngx-cloud-storage`
    - `@dataclouder/ngx-core`
    - `@dataclouder/ngx-mic`
- **Styling:** SCSS (`global.scss`, `variables.scss`, component styles).
- **Language:** TypeScript.

## 2. Project Structure

- **Root Directory:** Contains configuration files (`angular.json`, `ionic.config.json`, `capacitor.config.ts`, `firebase.json`, `tsconfig.*.json`, `.eslintrc.json`, `package.json`), native platform folders (`android/`, `ios/`), utility scripts (`scripts/`), and documentation (`docs/`).
- **`src/`:** Main application source code.
  - **`main.ts`:** Application entry point (bootstrapping) and global provider configuration.
  - **`app/`:** Core application logic and components.
    - **`app.component.ts/html/scss`:** Root application component shell.
    - **`app.routes.ts`:** Main application routing configuration (lazy-loading standalone components).
    - **`core/`:** Shared services, enums, base classes (e.g., `UserDataExchangeService`).
    - **`dc-user-module/`:** Specific module related to Dataclouder user management.
    - **`ionic-layout/`:** Reusable layout components (`IonicLayoutComponent`, `StackIonicComponent`) used by different route sections.
    - **`pages/`:** Feature modules/components representing application screens (Home, Landing, Login, Agent Cards, Lessons, Generics, Profile, etc.).
    - **`services/`:** Application-wide injectable services (Auth, HTTP, Toast, feature-specific services).
    - **`intro/`, `login/`:** Specific page components outside the main `/pages` structure.
  - **`assets/`:** Static assets (images, icons, fonts, audio files, translation files (`i18n/`)).
  - **`environments/`:** Environment-specific configuration (API keys, endpoints).
  - **`theme/`:** Global styles and Ionic theme variables (`variables.scss`).

## 3. Routing (`app.routes.ts`)

- Uses Angular Router with lazy-loaded standalone components (`loadComponent`).
- Routes are divided into:
  - **Public Routes (`/`):** Landing, Privacy Policy, Terms, Intro. Accessible without login.
  - **Authentication Routes (`/auth`):** Sign-in, Sign-up. Guarded by `redirectToIfAuth` to prevent access if already logged in.
  - **Protected Routes (`/page`, `/page/stack`):** Main application features. Guarded by `AuthGuardService`.
    - `/page`: Uses `IonicLayoutComponent`. Contains Home, Lessons, Generics, Test, Agents.
    - `/page/stack`: Uses `StackIonicComponent`. Contains Conversation Forms, Chat, Conversation Details, Profile. Suggests a different UI/navigation pattern for these specific flows.
- **Not Found (`**`):\*\* Handles invalid routes.
