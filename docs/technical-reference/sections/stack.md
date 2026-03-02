# Stack Section

The Stack section handles the interactive and personal aspects of the application, including direct AI chats and user profile management, using a "Stack" (breadcrumb/back-button based) navigation layout.

## Overview
Located at `/page/stack`, this section provides a specialized environment for focused tasks like conversation editing, real-time chat, and profile updates.

## Route Structure
- `/page/stack`: Main entry point using `StackIonicComponent`.
  - `/conversation-form`: Alias for creating an agent card persona.
  - `/conversation-form/:id`: Alias for editing an agent card persona.
  - `/chat`: Main chat interface via `AgentCardChatComponent`.
  - `/chat/:id`: Real-time chat with a specific agent persona via `AgentCardChatComponent`.
  - `/conversation-details`: View details for a conversation context.
  - `/profile`: User profile management via `ProfileComponent`.

## Components

### [StackIonicComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/ionic-layout/stack-ionic/stack-ionic.component.ts)
The layout component for this section. It optimizes the UI for a focused "stack" navigation experience, often used for deep-link or granular interaction flows.

### [AgentCardChatComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/agent-cards/agent-card-chat/agent-card-chat.ts)
The primary interface for interacting with AI agents.
- **Key Features**:
  - Uses `DCAgentCardChatComponent` from `@dataclouder/ngx-agent-cards`.
  - Supports real-time text and potentially voice-based communication.
  - Integrates with the conversation settings defined in each agent card.

### [AgentCardFormPage](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/agent-cards/agent-card-form/agent-card-form.ts)
Reused here under the `stack` route for streamlined persona editing.

### [ProfileComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/profile/profile.component.ts)
Handles user-specific settings and profile data management.

## Navigation and Layout
Unlike the main application flow (which may use tabs), the `/page/stack` route uses `StackIonicComponent` to provide a linear, hierarchical navigation experience, ensuring users can "dive deep" into interactions and easily return.
