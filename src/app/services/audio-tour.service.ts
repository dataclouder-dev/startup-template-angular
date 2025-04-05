import { Injectable, inject } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';
import { StepOptions } from 'shepherd.js';

@Injectable({
  providedIn: 'root'
})
export class AudioTourService {
  private shepherdService = inject(ShepherdService);

  private audio: HTMLAudioElement | null = null;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Plays an audio file
   * @param audioPath Path to the audio file
   */
  private playAudio(audioPath: string): void {
    // Stop any currently playing audio
    this.stopAudio();

    // Create and play new audio
    this.audio = new Audio(audioPath);
    this.audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  }

  /**
   * Stops any currently playing audio
   */
  private stopAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }

  /**
   * Sets up and configures a Shepherd tour with audio
   * @param steps Array of tour steps with audio paths
   * @param startAudioPath Optional audio path to play when starting the tour
   */
  setupTour(steps: (StepOptions & { audioPath?: string })[]): void {
    // Process steps to add audio functionality
    const processedSteps = steps.map((step, index, stepsArray) => {
      // Store the audio path
      const audioPath = step.audioPath;
      
      // Add default buttons based on step position
      step.buttons = this.getDefaultButtons(index, stepsArray.length);
      
      // Process buttons to stop audio before actions
      if (step.buttons) {
        step.buttons = step.buttons.map(button => {
          const originalAction = button.action;
          const self = this;
          
          // Wrap the original action to stop audio first
          button.action = function() {
            self.stopAudio();
            if (originalAction) {
              return originalAction.call(this);
            }
          };
          
          return button;
        });
      }
      
      // Add beforeShowPromise to play audio when step is shown
      if (audioPath) {
        const originalBeforeShowPromise = step.beforeShowPromise;
        
        step.beforeShowPromise = () => {
          this.playAudio(audioPath);
          
          // Call original promise if it exists
          if (originalBeforeShowPromise) {
            return originalBeforeShowPromise();
          }
          
          return Promise.resolve();
        };
      }
      
      return step;
    });

    // Configure the tour options
    this.shepherdService.defaultStepOptions = {
      cancelIcon: { enabled: true },
      classes: 'shepherd-theme-default',
      scrollTo: true,
    };

    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
    this.shepherdService.addSteps(processedSteps as any);
  }

  /**
   * Starts the tour with optional intro audio
   * @param startAudioPath Optional path to audio file to play when starting the tour
   */
  startTour(startAudioPath?: string): void {
    // Play intro audio if provided
    if (startAudioPath) {
      this.playAudio(startAudioPath);
    }
    
    // Start the tour
    this.shepherdService.start();
    
    // Add event listeners after tour is started
    if (this.shepherdService.tourObject) {
      // Handle tour cancellation
      this.shepherdService.tourObject.on('cancel', () => {
        this.stopAudio();
      });
      
      // Handle tour completion
      this.shepherdService.tourObject.on('complete', () => {
        this.stopAudio();
      });
    }
  }

  /**
   * Generates default buttons based on step position in the tour
   * @param currentIndex Current step index
   * @param totalSteps Total number of steps
   * @returns Array of button configurations
   */
  private getDefaultButtons(currentIndex: number, totalSteps: number) {
    const buttons = [];
    
    // First step: Skip + Next
    if (currentIndex === 0) {
      buttons.push({
        classes: 'p-button p-button-secondary',
        text: 'Skip',
        action: () => this.shepherdService.cancel()
      });
      
      buttons.push({
        classes: 'p-button p-button-primary',
        text: 'Next',
        action: () => this.shepherdService.next()
      });
    }
    // Last step: Back + Finish
    else if (currentIndex === totalSteps - 1) {
      buttons.push({
        classes: 'p-button p-button-secondary',
        text: 'Back',
        action: () => this.shepherdService.back()
      });
      
      buttons.push({
        classes: 'p-button p-button-primary',
        text: 'Finish',
        action: () => this.shepherdService.complete()
      });
    }
    // Middle steps: Back + Next
    else {
      buttons.push({
        classes: 'p-button p-button-secondary',
        text: 'Back',
        action: () => this.shepherdService.back()
      });
      
      buttons.push({
        classes: 'p-button p-button-primary',
        text: 'Next',
        action: () => this.shepherdService.next()
      });
    }
    
    return buttons;
  }
}
