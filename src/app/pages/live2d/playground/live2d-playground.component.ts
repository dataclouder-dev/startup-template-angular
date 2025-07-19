import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ModelInfoComponent } from '../l2d-model-info/model-info.component';
import { ModelParameters, ModelParts } from '../models/live2d-types';

import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch';

import { Application, Ticker } from 'pixi.js';

@Component({
  selector: 'app-live2d-playground',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, DropdownModule, AccordionModule, FormsModule, CardModule, TableModule, SliderModule, ModelInfoComponent],
  templateUrl: './live2d-playground.component.html',
  styleUrl: './live2d-playground.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Live2dPlaygroundComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  app!: Application;
  model: any;
  modelParameters: ModelParameters | null = null;
  modelParts: ModelParts | null = null;
  motionGroups: string[] = [];

  modelZoom = 15; // Initial zoom level

  availableModels = [
    { name: 'Hiyori', path: '/assets/Resources/Hiyori/Hiyori.model3.json', scale: 0.15 },
    { name: 'Mao', path: '/assets/Resources/Mao/Mao.model3.json', scale: 0.08 },
    { name: 'Haru', path: '/assets/Resources/Haru/Haru.model3.json', scale: 0.15 },
    { name: 'Mio', path: '/assets/Resources/Mio/Mio.model3.json', scale: 0.15 },
    { name: 'Mark', path: '/assets/Resources/Mark/Mark.model3.json', scale: 0.15 },
    { name: 'Natori', path: '/assets/Resources/Natori/Natori.model3.json', scale: 0.15 },
    { name: 'Rice', path: '/assets/Resources/Rice/Rice.model3.json', scale: 0.15 },

    { name: 'Alexia', path: '/assets/Resources/Alexia/Alexia.model3.json', scale: 0.07 },
    { name: 'Ellot', path: '/assets/Resources/ellot/ellot.model3.json', scale: 0.14 },
    { name: 'Tachie03', path: '/assets/Resources/tachie03/tachie03.model3.json', scale: 0.06 },
    { name: 'NVPU', path: '/assets/Resources/NVPU-demo/NVPU.model3.json', scale: 0.11 },
    { name: '简', path: '/assets/Resources/简/简.model3.json', scale: 0.08 },
  ];

  selectedModel = this.availableModels[0];

  constructor(private cdr: ChangeDetectorRef) {}

  async ngAfterViewInit(): Promise<void> {
    await this.initializeCanvas();
    await this.loadModel(this.selectedModel.path);
  }

  async initializeCanvas(): Promise<void> {
    this.app = new Application({
      view: document.getElementById('canvas') as HTMLCanvasElement,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: true,
    });
  }

  async loadModel(modelPath: string): Promise<void> {
    // Clear previous model if exists
    if (this.model) {
      this.app.stage.removeChild(this.model);
      this.model.destroy();
    }

    // Load new model
    this.model = await Live2DModel.from(modelPath, {
      ticker: Ticker.shared,
      autoUpdate: false, // Disable automatic updates
    });

    this.app.stage.addChild(this.model);

    // Extract model parameters
    this.extractModelInfo();

    // Apply transformations
    this.model.x = 300;
    this.model.y = 300;
    this.model.scale.set(this.selectedModel.scale, this.selectedModel.scale);
    this.model.anchor.set(0.5, 0.5);

    this.deactivateMotions();

    // Add interaction (disabled to prevent motion triggering)
    /*
    (this.model as any).on('hit', (hitAreas: string[]) => {
      if (hitAreas.includes('body')) {
        this.model.motion('tap_body');
      }
    });
    */

    // Force change detection to update the UI
    this.cdr.detectChanges();
  }

  private deactivateMotions() {
    // note only works if autoUpdate is false
    // Disable automatic idle animations and motion manager
    if (this.model.internalModel) {
      // Disable auto idle motions
      if (this.model.internalModel.motionManager) {
        this.model.internalModel.motionManager.stopAllMotions();
      }

      // Disable auto eye blinking
      if (this.model.internalModel.eyeBlink) {
        this.model.internalModel.eyeBlink.enabled = false;
      }

      // Disable breath animation
      if (this.model.internalModel.breath) {
        this.model.internalModel.breath.enabled = false;
      }
    }

    // Set up manual update to only update parameter changes, not automatic movements
    Ticker.shared.add(() => {
      if (this.model && this.model.internalModel) {
        // Only update the model's parameters, not its automatic animations
        this.model.internalModel.coreModel?.update();
        this.model.update(Ticker.shared.deltaMS); // Update the model with delta time
      }
    });
  }

  extractModelInfo(): void {
    if (!this.model || !this.model.internalModel || !this.model.internalModel.coreModel) {
      console.error('Model or model parameters not available');
      return;
    }

    const coreModel = this.model.internalModel.coreModel._model;

    // Extract parameters
    if (coreModel.parameters) {
      this.modelParameters = {
        count: coreModel.parameters.count,
        ids: coreModel.parameters.ids,
        minimumValues: coreModel.parameters.minimumValues,
        maximumValues: coreModel.parameters.maximumValues,
        defaultValues: coreModel.parameters.defaultValues,
        currentValues: coreModel.parameters.values,
      };
    }

    // Extract parts
    if (coreModel.parts) {
      this.modelParts = {
        count: coreModel.parts.count,
        ids: coreModel.parts.ids,
        opacities: coreModel.parts.opacities,
        parentIndices: coreModel.parts.parentIndices,
      };
    }

    // Extract motion groups
    if (this.model.internalModel && this.model.internalModel.motionManager) {
      this.motionGroups = Object.keys(this.model.internalModel.motionManager.motionGroups);
    }

    console.log('Model Parameters:', this.modelParameters);
    console.log('Model Parts:', this.modelParts);
    console.log('Available Motion Groups:', this.motionGroups);
  }

  async onModelChange(): Promise<void> {
    // Reset zoom to the model's default scale when changing models
    this.modelZoom = this.selectedModel.scale * 100;
    await this.loadModel(this.selectedModel.path);
  }

  /**
   * Updates the model's scale based on the zoom slider.
   * @param event The slider event containing the new value.
   */
  onZoomChange(event: any): void {
    if (this.model) {
      const newScale = event.value / 100;
      this.model.scale.set(newScale, newScale);
    }
  }

  /**
   * Updates a Live2D model parameter based on slider input
   * @param event Parameter change event containing id, value, and index
   */
  updateModelParameter(event: { id: string; value: number; index: number }): void {
    if (!this.model || !this.model.internalModel || !this.model.internalModel.coreModel) {
      console.error('Model not available for parameter update');
      return;
    }

    // Update the parameter in the model
    const coreModel = this.model.internalModel.coreModel;

    // Update the parameter value
    coreModel.setParameterValueById(event.id, event.value);

    // Also update our local copy of parameters
    if (this.modelParameters && this.modelParameters.currentValues) {
      this.modelParameters.currentValues[event.index] = event.value;
    }
  }
  /**
   * Plays a specific Live2D animation.
   * @param groupName The name of the motion group to play.
   */
  public playAnimation(groupName: string): void {
    if (!this.model) {
      console.error('Model not available to play animation');
      return;
    }
    this.model.motion(groupName);
  }

  /**
   * Plays a random animation from the available motion groups.
   */
  public playRandomAnimation(): void {
    if (this.motionGroups.length > 0) {
      const group = this.motionGroups[Math.floor(Math.random() * this.motionGroups.length)];
      this.playAnimation(group);
    }
  }
}
