# Integrating Ionic from Scratch

While this template comes pre-configured, knowing how to integrate Ionic or start a fresh project is essential for understanding the underlying structure.

---

## 📥 Installation

First, ensure you have the Ionic CLI installed globally:

```bash
npm install -g @ionic/cli
```

## 🆕 Starting a New Project

To start a completely new Ionic app:

```bash
ionic start
```

This interactive command will guide you through:
1. **Framework Selection**: (Angular, React, or Vue). This project uses **Angular**.
2. **Project Template**: (tabs, sidemenu, blank).
3. **Standalone Components**: Recommended for modern Angular apps.

---

## 🏗️ Adding Capacitor

If you have an existing Angular app and want to "Ionize" it with native features:

1. **Add Capacitor**:
   ```bash
   ng add @capacitor/angular
   ```
2. **Initialize Capacitor**:
   ```bash
   npx cap init
   ```
3. **Add Platforms**:
   ```bash
   npx cap add ios
   npx cap add android
   ```

## 💡 Pro Tip for this Template
This template uses a hybrid approach: **PrimeNG** for the content and **Ionic** for the shell. If you are starting from scratch, remember to include the PrimeNG theme presets and the `IonApp` / `IonRouterOutlet` structure in your `app.component.html` to maintain the mobile-native feel.