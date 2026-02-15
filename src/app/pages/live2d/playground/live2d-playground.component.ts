import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ModelInfoComponent } from '../l2d-model-info/model-info.component';
import { ModelParameters, ModelParts } from '../models/live2d-types';
import { Live2dModelComponent } from '../../../components/live2d-model/live2d-model.component';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-live2d-playground',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    AccordionModule,
    FormsModule,
    CardModule,
    TableModule,
    SliderModule,
    ModelInfoComponent,
    Live2dModelComponent,
  ],
  templateUrl: './live2d-playground.component.html',
  styleUrl: './live2d-playground.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Live2dPlaygroundComponent {
  @ViewChild('live2dModel') live2dModelComponent!: Live2dModelComponent;

  modelParameters: ModelParameters | null = null;
  modelParts: ModelParts | null = null;
  motionGroups: string[] = [];
  expressions: string[] = [];

  modelZoom = 15; // Initial zoom level
  modelX = 50; // Initial X position (center)
  modelY = 50; // Initial Y position (center)

  availableModels = [
    { name: 'Hiyori', path: '/assets/Resources/Hiyori/Hiyori.model3.json', scale: 0.15 },
    { name: 'Mao', path: '/assets/Resources/Mao/Mao.model3.json', scale: 0.08 },
    { name: 'Haru', path: '/assets/Resources/Haru/Haru.model3.json', scale: 0.15 },
    { name: 'Alexia', path: '/assets/Resources/Alexia/Alexia.model3.json', scale: 0.07 },
    { name: 'Ellot', path: '/assets/Resources/ellot/ellot.model3.json', scale: 0.14 },
    { name: 'Tachie03', path: '/assets/Resources/tachie03/tachie03.model3.json', scale: 0.06 },
    { name: 'NVPU', path: '/assets/Resources/NVPU-demo/NVPU.model3.json', scale: 0.11 },
    { name: '简', path: '/assets/Resources/简/简.model3.json', scale: 0.08 },
    { name: 'IceGIrl', path: '/assets/Resources/IceGIrl/IceGirl.model3.json', scale: 0.08 },
    { name: 'conejo', path: 'https://storage-qa.polilan.com/live2ds/698fc713548003d2fcd6c666/conejo/conejo.model3.json', scale: 0.08 },
  ];

  selectedModel = this.availableModels[0];

  constructor(private cdr: ChangeDetectorRef) {}

  onModelLoaded(event: { parameters: ModelParameters | null; parts: ModelParts | null; motions: string[]; expressions: string[] }): void {
    this.modelParameters = event.parameters;
    this.modelParts = event.parts;
    this.motionGroups = event.motions;
    this.expressions = event.expressions;
    this.cdr.detectChanges();
  }

  async onModelChange(): Promise<void> {
    this.modelZoom = Math.round(this.selectedModel.scale * 100);
    this.modelX = 50;
    this.modelY = 50;
    // The model will be reloaded automatically by the child component due to the input binding change.
  }

  onZoomChange(event: any): void {
    if (this.live2dModelComponent) {
      this.live2dModelComponent.onZoomChange(event.value);
    }
  }

  onPositionXChange(event: any): void {
    if (this.live2dModelComponent) {
      this.live2dModelComponent.onXChange(event.value);
    }
  }

  onPositionYChange(event: any): void {
    if (this.live2dModelComponent) {
      this.live2dModelComponent.onYChange(event.value);
    }
  }

  updateModelParameter(event: { id: string; value: number; index: number }): void {
    if (this.live2dModelComponent) {
      this.live2dModelComponent.updateModelParameter(event);
    }
  }

  public playAnimation(groupName: string): void {
    if (this.live2dModelComponent) {
      this.live2dModelComponent.playAnimation(groupName);
    }
  }

  public playRandomAnimation(): void {
    if (this.live2dModelComponent) {
      this.live2dModelComponent.playRandomAnimation();
    }
  }

  public speak(audioUrl: string): void {
    if (this.live2dModelComponent) {
      this.live2dModelComponent.speak(audioUrl);
    }
  }

  public stopSpeaking(): void {
    if (this.live2dModelComponent) {
      this.live2dModelComponent.stopSpeaking();
    }
  }

  public setExpression(expressionName: string): void {
    if (this.live2dModelComponent) {
      this.live2dModelComponent.setExpression(expressionName);
    }
  }

  public onViewStateChanged(event: { zoom: number; x: number; y: number }): void {
    this.modelZoom = event.zoom;
    this.modelX = event.x;
    this.modelY = event.y;
    this.cdr.detectChanges();
  }

  public zoomToFace(): void {
    if (this.live2dModelComponent) {
      const transform = this.live2dModelComponent.getFaceTransform();
      if (transform) {
        this.modelZoom = transform.zoom;
        this.modelX = transform.x;
        this.modelY = transform.y;
        
        // Apply changes to the component
        this.live2dModelComponent.onZoomChange(this.modelZoom);
        this.live2dModelComponent.onXChange(this.modelX);
        this.live2dModelComponent.onYChange(this.modelY);
        
        this.cdr.detectChanges();
      }
    }
  }

  public resetView(): void {
    this.modelZoom = Math.round(this.selectedModel.scale * 100);
    this.modelX = 50;
    this.modelY = 50;
    
    if (this.live2dModelComponent) {
      this.live2dModelComponent.onZoomChange(this.modelZoom);
      this.live2dModelComponent.onXChange(this.modelX);
      this.live2dModelComponent.onYChange(this.modelY);
    }
    this.cdr.detectChanges();
  }
}
