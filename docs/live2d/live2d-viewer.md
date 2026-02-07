# Live2D Viewer

This document explains how to run the application in a special Chrome instance that mimics the Live2D studio environment.

## Prerequisites

- Node.js and npm installed
- Google Chrome installed in the default location for your operating system

## Running the Viewer

To run the Live2D viewer, use the following command:

```bash
npm run start:live2d
```

This command will:

1.  Start the Angular development server.
2.  Wait for the server to be ready.
3.  Launch a new Chrome instance with the following flags:
    - `--app=http://localhost:4200`
    - `--enable-transparent-visuals`
    - `--disable-gpu-sandbox`

This will open the application in a borderless window with a transparent background, which is ideal for testing Live2D models.

## Making the Background Transparent

For the transparent effect to work, you also need to ensure your application's background is set to transparent in your global stylesheet. The following CSS has been added to `src/global.scss`:

```scss
html,
body,
ion-app,
.ion-page,
ion-content {
  background: transparent !important;
}
```
