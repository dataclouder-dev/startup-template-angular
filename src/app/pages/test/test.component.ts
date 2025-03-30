import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';
import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch';
// import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch/cubism4';
// import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch/cubism2';

import { Application, Ticker } from 'pixi.js';
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, GenericListComponent, DialogModule, ButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements AfterViewInit {
  async ngAfterViewInit(): Promise<void> {
    // throw new Error('Method not implemented.');
    const app = new Application({
      view: document.getElementById('canvas') as HTMLCanvasElement,
    });

    const model = await Live2DModel.from('/assets/Resources/Hiyori/Hiyori.model3.json', {
      // register Ticker for model
      ticker: Ticker.shared,
    });

    app.stage.addChild(model);

    // transforms
    model.x = 300;
    model.y = 300;
    model.rotation = Math.PI;
    model.skew.x = Math.PI;
    model.scale.set(0.2, 0.2);
    model.anchor.set(0.5, 0.5);
    // model.hitArea = new PIXI.Circle(0, 0, 100);

    // interaction
    (model as any).on('hit', (hitAreas: string[]) => {
      if (hitAreas.includes('body')) {
        model.motion('tap_body');
      }
    });
  }
}
