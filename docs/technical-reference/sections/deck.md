# Deck Section (Deck Commander)

The Deck section (branded as Deck Commander) is a specialized toolset for managing "decks"—likely collections of AI agents, personas, or scenarios.

## Overview
Located at `/page/deck`, this section provides a full CRUD interface for deck management, including a dashboard view.

## Route Structure
- `/page/deck`: Main entry point.
  - `/`: (Default) List of all decks via `DeckCommanderListComponent`.
  - `/details/:id`: Detailed view of a specific deck via `DeckCommanderDetailComponent`.
  - `/edit`: Interface to create a new deck via `DeckCommanderFormComponent`.
  - `/edit/:id`: Interface to edit an existing deck via `DeckCommanderFormComponent`.
  - `/dashboard`: Interactive dashboard view via `DeckCommanderComponent`.

## Components

### [DeckCommanderListComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/deck-commander/deck-commander-list/deck-commander-list.component.ts)
Displays a grid or list of available decks.
- **Key Features**:
  - Handles navigation to deck creation, editing, and details.
  - Likely visualizes deck status or summary information.

### [DeckCommanderFormComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/deck-commander/deck-commander-form/deck-commander-form.component.ts)
A unified form component for creating and updating decks.
- **Key Features**:
  - Dynamically handles `:id` parameter to fetch existing deck data if applicable.
  - Provides inputs for deck metadata and configuration.

### [DeckCommanderDetailComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/deck-commander/deck-commander-detail/deck-commander-detail.component.ts)
Provides a read-only or semi-interactive detailed view of a deck's contents and performance metrics.

### [DeckCommanderComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/deck-commander/dashboard-commander/deck-commander-dashboard.ts)
The "Dashboard" view for Deck Commander, providing a high-level overview or orchestration interface for multiple decks.

## Guards and Services

### [DeckCommanderService](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/deck-commander/deck-commander.service.ts)
(Assumed based on folder structure) Manages data fetching, persistence, and state for the Deck Commander feature.
