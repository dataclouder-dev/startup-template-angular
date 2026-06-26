import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  input,
  output,
  computed,
  effect,
  signal,
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
export class Live2dModelComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // Signal inputs
  modelPath = input.required<string>();
  scale = input<number>(0.4);
  zoom = input<number | undefined>(undefined);
  x = input<number>(50);
  y = input<number>(50);

  // Outputs (using new Angular output API)
  modelLoaded = output<{ parameters: ModelParameters | null; parts: ModelParts | null; motions: string[]; expressions: string[] }>();
  viewStateChanged = output<{ zoom: number; x: number; y: number }>();

  app!: Application;
  model: any;
  private modelParameters: ModelParameters | null = null;
  private modelParts: ModelParts | null = null;
  private motionGroups: string[] = [];
  private expressions: string[] = [];

  private isViewInitialized = signal(false);

  // Zoom fallback to scale * 100 if zoom input is undefined
  effectiveZoom = computed(() => {
    const z = this.zoom();
    if (z !== undefined) {
      return z;
    }
    return Math.round(this.scale() * 100);
  });

  // Pointer dragging state
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private dragStartModel = { x: 50, y: 50 };

  constructor() {
    // Reactive model loading once canvas is initialized
    effect(() => {
      const path = this.modelPath();
      if (this.isViewInitialized()) {
        this.loadModel(path);
      }
    });

    // Reactive scale and position transform updates
    effect(() => {
      const currentZoom = this.effectiveZoom();
      const currentX = this.x();
      const currentY = this.y();
      
      this.updateModelTransform(currentZoom, currentX, currentY);
    });
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initializeCanvas();
    
    // Register wheel event programmatically to ensure it's not passive
    // and prevent default scroll on the parent page.
    this.canvasRef.nativeElement.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    
    this.isViewInitialized.set(true);
  }

  async initializeCanvas(): Promise<void> {
    this.app = new Application();
    
    if (typeof (this.app as any).init === 'function') {
      await this.app.init({
        canvas: this.canvasRef.nativeElement,
        resizeTo: this.canvasRef.nativeElement.parentElement || undefined,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });
    } else {
      alert('Not able to load the model');
    }
  }

  async loadModel(modelPath: string): Promise<void> {
    if (this.model) {
      this.app.stage.removeChild(this.model);
      this.model.destroy();
    }

    this.model = await Live2DModel.from(
      modelPath,
      {
        ticker: PIXI.Ticker.shared,
        autoFocus: true,
        autoHitTest: true,
        breathDepth: 0.2,
      }
    );

    this.app.stage.addChild(this.model);
    this.extractModelInfo();

    this.model.anchor.set(0.5, 0.5);
    
    // Apply initial coordinates from inputs/signals
    this.updateModelTransform(this.effectiveZoom(), this.x(), this.y());

    this.modelLoaded.emit({ 
      parameters: this.modelParameters, 
      parts: this.modelParts, 
      motions: this.motionGroups,
      expressions: this.expressions
    });
  }

  private updateModelTransform(zoomVal: number, xVal: number, yVal: number): void {
    if (!this.model) return;
    
    const targetScale = zoomVal / 100;
    if (Math.abs(this.model.scale.x - targetScale) > 0.001) {
      this.model.scale.set(targetScale, targetScale);
    }
    
    if (this.app) {
      const targetX = (xVal / 100) * this.app.screen.width;
      if (Math.abs(this.model.x - targetX) > 1) {
        this.model.x = targetX;
      }
      
      const targetY = (yVal / 100) * this.app.screen.height;
      if (Math.abs(this.model.y - targetY) > 1) {
        this.model.y = targetY;
      }
    }
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
    
    if (options?.focus !== false) {
      const transform = this.getFaceTransform();
      if (transform) {
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

  public setExpression(expressionName: string): void {
    if (this.model) {
      this.model.expression(expressionName);
    }
  }

  // Pointer drag event handlers
  public onPointerDown(event: PointerEvent): void {
    if (!this.model || !this.app) return;

    this.isDragging = true;
    this.dragStart.x = event.clientX;
    this.dragStart.y = event.clientY;

    this.dragStartModel.x = this.x();
    this.dragStartModel.y = this.y();

    const canvas = this.canvasRef.nativeElement;
    canvas.setPointerCapture(event.pointerId);
  }

  public onPointerMove(event: PointerEvent): void {
    if (!this.isDragging || !this.model || !this.app) return;

    const dx = event.clientX - this.dragStart.x;
    const dy = event.clientY - this.dragStart.y;

    const canvasWidth = this.app.screen.width;
    const canvasHeight = this.app.screen.height;

    const dxPct = (dx / canvasWidth) * 100;
    const dyPct = (dy / canvasHeight) * 100;

    const newX = Math.round(this.dragStartModel.x + dxPct);
    const newY = Math.round(this.dragStartModel.y + dyPct);

    this.viewStateChanged.emit({
      zoom: this.effectiveZoom(),
      x: newX,
      y: newY
    });
  }

  public onPointerUp(event: PointerEvent): void {
    if (this.isDragging) {
      this.isDragging = false;
      const canvas = this.canvasRef.nativeElement;
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (e) {
        // Ignore
      }
    }
  }

  // Wheel scroll event handler for zoom centering on cursor
  private onWheel(event: WheelEvent): void {
    event.preventDefault();

    if (!this.model || !this.app) return;

    const zoomFactor = 1.05;
    const currentZoom = this.effectiveZoom();
    let targetZoom = currentZoom;

    if (event.deltaY < 0) {
      targetZoom = currentZoom * zoomFactor;
    } else {
      targetZoom = currentZoom / zoomFactor;
    }

    const roundedZoom = Math.max(1, Math.min(Math.round(targetZoom), 200));

    // Get pointer coordinates relative to canvas bounding box
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const canvasWidth = this.app.screen.width;
    const canvasHeight = this.app.screen.height;

    // Convert current model position from percentages to pixels
    const oldModelX = (this.x() / 100) * canvasWidth;
    const oldModelY = (this.y() / 100) * canvasHeight;

    const oldScale = Math.max(0.001, currentZoom / 100);
    const newScale = roundedZoom / 100;

    // Calculate new model position so that the point under the cursor remains unchanged
    const newModelX = mouseX - (mouseX - oldModelX) * (newScale / oldScale);
    const newModelY = mouseY - (mouseY - oldModelY) * (newScale / oldScale);

    // Convert back to percentages
    const newXPct = Math.round((newModelX / canvasWidth) * 100);
    const newYPct = Math.round((newModelY / canvasHeight) * 100);

    this.viewStateChanged.emit({
      zoom: roundedZoom,
      x: newXPct,
      y: newYPct
    });
  }

  public getFaceTransform(): { zoom: number, x: number, y: number } | null {
    if (!this.model || !this.app) return null;

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
      const modelBounds = this.model.getLocalBounds();
      bounds = {
        x: modelBounds.x,
        y: modelBounds.y,
        width: modelBounds.width,
        height: modelBounds.height * 0.3
      };
    }

    const targetFaceHeight = this.app.screen.height * 0.6;
    const suggestedScale = targetFaceHeight / bounds.height;
    const zoomValue = Math.min(Math.round(suggestedScale * 100), 200);

    const faceCenterX = bounds.x + (bounds.width / 2);
    const faceCenterY = bounds.y + (bounds.height / 2);

    const localBounds = this.model.getLocalBounds();
    const anchorX = 0.5;
    const anchorY = 0.5;

    const offsetX = (faceCenterX - (localBounds.x + localBounds.width * anchorX)) * suggestedScale;
    const offsetY = (faceCenterY - (localBounds.y + localBounds.height * anchorY)) * suggestedScale;

    const verticalFocusPoint = 0.35; 
    const targetX = (this.app.screen.width / 2) - offsetX;
    const targetY = (this.app.screen.height * verticalFocusPoint) - offsetY;

    const xPct = (targetX / this.app.screen.width) * 100;
    const yPct = (targetY / this.app.screen.height) * 100;

    return {
      zoom: zoomValue,
      x: Math.round(xPct),
      y: Math.round(yPct)
    };
  }
}
