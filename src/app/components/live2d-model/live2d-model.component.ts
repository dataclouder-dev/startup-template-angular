import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Live2DModel } from 'untitled-pixi-live2d-engine/cubism'
import * as PIXI from 'pixi.js';
import { Application, Ticker } from 'pixi.js';
import { ModelParameters, ModelParts } from '../../pages/live2d/models/live2d-types';

@Component({
  selector: 'app-live2d-model',
  standalone: true,
  imports: [],
  templateUrl: './live2d-model.component.html',
  styleUrls: ['./live2d-model.component.css'],
})
export class Live2dModelComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() modelPath!: string;
  @Input() scale = 0.4;
  @Output() modelLoaded = new EventEmitter<{ parameters: ModelParameters | null; parts: ModelParts | null; motions: string[]; expressions: string[] }>();
  @Output() viewStateChanged = new EventEmitter<{ zoom: number; x: number; y: number }>();

  app!: Application;
  model: any;
  private modelParameters: ModelParameters | null = null;
  private modelParts: ModelParts | null = null;
  private motionGroups: string[] = [];
  private expressions: string[] = [];



  async ngAfterViewInit(): Promise<void> {
    await this.initializeCanvas();
    await this.loadModel(this.modelPath);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modelPath'] && !changes['modelPath'].isFirstChange()) {
      this.loadModel(this.modelPath);
    }
  }

  async initializeCanvas(): Promise<void> {


    this.app = new Application();

    // console.log('PixiJS initialization, version:', (PIXI as any).VERSION);
    
    if (typeof (this.app as any).init === 'function') {
      await this.app.init({
        canvas: this.canvasRef.nativeElement,
        resizeTo: this.canvasRef.nativeElement.parentElement || undefined,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: true,
        resolution:  window.devicePixelRatio || 1,
        autoDensity: true,
      });
    } else {
      alert('Not able to load the model')

    }
  }

  async loadModel(modelPath: string): Promise<void> {
    if (this.model) {
      this.app.stage.removeChild(this.model);
      this.model.destroy();
    }

    this.model =  await Live2DModel.from(
    modelPath,
      {
        ticker: PIXI.Ticker.shared,
        autoFocus: true,
        autoHitTest: true,
        breathDepth: 0.2,
      }
  )

// this.model.internalModel.extendParallelMotionManager(2)


    this.app.stage.addChild(this.model);

    this.extractModelInfo();

    this.model.x = this.app.screen.width / 2;
    this.model.y = this.app.screen.height / 2;
    this.model.scale.set(.15);
    this.model.anchor.set(0.5, .5);

    // this.deactivateMotions();
    this.modelLoaded.emit({ 
      parameters: this.modelParameters, 
      parts: this.modelParts, 
      motions: this.motionGroups,
      expressions: this.expressions
    });
    // this.cdr.detectChanges();
  }

  private deactivateMotions() {
    const internalModel = this.model.internalModel as any;
    if (internalModel) {
      if (internalModel.motionManager) {
        internalModel.motionManager.stopAllMotions();
      }
      if (internalModel.eyeBlink) {
        internalModel.eyeBlink.enabled = false;
      }
      if (internalModel.breath) {
        internalModel.breath.enabled = false;
      }
    }

    Ticker.shared.add((ticker: Ticker) => {
      if (this.model && this.model.internalModel) {
        (this.model.internalModel as any).coreModel?.update();
        this.model.update(ticker.deltaTime);
      }
    });
  }

  private extractModelInfo(): void {
    if (!this.model || !this.model.internalModel || !this.model.internalModel.coreModel) {
      return;
    }
    const coreModel = this.model.internalModel.coreModel._model;
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
    if (coreModel.parts) {
      this.modelParts = {
        count: coreModel.parts.count,
        ids: coreModel.parts.ids,
        opacities: coreModel.parts.opacities,
        parentIndices: coreModel.parts.parentIndices,
      };
    }
    if (this.model.internalModel && this.model.internalModel.motionManager) {
      // this.motionGroups = Object.keys(this.model.internalModel.motionManager.motionGroups).filter(group => group && group.trim() !== '');
            this.motionGroups = Object.keys(this.model.internalModel.motionManager.motionGroups);

      if (this.model.internalModel.motionManager.expressionManager) {
        this.expressions = this.model.internalModel.motionManager.expressionManager.definitions.map((def: any) => def.Name || def.name);
      }
    }
  }

  public playAnimation(groupName: string): void {
    if (!this.model) return;
    this.model.motion(groupName);
  }

  public playRandomAnimation(): void {
    if (this.motionGroups.length > 0) {
      const group = this.motionGroups[Math.floor(Math.random() * this.motionGroups.length)];
      this.playAnimation(group);
    }
  }

  public speak(audioUrl: string, options?: { volume?: number; crossOrigin?: string; focus?: boolean }): void {
    if (!this.model) return;
    
    // Auto-focus on face if requested (default true)
    if (options?.focus !== false) {
      const transform = this.getFaceTransform();
      if (transform) {
        this.onZoomChange(transform.zoom);
        this.onXChange(transform.x);
        this.onYChange(transform.y);
        this.viewStateChanged.emit(transform);
      }
    }
    
    this.model.speak(audioUrl, {
      volume: 0,
      crossOrigin: options?.crossOrigin || 'anonymous',
    });
  }

  public stopSpeaking(): void {
    if (this.model) {
      this.model.stopSpeaking();
    }
  }

  public updateModelParameter(event: { id: string; value: number; index: number }): void {
    if (!this.model || !this.model.internalModel || !this.model.internalModel.coreModel) {
      return;
    }
    const coreModel = this.model.internalModel.coreModel;
    coreModel.setParameterValueById(event.id, event.value);
    if (this.modelParameters && this.modelParameters.currentValues) {
      this.modelParameters.currentValues[event.index] = event.value;
    }
  }

  public onZoomChange(value: number): void {
    if (this.model) {
      const newScale = value / 100;
      this.model.scale.set(newScale, newScale);
    }
  }

  public onXChange(value: number): void {
    if (this.model && this.app) {
      // value is 0-100, transform to screen width percentage
      const newX = (value / 100) * this.app.screen.width;
      this.model.x = newX;
    }
  }

  public onYChange(value: number): void {
    if (this.model && this.app) {
      // value is 0-100, transform to screen height percentage
      const newY = (value / 100) * this.app.screen.height;
      this.model.y = newY;
    }
  }

  public setExpression(expressionName: string): void {
    if (this.model) {
      this.model.expression(expressionName);
    }
  }

  public getFaceTransform(): { zoom: number, x: number, y: number } | null {
    if (!this.model || !this.app) return null;

    // Try to find a face hit area
    const hitAreas = this.model.internalModel?.settings?.hitAreas || [];
    const headHitArea = hitAreas.find((h: any) => 
      ['Head', 'Face', 'head', 'face'].some(name => (h.Name && h.Name.includes(name)) || (h.Id && h.Id.includes(name)))
    );

    let bounds: any;
    if (headHitArea) {
      try {
        const hitAreaName = headHitArea.Name || headHitArea.Id;
        bounds = this.model.getHitAreaBounds(hitAreaName);
      } catch (e) {
        console.warn('Failed to get hit area bounds, falling back to top 30%', e);
      }
    }

    if (!bounds) {
      // Fallback: Use the top 30% of the model's local bounds
      const modelBounds = this.model.getLocalBounds();
      bounds = {
        x: modelBounds.x,
        y: modelBounds.y,
        width: modelBounds.width,
        height: modelBounds.height * 0.3
      };
    }

    // Target: face height should be about 50% of screen height for a good "close up"
    const targetFaceHeight = this.app.screen.height * 0.6;
    const suggestedScale = targetFaceHeight / bounds.height;
    
    // We want the zoom value in percentage (1-100)
    const zoomValue = Math.min(Math.round(suggestedScale * 100), 100);

    // Calculate the center of the face in local coordinates
    const faceCenterX = bounds.x + (bounds.width / 2);
    const faceCenterY = bounds.y + (bounds.height / 2);

    // Get model's local bounds for anchor calculation
    const localBounds = this.model.getLocalBounds();
    const anchorX = 0.5;
    const anchorY = 0.5;

    // Calculate how much we need to offset the model so the face center is at the target screen position
    // Offset in screen pixels = (localPoint - localAnchorPoint) * globalScale
    const offsetX = (faceCenterX - (localBounds.x + localBounds.width * anchorX)) * suggestedScale;
    const offsetY = (faceCenterY - (localBounds.y + localBounds.height * anchorY)) * suggestedScale;

    // Target screen position for model.x and model.y
    // We want the face to be in the upper part of the screen, not exactly centered
    // 0.35 is usually a good "head-slightly-below-top" position
    const verticalFocusPoint = 0.35; 
    const targetX = (this.app.screen.width / 2) - offsetX;
    const targetY = (this.app.screen.height * verticalFocusPoint) - offsetY;

    // Convert to percentage values as used by the playground
    const xPct = (targetX / this.app.screen.width) * 100;
    const yPct = (targetY / this.app.screen.height) * 100;

    return {
      zoom: zoomValue,
      x: Math.round(xPct),
      y: Math.round(yPct)
    };
  }
}
