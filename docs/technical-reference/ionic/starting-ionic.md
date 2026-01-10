# Getting Started with Ionic

This document describes how to build and publish your application using Ionic within the Startup Template.

## Understanding the Development Environment

### Ionic vs. Capacitor?

**Capacitor** is the bridge—it's the runtime environment that allows your web application to run as a native mobile app.

**Ionic** adds a UI layer on top. It provide components specifically designed to deliver a high-quality mobile user experience that matches native platform look and feel.

There are two primary CLI tools used in this project. While they overlap, each has its strengths during development:
- Commands starting with `npx cap` are Capacitor-specific.
- Commands starting with `ionic cap` are Ionic's abstraction over Capacitor.

## Essential Commands

### 1. Live Development on Mobile
`ionic cap run android -l --external`

This command runs the project on an Android device or emulator. 
- `-l` (Live Reload): Automatically refreshes the app when code changes are detected.
- `--external`: Required to run on a physical device or external emulator.

### 2. Building for Production

This template uses a specialized workflow to ensure the correct environment configuration (`config.json`) is used.

**Recommended Build Command:**
`npm run build:prod`

This command automatically:
1. Swaps `public/config.prod.json` into `public/config.json`.
2. Runs the production Angular build (`ng build -c production`).

**Environment Swapping Scripts:**
If you need to manually change the configuration (e.g., to run standard `ionic cap` commands against a specific environment), use:
- `npm run config:dev`: Sets local development config.
- `npm run config:prod`: Sets production config.
- `npm run config:ailab` / `npm run config:homelab`: Sets server-specific configs.

## Android Setup & Deployment

The project uses Capacitor to bridge Angular to native Android. You will need **Android Studio** and the **Android SDK** installed (latest version recommended).

For detailed Android setup, refer to the [Official Capacitor Android Docs](https://capacitorjs.com/docs/android).

### Basic Native Commands
- `ionic capacitor add android`: Adds the Android platform to your project.
- `ionic capacitor sync android`: Syncs web assets and updates plugins in the native Android project.

### Run vs. Install (Important!)
It is critical to understand the difference between "running" and "installing":

- **Running (`ionic cap run`)**: Good for quickly testing UI changes. However, certain features like **Google Sign-In** or specific native plugins may not function correctly.
- **Installing (`npm run android:dev`)**: Builds, signs, and installs the APK on your device. This is **required** for validating production-level features like authentication, as it ensures proper SHA-1/SHA-256 fingerprint matching for Firebase/Google services.

### Install Android App 



##### Manual Install

> Remember what you have in www folder is your web app, usally for regular apps the folder is dist,  so you make sure www have your last version. 


npm run build:prod : the command uses config.prod.json 

cap sync android : syncs the web assets to the native android project 

cap open android: opens the android project in Android Studio








## Troubleshooting

### Device Not Recognized?
If your device doesn't show up, run:
`adb devices -l`

Connecting to physical devices can sometimes be unstable. Try these steps:
1. Restart your phone.
2. Toggle "USB Debugging" off and then back on in Developer Options.
3. Ensure you are using a high-quality data cable.

### Local Server Connection
When debugging on a physical device, you may need to connect to a local development server. Note that if you install the app without live reload, it will point to the bundled web assets rather than your local machine's IP. Ensure your `capacitor.config.ts` or CLI arguments correctly point to your development server's IP if you need to debug live backend interactions.