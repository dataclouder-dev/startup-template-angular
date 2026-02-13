# Live2D Model Loading Process

This document explains how Live2D Cubism models are loaded and initialized within the application using the [Live2dModelComponent](file:///Users/adamo/Documents/GitHub/startup-template-angular/src/app/components/live2d-model/live2d-model.component.ts).

The application uses the `untitled-pixi-live2d-engine` which acts as a bridge between **PixiJS** and the **Live2D Cubism SDK**.

---

## 1. The Entry Point: `.model3.json`

Every model starts with a definition file. Think of the `.model3.json` as the **manifest** or **map** that tells the engine where to find all the binary and specialized data files.

### Example Analysis: `conejo.model3.json`

Taking the [conejo.model3.json](file:///Users/adamo/Documents/GitHub/startup-template-angular/public/assets/Resources/conejo/conejo.model3.json) as an example:

```json
{
  "Version": 3,
  "FileReferences": {
    "Moc": "conejo.moc3",
    "Textures": [ "conejo.2048/texture_00.png" ],
    "Physics": "conejo.physics3.json",
    "DisplayInfo": "conejo.cdi3.json",
    "Motions": {
      "nervous": [ { "File": "1.motion3.json" } ],
      "sad": [ { "File": "2.motion3.json" } ]
    }
  }
}
```

| Field | Purpose |
| :--- | :--- |
| **`Moc`** | Path to the `.moc3` file. This is the **Core Model Binary**. It contains the vertices, IDs, and deformation logic. |
| **`Textures`** | An array of image files (usually PNGs). The `.moc3` file references "Texture Atlas" indices which are mapped to these files. |
| **`Physics`** | Path to `.physics3.json`. Contains mathematical definitions for hair swaying, clothing movement, and gravity effects. |
| **`Motions`** | Groups of animation files (`.motion3.json`). These contain keyframe data for Parameter IDs (e.g., `ParamAngleX`). |
| **`DisplayInfo`** | Path to `.cdi3.json`. Maps technical IDs (like `ParamMouthOpenY`) to human-readable names. |

---

## 2. Technical Loading Sequence

The loading process is handled by the `Live2dModelComponent` in several distinct phases:

### Phase A: Engine Fetching
1. The component receives a `modelPath` (e.g., `/assets/Resources/conejo/conejo.model3.json`).
2. It calls `Live2DModel.from(modelPath)`.
3. The engine fetches the JSON file first.
4. **Resolution**: The engine automatically detects the base directory of the JSON. All other paths (like `conejo.moc3`) are resolved **relative** to that base directory.

### Phase B: Binary Initialization
1. The engine fetches the `.moc3` file.
2. It passes this binary data to the **Live2D Cubism Core** (a WebAssembly or JS-compiled library).
3. The Core initializes the model's internal state, registering all Parameters and Parts.

### Phase C: Resource Loading (Parallel)
1. **Textures**: The engine loads all images listed in `Textures`. They are converted into PixiJS `Texture` objects.
2. **Metadata**: Physics and CDI files are parsed to enable real-time simulation and naming.
3. **Internal Managers**: The `MotionManager` and `ExpressionManager` are created, pre-scanning the JSON for available animation groups.

### Phase D: Component Emission
Once fully loaded, the component calls `extractModelInfo()` to get the current state and emits the `modelLoaded` event:
```typescript
this.modelLoaded.emit({ 
  parameters: this.modelParameters, 
  parts: this.modelParts, 
  motions: this.motionGroups, // e.g. ["Idle", "nervous"]
  expressions: this.expressions
});
```

---

## 3. Important File Formats

| File Extension | Content Type | Role |
| :--- | :--- | :--- |
| **`.moc3`** | Binary | **The Brain.** Non-human readable. Contains the mesh and rigging. |
| **`.model3.json`** | Text (JSON) | **The Map.** Connects all other files together. |
| **`.motion3.json`** | Text (JSON) | **The Movement.** Time-based values used to override Parameter values (lip-sync, body movement). |
| **`.exp3.json`** | Text (JSON) | **The Preset.** A static set of Parameter values that "add" onto the model (e.g., "Blush" or "Angry Eyes"). |
| **`.physics3.json`** | Text (JSON) | **The Simulation.** Logic for how parts react to movement (momentum, friction). |

---

## 4. How the Component Controls the Model

Once loaded, the `Live2dModelComponent` interacts with the model via the PIXI engine:

- **Parameters**: `coreModel.setParameterValueById(id, value)` updates the mesh in the next frame.
- **Animations**: `model.motion(groupName)` starts playing a `.motion3.json` sequence.
- **Lip-Sync**: When `speak(audioUrl)` is called, the engine analyzes the audio amplitude and dynamically maps it to the `ParamMouthOpenY` parameter.

> [!TIP]
> Use the **Playground** to inspect these Parameters in real-time. It reveals exactly which IDs are being moved by a specific motion.
