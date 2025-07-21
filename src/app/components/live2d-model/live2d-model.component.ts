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
} from '@angular/core';
import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch';
import { Application, Ticker } from 'pixi.js';
import { ModelParameters, ModelParts } from '../../pages/live2d/models/live2d-types';

@Component({
  selector: 'app-live2d-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live2d-model.component.html',
  styleUrls: ['./live2d-model.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Live2dModelComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() modelPath!: string;
  @Input() scale = 0.1;
  @Output() modelLoaded = new EventEmitter<{ parameters: ModelParameters | null; parts: ModelParts | null; motions: string[] }>();

  app!: Application;
  model: any;
  private modelParameters: ModelParameters | null = null;
  private modelParts: ModelParts | null = null;
  private motionGroups: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

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
    this.app = new Application({
      view: this.canvasRef.nativeElement,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: true,
    });
  }

  async loadModel(modelPath: string): Promise<void> {
    if (this.model) {
      this.app.stage.removeChild(this.model);
      this.model.destroy();
    }

    this.model = await Live2DModel.from(modelPath, {
      ticker: Ticker.shared,
      autoUpdate: false,
    });

    this.app.stage.addChild(this.model);

    this.extractModelInfo();

    this.model.x = this.canvasRef.nativeElement.width / 2;
    this.model.y = this.canvasRef.nativeElement.height / 2;
    this.model.scale.set(this.scale);
    this.model.anchor.set(0.5, 0.5);

    this.deactivateMotions();
    this.modelLoaded.emit({ parameters: this.modelParameters, parts: this.modelParts, motions: this.motionGroups });
    this.cdr.detectChanges();
  }

  private deactivateMotions() {
    if (this.model.internalModel) {
      if (this.model.internalModel.motionManager) {
        this.model.internalModel.motionManager.stopAllMotions();
      }
      if (this.model.internalModel.eyeBlink) {
        this.model.internalModel.eyeBlink.enabled = false;
      }
      if (this.model.internalModel.breath) {
        this.model.internalModel.breath.enabled = false;
      }
    }

    Ticker.shared.add(() => {
      if (this.model && this.model.internalModel) {
        this.model.internalModel.coreModel?.update();
        this.model.update(Ticker.shared.deltaMS);
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
      this.motionGroups = Object.keys(this.model.internalModel.motionManager.motionGroups);
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

  public speak(audioUrl: string, options?: { volume?: number; crossOrigin?: string }): void {
    if (!this.model) return;
    this.model.speak(audioUrl, {
      volume: options?.volume || 1.0,
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
}
