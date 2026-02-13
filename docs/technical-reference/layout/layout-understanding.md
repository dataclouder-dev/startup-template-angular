# Understanding the Layout

This document explains how the application's layout is structured, focusing on navigation and content rendering.

## Core Component: `IonicLayoutComponent`

The primary layout for application pages is defined in `IonicLayoutComponent` ([ionic-layout.component.html](file:///Users/adamo/Documents/GitHub/startup-template-angular/src/app/ionic-layout/ionic-layout.component.html)). It uses Ionic's layout system to provide a responsive experience.

### Navigation Bar (Side Menu)

The side menu is implemented using `<ion-split-pane>` and `<ion-menu>`.

- **Dynamic Items**: Navigation links are defined as arrays in [ionic-layout.component.ts](file:///Users/adamo/Documents/GitHub/startup-template-angular/src/app/ionic-layout/ionic-layout.component.ts):
  - `appPages`: Main application links.
  - `adminPages`: Links visible only to users with administrative privileges.
- **Rendering**: The HTML template iterates over these arrays using the `@for` directive to render `<ion-item>` components.

### Top Bar

The top bar (`<ion-header>`) contains:
- **Menu Toggle**: A button to show/hide the side menu.
- **Project Name**: Displayed in the `<ion-title>`.
- **Global Actions**: Dark mode toggle, PWA install button, and user profile action sheet.

### Content Rendering

Page content is rendered within the `<ion-content>` area of the `IonicLayoutComponent`.

- **Router Outlet**: The template contains a `<router-outlet>` which serves as the placeholder for child routes defined under the `page` path in [app.routes.ts](file:///Users/adamo/Documents/GitHub/startup-template-angular/src/app/app.routes.ts).
- **Responsive Layout**: On larger screens, the `ion-split-pane` allows the side menu and content to be visible simultaneously. On smaller screens, the menu is hidden and can be toggled as an overlay.

## How to Add New Sections to the Navbar

Depending on your needs, you can add new links or entirely new sections.

### 1. Adding a New Link

To add a new link to an existing section (e.g., the main menu):
1. Open [ionic-layout.component.ts](file:///Users/adamo/Documents/GitHub/startup-template-angular/src/app/ionic-layout/ionic-layout.component.ts).
2. Add a new object to the `appPages` or `adminPages` array:
   ```typescript
   { title: 'My New Page', url: '/page/my-new-page', icon: 'star' }
   ```

### 2. Adding a New Section Header

To add a new section with its own header:
1. Open [ionic-layout.component.html](file:///Users/adamo/Documents/GitHub/startup-template-angular/src/app/ionic-layout/ionic-layout.component.html).
2. Add a new `<ion-list-header>` followed by a loop or specific items:
   ```html
   <ion-list-header>New Section</ion-list-header>
   <!-- New items here -->
   ```

## Dark Mode

The layout supports a global dark mode toggle.
- **State**: Managed by the `isDarkMode` property.
- **Persistence**: The preference is saved in `localStorage`.
- **Implementation**: The `toggleDarkMode()` method adds/removes the `ion-palette-dark` class to the `document.documentElement` and the `dark` class to `document.body`.
