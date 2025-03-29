import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';
import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
// import { Live2DService } from '../../live2d/live2d.service';
import { LAppModel } from '../../live2d-demo/lappmodel';
import { LAppDelegate } from '../../live2d-demo/lappdelegate';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, GenericListComponent, DialogModule, ButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit {
  @ViewChild('live2dCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  isDialogVisible: boolean = false;

  constructor() {}
  ngOnInit(): void {
    console.log('');
    // Creo que tengo que inicializar el framework.
    const app = LAppDelegate.getInstance();
    app.initialize();
    app.run();
    // const model = new LAppModel();
    // model.loadAssets('assets/Resources/Haru', 'Haru.model3.json');
  }

  private initializeLive2D(): void {
    const canvas = this.canvasRef.nativeElement;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;
  }
}
