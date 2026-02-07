# Guide to Live2D Basics and Testing

This guide provides a foundational understanding of Live2D Cubism and how to test models within this project and using external tools.

## 1. Live2D Cubism Basics

Live2D uses a technique called "Cubism" to create 3D-like animations from 2D illustrations.

### Parameters
Parameters are the "controls" of a model. Each parameter has an ID (e.g., `ParamAngleX`, `ParamMouthOpenY`) and a range of values (usually -1.0 to 1.0 or 0.0 to 1.0).
- **Movement**: Adjusting `ParamAngleX/Y/Z` rotates the head/body.
- **Features**: Adjusting `ParamMouthOpenY` opens the mouth.

### Motions vs. Expressions
- **Motions (`.motion3.json`)**: Time-based animations. They define a sequence of parameter changes (e.g., a "wave" or "greet" animation).
- **Expressions (`.exp3.json`)**: Static "moods". They set parameter values relative to the base state (e.g., "angry" might set eye shape and mouth curve).

> [!IMPORTANT]
> **Expression Loading**: Expressions must be explicitly listed in the `model3.json` file under `FileReferences.Expressions` for them to be loaded by the engine. The engine supports both `Name` (standard Cubism export) and `name` (lowercase) property keys for the display name. If you have `.exp3.json` files but don't see them in the UI, check if they are defined in your model's JSON.

---

## 2. Testing in this Project

We have built-in tools to explore and test your models.

### Live2D Playground
Navigate to the **Live2D Playground** in our app at [http://localhost:7990/page/live2d/playground](http://localhost:7990/page/live2d/playground) to:
- **Select Models**: Browse through available models in `assets/Resources`.
- **Trigger Animations**: Use buttons to play specific motion groups.
- **Inspect Parameters**: Use the "Model Inspector" to manually slide parameter values and see how they affect the model.
- **Lip-Sync**: Use the "Speak" button to test real-time mouth movement with audio.

*See [Playground Guide](file:///Users/adamo/Documents/GitHub/startup-template-angular/docs/live2d/PLAYGROUND_GUIDE.md) for a detailed walkthrough.*

### Live2D Viewer (Transparent Mode)
To see your model in a transparent window (like a desktop pet):
```bash
npm run start:live2d
```
*See [live2d-viewer.md](file:///Users/adamo/Documents/GitHub/startup-template-angular/docs/live2d/live2d-viewer.md) for more details.*

---

## 3. External Apps & Tools

For deeper exploration or professional testing, use these standard apps:

### VTube Studio
- **Platform**: Windows, macOS, Android, iOS.
- **Purpose**: The industry standard for real-time face tracking and model testing.
- **Features**: Advanced physics testing, expression toggles, and lighting.

### Live2DViewerEX
- **Platform**: Windows, macOS, Android.
- **Purpose**: A powerful wallpaper and model viewer program. Great for seeing how models behave in different environments.

### Cubism Editor & Viewer (Official)
- **Purpose**: If you want to see how the model was built.
- **Cubism Viewer**: Part of the official SDK, used to verify `.model3.json` files and test physics/motions exactly as the artist intended.

---

## 4. Advanced: Manual Control
If you want to bypass motions and control every movement yourself (like for AI-driven characters), see our [Manual Lip-Sync Implementation](file:///Users/adamo/Documents/GitHub/startup-template-angular/docs/live2d/MANUAL_LIP_SYNC.md) for Web Audio API integration.
