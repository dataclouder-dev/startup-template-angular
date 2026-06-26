# Agents Section

The Agents section focuses on the management and visualization of AI Persona cards, leveraging the `@dataclouder/ngx-agent-cards` library.

## Overview
Accessible via `/page/agents`, this section provides tools to list, create, edit, and view details for AI agent personas.

## Route Structure
- `/page/agents`: Main entry point using `AgentCardRouter`.
  - `/`: (Default) List of agent cards via `AgentCardListPage`.
  - `/details/:id`: Detailed view of a specific agent card via `AgentCardDetailsPage`.
  - `/edit`: Interface to create a new agent card via `AgentCardFormPage`.
  - `/edit/:id`: Interface to edit an existing agent card via `AgentCardFormPage`.

## Components

### [AgentCardRouter](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/agent-cards/agent-card-router.ts)
A simple router shell component that hosts the sub-routes for the agent card management flow.

### [AgentCardListPage](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/agent-cards/agent-card-list/agent-card-list.ts)
Displays a collection of AI persona cards.
- **Key Features**:
  - Uses `DCAgentCardListComponent` from `@dataclouder/ngx-agent-cards`.
  - Supports filtering and action handling (view, edit, delete, new).

### [AgentCardFormPage](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/agent-cards/agent-card-form/agent-card-form.ts)
The editor interface for AI personas.
- **Key Features**:
  - Uses `DCAgentCardFormComponent` from `@dataclouder/ngx-agent-cards`.
  - Handles the complex data model for AI personas, including traits, backstories, and visual assets.

### [AgentCardDetailsPage](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/agent-cards/agent-card-details/agent-card-details.ts)
A detailed view component for a specific AI persona.
- **Key Features**:
  - Uses `DCAgentCardDetailsComponent` for high-fidelity visualization of the agent card.

## Services and Models

### [Agent Cards Library](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/app.routes.ts#L4)
This section heavily utilizes `@dataclouder/ngx-agent-cards` for core functionality, including types like `ChatRole`, `ConversationType`, and `IConversationSettings`.
