import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';
import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ModelInfoComponent } from '../../components/model-info/model-info.component';

import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch';
// import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch/cubism4';
// import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch/cubism2';

import { Application, Ticker } from 'pixi.js';
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, GenericListComponent, DialogModule, ButtonModule, DropdownModule, AccordionModule, FormsModule, CardModule, TableModule, ModelInfoComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  app!: Application;
  model: any;
  modelParameters: any = null;
  modelParts: any = null;


  availableModels = [
    { name: 'Hiyori', path: '/assets/Resources/Hiyori/Hiyori.model3.json' },
    { name: 'Mao', path: '/assets/Resources/Mao/Mao.model3.json' },
    { name: 'Haru', path: '/assets/Resources/Haru/Haru.model3.json' },
    { name: 'Mio', path: '/assets/Resources/Mio/Mio.model3.json' },
    { name: 'Mark', path: '/assets/Resources/Mark/Mark.model3.json' },
    { name: 'Natori', path: '/assets/Resources/Natori/Natori.model3.json' },
    { name: 'Rice', path: '/assets/Resources/Rice/Rice.model3.json' },
    { name: 'Shizuku', path: '/assets/Resources/Shizuku/Shizuku.model3.json' },
    { name: 'Wanko', path: '/assets/Resources/Wanko/Wanko.model3.json' },
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
    });

    this.app.stage.addChild(this.model);

    // Extract model parameters
    this.extractModelInfo();

    // Apply transformations
    this.model.x = 300;
    this.model.y = 300;
    this.model.scale.set(0.15, 0.15);
    this.model.anchor.set(0.5, 0.5);

    // Add interaction
    (this.model as any).on('hit', (hitAreas: string[]) => {
      if (hitAreas.includes('body')) {
        this.model.motion('tap_body');
      }
    });

    // Force change detection to update the UI
    this.cdr.detectChanges();
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

    console.log('Model Parameters:', this.modelParameters);
    console.log('Model Parts:', this.modelParts);
  }

  async onModelChange(): Promise<void> {
    await this.loadModel(this.selectedModel.path);
  }
}
