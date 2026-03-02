# AI Documentation Rules & Standards

## Overview
This document defines the standard pattern for documenting Angular projects within this repository and across multiple projects. Following these rules ensures that both humans and AI assistants can easily navigate, understand, and maintain the codebase.

## General Rules
1. **Centralized Index**: Every project must have a main `index.md` at the root of its `docs/` folder. This file must contain a brief project description and relative links to all available documentation.
2. **Relative File Paths**: All markdown links must use standard relative paths (e.g., `[Lexicore Overview](./concepts/lexicore-overview.md)`). This allows AI agents to easily parse links, navigate, and read connected files.
3. **Local Scope Documentation**: Individual projects, libraries, or sub-modules can have their own `README.md` and `index.md` files localized to their respective directories.

## Standard Directory Structure
Every project must strictly follow this `docs/` folder structure, comprising four main folders:

```text
📁 docs/
├── 📄 index.md                  # Main entry point with project summary and index of all docs
├── 📁 technical-reference/      # In-depth technical details, architecture, and structural docs
│   ├── 📄 architecture.md
│   ├── 📄 layout.md
│   ├── 📄 design.md
│   ├── 📁 sections/             # Logical sections of the project (e.g., routes, modules). One file per section.
│   ├── 📁 components/           # Documentation for shared/global components. One file per component.
│   └── 📁 services/             # Main global services documentation. Includes an index.md pointing to each service doc.
├── 📁 technical-guides/         # Concrete tutorials and how-to guides for humans and AI
├── 📁 business/                 # Strategy, market research, app vision, and current tasks
└── 📁 diagrams/                 # Personal folder for Excalidraw or diagram files (ignored by AI)
```

## Directory Details

### `index.md`
- Acts as the central hub.
- Must include a brief project description.
- Must list actionable, relative links to all other documented areas.

### `technical-reference/`
- Contains all core technical and structural details of the project.
- **`architecture.md`, `layout.md`, `design.md`**: Top-level reference documents explaining the application's architecture and design choices.
- **`projects-or-libs/`**: Contains summaries and references to internal libraries or monorepo projects. The actual detailed documentation should remain inside the library's own folder, while this folder provides the high-level summary and links to them.
- **`sections/`**: Documentation organized by logical sections or routes (e.g., "Authentication", "Dashboard"). Use one file per section to describe its components, services, and models.
- **`components/`**: Specifically for reusable, shared project components (ones not bound to a single section). Use one file per component for clarity.
- **`services/`**: Documents the main conceptual and root-level services. It must contain an `index.md` file that links to all documented services here.

### `technical-guides/`
- Step-by-step instructions.
- Explains how to implement specific features or handle complex tasks.

### `business/`
- Product-focused documentation.
- Tracks the vision, market strategy, and current high-level business tasks.

### `diagrams/`
- For human-readable visual assets (e.g., Excalidraw). Not prioritized for AI parsing.
