# Live2D Playground Guide

The Live2D Playground is a dedicated environment for testing, inspecting, and interacting with Live2D models within the application.

## Accessing the Playground

The playground is available at the following route:
**[http://localhost:7990/page/live2d/playground](http://localhost:7990/page/live2d/playground)**

> [!NOTE]
> Ensure your development server is running (`npm start`) before accessing this route.

---

## Features

### 1. Model Selector
- Use the dropdown menu at the top to switch between available models located in `src/assets/Resources`.
- When a model is selected, its settings (scale, path) are automatically loaded.

### 2. Live Inspector
- **Parameters**: View and modify every parameter of the model in real-time. This is useful for finding specific IDs like `ParamMouthOpenY` for custom integrations.
- **Parts**: Inspect the different parts (layers) of the model and their current opacity.

### 3. Animation Controls
- **Play Random Animation**: Triggers a random motion from the model's defined motion groups.
- **Available Animations List**: A list of all motion groups (e.g., `Idle`, `TapBody`, `Greeting`) found in the model's `.model3.json` file. Clicking a button plays that specific animation.

### 4. Expression Controls
- **Expressions List**: All expressions defined in the model's `.model3.json` file are listed here.
- **Trigger Expression**: Clicking an expression button immediately applies that facial expression or pose to the model.

### 5. Interactions & Audio
- **Zoom**: Adjust the model's size using the slider (up to 100% for close-ups).
- **Speak**: Test the lip-sync functionality using a sample audio file.
- **Stop Speaking**: Immediately halts the current speech animation.

### 6. Camera Controls
- **Focus Face**: Intelligent framing that calculates the bounding box of the face (using hit areas like `Head` or `Face`) and automatically adjusts zoom and position to center it.
- **Reset View**: Quickly restores the model to its original scale and centered position.

---

To load expressions and animations correctly in the playground, your Live2D model must meet the following criteria in its `.model3.json` file:

1.  **FileReferences.Expressions**: 
    - Must contain an `Expressions` array.
    - Each entry MUST have a `Name` (capitalized, for UI display) or `name` property and a `File` (relative path to the `.exp3.json` file).
2.  **FileReferences.Motions**:
    - Defined as an object where keys are group names (e.g., `Idle`, `TapBody`).
    - If a group name is empty (e.g., `""`), it will be filtered out from the playground UI for clarity.

### Example Casing Support
The engine handles both `Name` and `name` properties:
```json
{
  "FileReferences": {
    "Expressions": [
      { "Name": "Happy", "File": "..." },
      { "name": "Sad", "File": "..." }
    ]
  }
}
```

---

## How it works (Technical Overview)

The playground uses the `Live2dModelComponent` which wraps the `untitled-pixi-live2d-engine`. 

1. **Initialization**: On load, it calls `Live2DModel.from(modelPath)`. The engine automatically parses the `.model3.json` and loads all referenced files, including expressions.
2. **Metadata Extraction**:
    - The component accesses `this.model.internalModel.motionManager.expressionManager`.
    - It maps the names from `expressionManager.definitions` to populate the `expressions` output property.
3. **Triggering**:
    - The playground calls `live2dModelComponent.setExpression(name)`.
    - This calls `this.model.expression(name)` on the PIXI Live2D model instance, which handles the transition and mixing of parameters.
4. **Reactive Updates**: Changing a slider in the inspector directly calls `setParameterValueById` on the underlying Live2D core model.
5. **Face Tracking Logic (`getFaceTransform`)**:
    - **Detection**: Searches `internalModel.settings.hitAreas` for IDs or Names containing "Head" or "Face".
    - **Bounding Box**: Retrieves the global bounds using `getHitAreaBounds()`. If no hit area is found, it defaults to the top 30% of the model's total height.
    - **Calculation**: 
        - Calculates a `suggestedScale` so the face occupies ~50% of the viewport height.
        - Calculates a target `X/Y` offset by comparing the face center to the model's anchor point.
    - **Coordinate Mapping**: Converts absolute PixiJS screen pixels to the 0-100 percentage values used by the Playground UI.

---

## Related Documentation
- [Live2D Integration Overview](file:///Users/adamo/Documents/GitHub/startup-template-angular/docs/live2d/index.md)
- [Exploration & Testing Guide](file:///Users/adamo/Documents/GitHub/startup-template-angular/docs/live2d/EXPLORATION_GUIDE.md)
- [Manual Lip-Sync Guide](file:///Users/adamo/Documents/GitHub/startup-template-angular/docs/live2d/MANUAL_LIP_SYNC.md)
