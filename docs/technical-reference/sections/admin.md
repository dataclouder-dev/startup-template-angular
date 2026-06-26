# Admin Section

The Admin section provides administrative tools for managing users and application-specific rules.

## Overview
This section is located at `/page/admin` and is protected by administrative access (implicit in the route structure and guards). It serves as a hub for system-wide configuration and management.

## Route Structure
- `/page/admin`: Main admin dashboard via `AdminComponent`.
  - `/users`: User management interface using `AdminUserComponent` from `@dataclouder/ngx-users`.
  - `/agent-rules`: Management of AI agent conversation rules using `ConversationRulesComponent` from `@dataclouder/ngx-agent-cards`.

## Components

### [AdminComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/admin/admin.ts)
A shell component that hosts administrative sub-routes.
- **Key Features**:
  - Uses `AdminLayoutComponent` from `@dataclouder/ngx-core`.
  - Configures admin-specific menu items for "Users" and "Agent Rules".

### [AdminUserComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/app.routes.ts#L74)
Imported from `@dataclouder/ngx-users`, this component provides a full-featured interface for managing application users.

### [ConversationRulesComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/app.routes.ts#L78)
Imported from `@dataclouder/ngx-agent-cards`, it allows administrators to define and modify the rules that govern AI agent behavior.

## Guards and Services

### [authAndUserGuard](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/app.routes.ts#L55)
Ensures the admin user is authenticated and their profile is loaded before accessing any admin routes.
