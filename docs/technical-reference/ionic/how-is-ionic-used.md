# Ionic & Capacitor Usage Reference

This document clarifies the role of Ionic and Capacitor within the Dataclouder template. While the UI is primarily driven by PrimeNG, Ionic and Capacitor provide the essential infrastructure for cross-platform and native capabilities.

---

## 🏗️ UI & Layout Infrastructure

Ionic is used strategically for high-level layouts rather than individual UI components.

### Core Layouts
- **Ionic Layout (`IonicLayoutComponent`)**: 
  - Located at `src/app/ionic-layout/ionic-layout.component.ts`.
  - Provides the main application Shell using `IonSplitPane` for side-menu navigation on desktop and an adaptive mobile view.
  - Manages Dark Mode using `@ionic/angular`'s theming system (`ion-palette-dark`).
- **Stack Layout (`StackIonicComponent`)**:
  - Located at `src/app/ionic-layout/stack-ionic/stack-ionic.component.ts`.
  - Used for linear navigation (e.g., Profile, Settings).
  - Utilizes `IonBackButton` to provide a native-like "back" experience without a full page reload.

### Mobile-First Components
- **IonFooter**: Specifically used to host mobile navigation buttons and fixed interactions.
- **IonContent & IonHeader**: Ensure smooth scrolling and fixed headers that respect "Safe Areas" on mobile devices (e.g., notches).

---

## ⚡ Capacitor & Native Features

Capacitor serves as the bridge between the web code and native device APIs. In this template, most Capacitor features are abstracted through **Dataclouder Libraries** to ensure consistent behavior across platforms.

### Native Plugins Integrated
- **Auth**: `@capacitor-community/apple-sign-in` and `@codetrix-studio/capacitor-google-auth`.
- **Sensory**: `@capacitor/haptics` for tactile feedback during interactions.
- **Interface**: `@capacitor/keyboard` and `@capacitor/status-bar` for managing mobile system UI.
- **Voice**: `@capacitor-community/speech-recognition` (wrapped by `@dataclouder/ngx-mic`).

### Development Workflow
- **Live Reload**: Used primarily via `ionic cap run android -l --external` during development.
- **Syncing**: Native projects (`/ios` and `/android`) are updated using `npx cap sync` after assets or configuration changes.

---

## 💡 Summary for AI & Developers
1. **Don't use Ionic for standard UI**: Use **PrimeNG** for buttons, cards, and forms.
2. **Use Ionic for structural Shells**: If you need a new layout type (e.g., a full-screen modal or a new tabbed view), use Ionic components.
3. **Capacitor is the "Glue"**: If you need to access a device feature (camera, GPS, storage), look for a Capacitor plugin or a Dataclouder service first.
