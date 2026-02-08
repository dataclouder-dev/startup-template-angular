# Live2D Integration Guide

This guide explains how Live2D models are integrated into the project using [PixiJS v8](https://pixijs.com/) and the [untitled-pixi-live2d-engine](https://github.com/Lost-Sorrow/untitled-pixi-live2d-engine) library.

## Setup

### 1. Library Loading
The Live2D Core and PixiJS libraries are loaded in `src/index.html`:

```html
<!-- Live2D Core -->
<script src="/assets/live2d/core/live2dcubismcore.js"></script>
<script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>
```

### 2. Angular Component
We use a standalone component `Live2dModelComponent` to wrap the PixiJS canvas and manage the model lifecycle.

**File**: [live2d-model.component.ts](file:///Users/adamo/Documents/GitHub/startup-template-angular/src/app/components/live2d-model/live2d-model.component.ts)

#### Key Inputs
- `modelPath`: Path to the `.model3.json` or `.model.json` file.
- `scale`: Initial scale of the model (default: `0.1`).

#### Key Outputs
- `modelLoaded`: Emitted when the model is successfully loaded, providing info about parameters, parts, and motions.

## Basic Usage

To display a model, add the component to your template:

```html
<app-live2d-model 
  [modelPath]="'/assets/Resources/模型名称/模型名称.model3.json'" 
  [scale]="0.08">
</app-live2d-model>
```

## Features

### Animations & Motions
The component provides methods to play motions:
- `playAnimation(groupName: string)`: Plays a specific motion group.
- `playRandomAnimation()`: Plays a random motion from the model's available groups.

### Speech (Lip-Sync)
- **Speak**: Test the lip-sync functionality using a sample audio file.
- **Stop Speaking**: Immediately halts the current speech animation.

### Camera Controls
- **Focus Face**: Intelligent framing that calculates the bounding box of the face (using hit areas like `Head` or `Face`) and automatically adjusts zoom and position to center it.
- **Reset View**: Quickly restores the model to its original scale and centered position.
- **Extended Zoom**: The manual zoom slider supports up to 100% (close-up) scale for detailed inspection.

### Live Interactions
- `updateModelParameter()`: Directly modify model parameters (e.g., eye movement, body rotation).
- `onZoomChange(value: number)`: Dynamically adjust the model scale.
- `getFaceTransform()`: Calculates the optimal zoom and coordinates to focus on the model's face based on hit areas.

### Camera & Viewport Control
The component supports intelligent framing:
- **Focus Face**: Uses `getFaceTransform()` to identify the face region (via "Head" or "Face" hit areas) and centers it in the viewport with an optimized zoom.
- **Auto-Positioning**: When switching models, the playground automatically resets the X/Y coordinates to center the new model.
- **Extended Zoom**: The manual zoom slider supports up to 100% scale for close-up inspections.

#### Face Tracking Logic (`getFaceTransform`)
1. **Detection**: Searches `internalModel.settings.hitAreas` for IDs or Names containing "Head" or "Face".
2. **Bounding Box**: Retrieves bounds using `getHitAreaBounds()`. If no hit area is found, it defaults to the top 30% of the model's total height.
3. **Calculation**: 
    - Calculates a `suggestedScale` so the face occupies ~50% of the viewport height.
    - Calculates a target `X/Y` offset by comparing the face center to the model's anchor point.
4. **Coordinate Mapping**: Converts absolute PixiJS screen pixels to the 0-100 percentage values used by the Playground UI.

## Audio Synchronization with Chat

To synchronize the Live2D model with the chat audio, you can listen to the `chatEvent` output of the `dc-chat` component and trigger the `speak()` method on the model.

### 1. Update Template
Listen for the `audioStarted` event in the chat component:

```html
<dc-chat 
  [agentCard]="agentCard" 
  (chatEvent)="onChatEvent($event)">
</dc-chat>

<app-live2d-model #live2dModel ...></app-live2d-model>
```

### 2. Handle Orchestration in Component
In your component, handle the event and call the model's speech method:

```typescript
@ViewChild('live2dModel') live2dModel!: Live2dModelComponent;

public onChatEvent(event: ChatEvent) {
  if (event.type === ChatEventType.AudioStarted) {
    const message: MessageContent = event.payload;
    if (message.audioUrl) {
      this.live2dModel.speak(message.audioUrl);
    }
  }
}
```

This approach ensures that the model's mouth begins moving exactly when the chat component's orchestration layer triggers the playback of an audio segment.
But there is a problem, audios will overlap if computer is fast, you dont notice, but some other you can hear 2 voices at the same time. 
Solution: not sure, lower volume doesn't help. becouse model understand that is slow talking and move mouth slowly and not looks natural. 

---

## Troubleshooting & Advanced
- [Exploration & Testing Guide](file:///Users/adamo/Documents/GitHub/startup-template-angular/docs/live2d/EXPLORATION_GUIDE.md): Understanding Live2D basics and tools.
- [Playground Guide](file:///Users/adamo/Documents/GitHub/startup-template-angular/docs/live2d/PLAYGROUND_GUIDE.md): How to use the built-in model inspector.
- [Live2D Viewer & Transparency](file:///Users/adamo/Documents/GitHub/startup-template-angular/docs/live2d/live2d-viewer.md): How to test models in a transparent window.
- [Manual Lip-Sync Implementation](file:///Users/adamo/Documents/GitHub/startup-template-angular/docs/live2d/MANUAL_LIP_SYNC.md): Detailed guide for real-time audio analysis and custom mouth control.
