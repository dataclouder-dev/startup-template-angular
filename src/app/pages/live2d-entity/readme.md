# Live2d Component Template

This is an alpha version of a reusable component class system. The goal is to provide a "plug-and-play" section that you can easily copy and adapt to your business logic.

## Usage Instructions

### 1) Copy and Setup Endpoints

1. Copy the `live2ds` folder to your desired location (e.g., `src/app/pages/my-feature`).
2. Add the corresponding endpoints to your environment or endpoint configuration:

```typescript
  MyFeature: {
    Base: 'api/my-feature-path',
    Filtered: 'api/my-feature-path/query',
  },
```

### 2) Rename the Component

Use the provided utility script to rename all occurrences of "live2d" to your new feature name.

1. Open a terminal in the newly copied folder.
2. Run the script with your new class name (PascalCase):

```bash
node rename-component.js CompetitionAnalysis
```

This script will:
- Rename all files and folders (e.g., `live2d-list` -> `competition-analysis-list`).
- Update class names (`Live2dListComponent` -> `CompetitionAnalysisListComponent`).
- Update selector prefixes and variable names.
- Rename the root folder itself.

### 3) Register Routing

After renaming, you need to register the routes in your main router (e.g., `app.routes.ts` or a parent routes file).

Example registration:

```typescript
{
  path: 'competition-analysis',
  loadChildren: () => import('./pages/competition-analysis/competition-analysis.routes').then(m => m.COMPETITION_ANALYSIS_ROUTES)
}
```

### 4) Adapt the Data Model

- Replace the `ILive2d` interface with your actual business model.
- Update the table columns and form fields to match your data.

---

## TODO / Roadmap

- [x] Add instructions for routing integration.
- [x] Automate folder renaming from the script.
- [ ] Add support for pluralization overrides if name doesn't follow standard 's' rule.
- [ ] Integrate with a CLI tool for even easier generation.
- [ ] Add unit test templates.
