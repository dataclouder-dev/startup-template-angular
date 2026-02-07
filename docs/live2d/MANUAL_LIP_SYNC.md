# Manual Live2D Lip-Sync Implementation Guide

This document outlines the steps to implement manual lip-sync for a Live2D model in an Angular application using `pixi-live2d-display`. This approach allows you to control the model's mouth movements from any audio source, independent of the library's built-in `speak()` function.

## Core Concept

The goal is to analyze an audio source in real-time to get its volume and then map that volume to the Live2D model's mouth parameter on every frame.

We will use the **Web Audio API** to get real-time audio data and the **Pixi.js Ticker** to create a render loop for updating the model.

---

## Step 1: Identify the Mouth Parameter ID

Before writing any code, you need to know the exact ID of the parameter that controls the model's mouth opening. This is commonly `ParamMouthOpenY`, but it can vary.

You can find this ID by inspecting the model's parameters. In your `live2d-playground.component.ts`, you already have an `extractModelInfo` function that logs these details.

1.  Run your application and load a model.
2.  Open the browser's developer console.
3.  Look for the "Model Parameters" log.
4.  Find the `ids` array and look for an ID related to the mouth, like `ParamMouthOpenY`. Note it down for the next steps.

---

## Step 2: Add Component Properties

In your component file (e.g., `live2d-playground.component.ts`), add the following properties to manage the audio analysis and lip-sync state.

```typescript
// src/app/pages/live2d/playground/live2d-playground.component.ts

// ... existing properties

export class Live2dPlaygroundComponent implements AfterViewInit {
  // ...

  // Properties for Manual Lip-Sync
  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  audioDataArray: Uint8Array | null = null;
  isLipSyncing = false;
}
```

---

## Step 3: Initialize the Web Audio API

Create methods to start and stop the lip-sync process. The `startManualLipSync` method will take an `HTMLAudioElement` as its source, initialize the Web Audio API, and connect the nodes.

```typescript
// src/app/pages/live2d/playground/live2d-playground.component.ts

// ...

  /**
   * Initializes the Web Audio API to analyze an audio element for lip-sync.
   * @param audioElement The <audio> element to use as the source.
   */
  public startManualLipSync(audioElement: HTMLAudioElement): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaElementSource(audioElement);
      this.analyser = this.audioContext.createAnalyser();

      // Configure the analyser
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.audioDataArray = new Uint8Array(bufferLength);

      // Connect the audio graph
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination); // Connect to speakers to hear the audio
    }
    this.isLipSyncing = true;
    console.log('Manual lip-sync started.');
  }

  /**
   * Stops the manual lip-sync process.
   */
  public stopManualLipSync(): void {
    this.isLipSyncing = false;
    console.log('Manual lip-sync stopped.');
  }
```

---

## Step 4: Update the Model in the Render Loop

Modify your existing `Ticker` loop to include the lip-sync logic. This code will run on every frame.

1.  Check if `isLipSyncing` is active.
2.  Get the audio data from the `analyser`.
3.  Calculate a volume value (we use RMS - Root Mean Square).
4.  Apply this value to the model's mouth parameter using `setParameterValueById`.

```typescript
// src/app/pages/live2d/playground/live2d-playground.component.ts

// Find your Ticker.shared.add() call, likely in a method like `initializeCanvas` or `deactivateMotions`.

Ticker.shared.add(() => {
  if (this.model && this.model.internalModel) {
    // === MANUAL LIP-SYNC LOGIC START ===
    if (this.isLipSyncing && this.analyser && this.audioDataArray) {
      this.analyser.getByteTimeDomainData(this.audioDataArray);

      // Calculate a volume value (RMS) from the audio data
      let sumSquares = 0.0;
      for (const amplitude of this.audioDataArray) {
        // Convert from 0-255 range to -1.0 to 1.0 range
        const normalizedAmplitude = amplitude / 128.0 - 1.0;
        sumSquares += normalizedAmplitude * normalizedAmplitude;
      }
      const rms = Math.sqrt(sumSquares / this.audioDataArray.length);

      // Amplify the value to make the mouth movement more visible, and clamp it between 0 and 1
      const volume = Math.min(1.0, rms * 10);

      // Apply the value to the mouth parameter
      // IMPORTANT: Replace 'ParamMouthOpenY' with the actual ID from your model!
      this.model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', volume);
    }
    // === MANUAL LIP-SYNC LOGIC END ===

    // Original update logic
    this.model.internalModel.coreModel?.update();
    this.model.update(Ticker.shared.deltaMS);
  }
});
```

---

## Step 5: Hook it up to the UI

Finally, add an audio element and buttons to your component's HTML template to control the process.

```html
<!-- src/app/pages/live2d/playground/live2d-playground.component.html -->

<!-- Add an audio element -->
<audio #audioPlayer src="/assets/audios/your-audio-file.mp3" controls></audio>

<!-- Add buttons to start/stop -->
<button (click)="startManualLipSync(audioPlayer)">Start Lip-Sync</button>
<button (click)="stopManualLipSync()">Stop Lip-Sync</button>
```

Now, when you play the audio and click "Start Lip-Sync", the model's mouth should move with the sound.
