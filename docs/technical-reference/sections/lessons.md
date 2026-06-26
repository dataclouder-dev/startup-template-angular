# Lessons Section

The Lessons section provides a platform for users to explore, view, and interact with educational content focused on personal development and coaching.

## Overview
This section is located at `/page/lessons` and consists of a list of available lessons, detailed views for individual lessons (including an AI-driven interactive evaluation), and editor tools for creating or modifying lessons.

## Route Structure
- `/page/lessons`: Main entry point using `ExplorePage` which acts as a router outlet.
  - `/`: (Default) Shows the list of lessons via `LessonListComponent`.
  - `/details/:id`: Shows lesson content and AI interaction via `LessonDetailsComponent`.
  - `/edit`: Interface for creating a new lesson via `ExploreEditComponent`.
  - `/edit/:id`: Interface for editing an existing lesson via `ExploreEditComponent`.
  - `/list`: Alternative path to `LessonListComponent`.

## Components

### [ExplorePage](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/lessons/explore.page.ts)
A shell component that hosts the sub-routes for the lessons section. It uses `IonicModule` and `RouterModule`.

### [LessonListComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/lessons/lesson-list/lesson-list.component.ts)
Displays a collection of lessons. 
- **Key Features**: 
  - Uses `DCLessonListComponent` from `@dataclouder/ngx-lessons`.
  - Handles actions like `new`, `edit`, `select` (take lesson), and `remove`.
  - Navigates to details or edit pages based on user interaction.

### [LessonDetailsComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/lessons/lesson-details/lesson-details.component.ts)
Displays the content of a specific lesson and provides an AI conversation interface for evaluation.
- **Key Features**:
  - Uses `DCLessonRendererComponent` for rendering lesson content.
  - Injects `LESSONS_TOKEN` and `LessonConversationService`.
  - Configures `IConversationSettings` for an AI assistant that helps the user understand the lesson through questions.
  - Supports text-to-speech (TTS) via `es-US-Chirp3-HD-algenib` voice.

### [ExploreEditComponent](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/lessons/explore-edit/explore-edit.component.ts)
Provides a form for creating or editing lesson data.
- **Key Features**:
  - Uses `DCLessonEditorComponent` from `@dataclouder/ngx-lessons`.

## Services and Models

### [LESSONS_TOKEN](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/lessons/lesson-details/lesson-details.component.ts#L16)
Injected token to interact with the lessons data layer.

### [LessonConversationService](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/lessons/lesson-details/lesson-details.component.ts#L18)
Service used to manage the AI conversation settings and state during lesson interaction.

### [Lesson Prompts](file:///Users/adamo/Documents/GitHub/startup-template/startup-template-angular/src/app/pages/lessons/lesson-prompts.ts)
Contains prompt engineering definitions for:
- Lesson content generation (`getContentLessonGeneration`).
- Banner image suggestions (`getImageSuggestion`).
- Lesson descriptions/summaries (`getDescriptionPrompt`).
- Includes specialized skills like `MarkdownWriterSkill` and `PersonalCoachSkill`.