# PWA Configuration Summary

This document summarizes the changes made to convert this Angular/Ionic application into a Progressive Web App (PWA).

## 1. Added PWA Dependencies

The first step was to add the necessary PWA dependencies to the project. This was done by running the `ng add @angular/pwa` command, which added the following packages to `package.json`:

- `@angular/pwa`
- `@angular/service-worker`

## 2. Web App Manifest

A web app manifest is a JSON file that tells the browser how your app should behave when 'installed' on the user's device.

- **Created `src/manifest.webmanifest`**: This file was created with the basic PWA metadata, including the app's name, icons, and start URL.
- **Updated `src/index.html`**: A link to the manifest file was added to the ``section of`src/index.html`.

## 3. Service Worker

The service worker is a script that runs in the background and enables features like offline access and push notifications.

- **Created `ngsw-config.json`**: This file was created to configure the service worker's caching strategies.
- **Configured Caching**: The `ngsw-config.json` file was updated to cache the application's assets and API calls, providing a better offline experience.
- **Registered Service Worker**: The service worker was registered in `src/main.ts` to be used in production builds.

## 4. PWA Icons

A set of icons for different screen sizes and resolutions is required for a PWA.

- **Created `src/assets/icons` directory**: This directory was created to store the PWA icons.
- **Added Icons**: You were guided to add the necessary PWA icons to this directory.

## 5. Build Process

The project's build configuration was updated to enable the service worker for production builds.

- **Updated `angular.json`**: The `serviceWorker` property was set to `true` in the production configuration of `angular.json`.

## Next Steps

To test the PWA features, you'll need to create a production build and serve it over HTTPS.

```bash
npm run build:prod
```

After the build is complete, you can test your PWA by serving the `www` directory with a local web server.
