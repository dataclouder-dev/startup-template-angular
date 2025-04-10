# Technical Documentation: Dataclouder Ionic/Angular Template

## 1. Introduction

This document provides technical details for the `dataclouder-template` project, an Angular/Ionic application template designed as a foundation for new projects.

- **Project Name:** `dataclouder-template` (Configurable via `make rename-project`)
- **Purpose:** A ready-to-use Angular/Ionic template integrating Firebase Authentication and various Dataclouder modules, supporting web, Android, and iOS platforms.
- **Technology Stack:**
  - **Frontend Framework:** Angular (~v19)
  - **UI Toolkit:** Ionic Framework (~v8) with PrimeNG (~v19) components
  - **Native Runtime:** Capacitor (~v6)
  - **Language:** TypeScript (~v5.7)
  - **Styling:** SCSS (with PrimeNG themes/presets)
  - **Authentication:** Firebase Authentication
  - **State Management/Core:** RxJS, Dataclouder Core modules
  - **Build Tool:** Angular CLI
- **Key Features:**
  - Firebase Authentication (Email/Password, Google, Apple Sign-In)
  - Dataclouder Module Integrations (`app-auth`, `ngx-agent-cards`, `ngx-lessons`, `ngx-cloud-storage`, `ngx-core`, `ngx-mic`)
  - Native Mobile Support (Android, iOS) via Capacitor
  - Web Application Support
  - Capacitor Plugins (Speech Recognition, Haptics, Status Bar, Keyboard, Google Auth, Apple Sign-In)
  - UI Components (PrimeNG, Swiper, Shepherd.js for tours)
  - CI/CD Automation via Google Cloud Build (Setup described in `readme.md`)
  - Theming support via PrimeNG presets and Ionic CSS variables.

## 2. Prerequisites & Setup

Refer to the main `readme.md` for detailed setup instructions, including automatic project renaming and Firebase initialization using `make`.

- **Core Dependencies:**
  - Node.js (Check `.nvmrc` or project requirements if available) & npm
  - Angular CLI: `npm install -g @angular/cli`
  - Ionic CLI: `npm install -g @ionic/cli`
  - Capacitor CLI: `npm install -g @capacitor/cli`
- **Native Development (Optional):**
  - Android Studio (for Android builds)
  - Xcode (for iOS builds)
- **Installation:**
  ```bash
  npm install
  ```
  (Or use `make init-project` for guided setup)
- **Running Locally (Web):**
  ```bash
  npm start # Runs ng serve (development configuration)
  # or
  ionic serve
  ```
  Other environments: `npm run start:qa`, `npm run start:prod`
- **Running on Native Platforms:**
  - **Android (Debug):** `npm run android:debug` (Live reload)
  - **Android (Dev Build):** `npm run android:dev`
  - **Android (Prod Build):** `npm run android:pro`
  - **iOS (Dev Build):** `npm run ios:dev`
  - **iOS (Prod Build):** `npm run ios:prod`
  - **iOS (Simulator):** `npm run ios:dev-sim` (Requires specifying target simulator ID)

## 3. Project Structure Overview

- **`src/`**: Main application source code.
  - **`app/`**: Core Angular application logic.
    - `app.component.*`: Root application component.
    - `app.routes.ts`: Main application routing configuration (lazy-loaded modules).
    - `components/`: Shared/reusable UI components (e.g., sliders, headers).
    - `core/`: Core application logic (enums, potentially guards, interceptors - though guards are currently in `services/`).
    - `dc-user-module/`: Components/logic related to Dataclouder user features.
    - `intro/`: Application introduction/onboarding flow components.
    - `ionic-layout/`: Components defining the main Ionic page layouts (tabbed, stacked).
    - `live2d-demo/`: Components for the Live2D demo feature.
    - `login/`: Authentication pages (Sign In, Sign Up).
    - `pages/`: Feature-specific pages/views (Home, Lessons, Agents, Profile, etc.).
    - `services/`: Shared application services (e.g., `AuthGuardService`, API interaction logic).
  - **`assets/`**: Static assets (images, icons, fonts, audio, Live2D models).
  - **`environments/`**: Environment-specific configuration (`environment.ts`, `environment.prod.ts`). Loaded based on build configuration in `angular.json`.
  - **`theme/`**: Global styling (`variables.scss` for Ionic CSS variables).
  - `global.scss`: Global styles, import of Ionic styles, PrimeNG theme overrides.
  - `main.ts`: Main application bootstrap file.
  - `polyfills.ts`: Polyfills for browser compatibility.
  - `index.html`: Main HTML entry point.
  - `mypreset.ts`: Custom PrimeNG theme preset definition.
- **`android/`**: Capacitor Android native project.
- **`ios/`**: Capacitor iOS native project.
- **`scripts/`**: Utility scripts (project renaming, version syncing, deployment).
- **`docs/`**: Project documentation files.
- **`www/`**: Output directory for web builds (specified in `angular.json` and `capacitor.config.ts`).
- **Configuration Files:**
  - `angular.json`: Angular CLI workspace configuration (builds, serve, test, lint).
  - `package.json`: Project metadata, npm dependencies, and scripts.
  - `ionic.config.json`: Ionic project configuration (name, integrations, type).
  - `capacitor.config.ts`: Capacitor native project configuration (app ID, name, web directory).
  - `tsconfig.*.json`: TypeScript compiler configuration.
  - `.eslintrc.json`: ESLint configuration for code linting.
  - `firebase.json`, `.firebaserc`: Firebase project configuration (hosting, functions, etc.).
  - `cloudbuild.yaml`: Google Cloud Build configuration file.
  - `makefile`: Make utility for automating common tasks (setup, build, deploy).

## 4. Key Modules & Features

- **Routing (`app.routes.ts`):**
  - Uses Angular standalone components and lazy loading extensively.
  - Defines public routes (landing, legal), authentication routes, and protected feature routes.
  - Employs `AuthGuardService` (custom) and `redirectToIfAuth` (from `@dataclouder/app-auth`) for route protection.
  - Features two main authenticated layouts: `IonicLayoutComponent` (tabs) and `StackIonicComponent` (stack navigation).
- **Authentication:**
  - Handled primarily by `@dataclouder/app-auth` module, integrating with Firebase Authentication.
  - Supports Email/Password, Google Sign-In (`@codetrix-studio/capacitor-google-auth`), and Apple Sign-In (`@capacitor-community/apple-sign-in`).
  - Login/Signup UI located in `src/app/login/`.
- **Dataclouder Integrations (`@dataclouder/*`):**
  - `app-auth`: Core authentication logic and guards.
  - `ngx-agent-cards`: UI and logic for agent/conversation features (`src/app/pages/agent-cards/`).
  - `ngx-lessons`: UI and logic for lesson features (`src/app/pages/lessons/`).
  - `ngx-cloud-storage`: Service for interacting with cloud storage (likely Firebase Storage).
  - `ngx-core`: Core utilities or services shared across Dataclouder modules.
  - `ngx-mic`: Microphone interaction service, likely used with Speech Recognition.
- **UI Components & Styling:**
  - Uses Ionic Framework components for core layout and mobile UI patterns.
  - Integrates PrimeNG for a rich set of UI components (buttons, forms, tables, etc.).
  - Theming is managed via:
    - Ionic CSS Variables (`src/theme/variables.scss`).
    - PrimeNG Theming/Presets (`src/mypreset.ts`, global overrides in `src/global.scss`).
    - Refer to `readme.md` for detailed theming instructions.
  - Shared custom components are in `src/app/components/`.
  - `angular-shepherd` is used for guided tours.
- **Native Features (Capacitor Plugins):**
  - `@capacitor-community/speech-recognition`: For voice input.
  - `@capacitor/haptics`: Provides haptic feedback.
  - `@capacitor/status-bar`: Controls the native status bar appearance.
  - `@capacitor/keyboard`: Manages the native keyboard behavior.
  - Google/Apple Sign-In plugins (mentioned in Authentication).
- **State Management/Services:**
  - Primarily relies on Angular services (`src/app/services/`) and RxJS for managing application state and asynchronous operations.
  - Specific state logic might be encapsulated within the `@dataclouder/*` modules.

## 5. Configuration & Environments

- **Angular Build (`angular.json`):**
  - Defines build configurations (`production`, `development`, `ci`).
  - `production` config enables optimizations, output hashing, and uses `environment.prod.ts`.
  - `development` config disables optimizations for faster builds and enables source maps.
  - Specifies `outputPath` as `www`.
- **Capacitor (`capacitor.config.ts`):**
  - Sets the native `appId` and `appName`. Must be unique, especially for store deployment.
  - Points to `webDir: 'www'` for the web assets.
- **Environment Files (`src/environments/`):**
  - `environment.ts`: Default configuration (used for development).
  - `environment.prod.ts`: Production configuration.
  - Contains Firebase credentials and potentially backend API endpoints. File replacement is handled by `angular.json`.
- **Firebase (`firebase.json`, `.firebaserc`):**
  - Configures Firebase services, primarily Hosting in this template.
  - `.firebaserc` maps project aliases (e.g., `default`, `dev`, `prod`) to Firebase project IDs.
  - `firebase.json` defines hosting rules (directory, rewrites for SPA).
- **Native Configuration:**
  - Detailed setup for Android (keystores, `build.gradle`) and iOS (certificates, `Info.plist`, Xcode settings) is outlined in `readme.md`.

## 6. Build & Deployment

- **Web Build:**
  - Development: `ng build` or `ng build -c development`
  - Production: `npm run build` (which runs `ng build -c production`)
- **Deployment (Firebase Hosting):**
  - Manual: `npm run deploy` (Deploys the `production` build to the Firebase project specified as `default` in `.firebaserc`). Modify `.firebaserc` or use `firebase deploy --only hosting:your-alias` for other environments.
  - Automatic (CI/CD): Configured via `cloudbuild.yaml` for Google Cloud Build. Requires setup described in `readme.md`.
- **Native Builds:**
  - Use the specific `npm run android:*` and `npm run ios:*` scripts defined in `package.json`. These typically combine `ng build`, `cap copy`, and native build commands (`gradlew assemble*`, Xcode build).
- **Versioning:**
  - `npm version patch --no-git-tag-version` increments the version in `package.json`.
  - `node scripts/sync-version.js` likely updates the version in other places (e.g., native projects). This runs automatically as a `prebuild` step.

## 7. Linting & Testing

- **Linting:**
  - Uses ESLint with Angular-specific plugins (`@angular-eslint`).
  - Configuration: `.eslintrc.json`.
  - Run: `npm run lint`
- **Unit Testing:**
  - Uses Karma test runner and Jasmine framework.
  - Configuration: `karma.conf.js`, `tsconfig.spec.json`.
  - Run: `npm run test`
