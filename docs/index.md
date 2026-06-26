# Dataclouder Ionic/Angular Template

Welcome to the **Dataclouder Ionic/Angular Template**, a specialized foundation for building modern, AI-powered applications. This project leverages "Agentic Persona Engineering" to create AI agents with personality, voice, and visual presence.

---

## 🚀 Project Overview

This template is designed to be the starting point for new apps. dependencies will be in the latest compatible versions. It integrates:
- **Framework**: Angular 21+ & Ionic 8+.
- **UI Toolkit**: PrimeNG 21+ for rich components.
- **Native Support**: Capacitor 7 for iOS & Android.
- **AI Core**: Dataclouder modules (`ngx-agent-cards`, `ngx-core`, `ngx-mic`) and Silly Tavern character card compatibility.
- **Auth**: Firebase Authentication (Google, Apple, Email/Password).

---

## 📂 Project Structure Guide

For AI and Developers, here is where to find the key parts of the system:

- **`src/app/pages/`**: Primary feature views (e.g., Landing, Dashboard, Agents).
- **`src/app/services/`**: Shared logic, authentication guards, and API interactions.
- **`src/app/components/`**: Reusable UI components.
- **`src/app/dc-user-module/`**: User-specific features and profile management.
- **`src/app/ionic-layout/`**: Page layout definitions (Tabs vs. Stack navigation).
- **`src/theme/`**: Global styling and Ionic/PrimeNG theme variables.

---

## 📚 Documentation Index

### 📘 Technical Guides
Practical guides for building and extending the template.
- [Example: Creating a New Project](./technical-guides/Example-new-project.md) - A step-by-step walkthrough.
- [Integrating Ionic from Scratch](./technical-guides/integrate-ionic-scrath.md) - How to start fresh with Ionic.
- [Extendible Specifications](./technical-guides/user_extendible_specs.readme) - How to extend user and system specs.

### 📗 Technical Reference
Deep dives into the architecture and core systems.
- [Application Sections](./technical-reference/sections/index.md) - Documentation for logical sections and feature areas.
- [Technical Details](./technical-reference/technical_details.md) - Full stack overview and configuration.
- [Ionic & Capacitor Usage](./technical-reference/ionic/how-is-ionic-used.md) - How layouts and native features are structured.
- [Understanding Ionic Commands](./technical-reference/ionic/understanding-ionic-command.md) - Guide to CLI abstractions and native scripts.
- [System Overview Template](./technical-reference/overview-template.md) - High-level architectural template.
- [Modularity Specs](./technical-reference/specs_systems_and_modularity.readme) - Guidelines for system modularity.
- [User Data Retrieval](./technical-reference/user_retrive_data.readme) - Strategy for fetching and persisting user data.
- [Getting Started with Ionic](./technical-reference/ionic/starting-ionic.md) - Basic setup for Ionic environments.
- [Understanding the Layout](./technical-reference/layout/layout-understanding.md) - Deep dive into patterns for navbar, menus, and content.

---

## 🤖 AI Interaction Instructions

If you are an AI agent working on this project:
1. **Context First**: Always check `docs/technical-reference/technical_details.md` for the current tech stack and configuration.
2. **Routing**: Navigation is defined in `src/app/app.routes.ts`. We use standalone components and lazy loading.
3. **Services**: Logic should reside in services (`src/app/services/`) and be injected into components.
4. **Consistency**: Use existing PrimeNG and Ionic patterns for UI. Follow the theming defined in `src/theme/variables.scss` and `src/mypreset.ts`.
5. **Data Flow**: Refer to `user_retrive_data.readme` for the recommended pattern of handling authenticated users.
