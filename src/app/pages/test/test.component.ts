import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';
import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Live2DService } from '../../live2d/live2d.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, GenericListComponent, DialogModule, ButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('live2dCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  isDialogVisible: boolean = false;

  constructor(private live2DService: Live2DService) {}

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  ngAfterViewInit(): void {
    this.initializeLive2D();
  }

  private initializeLive2D(): void {
    const canvas = this.canvasRef.nativeElement;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;

    if (this.live2DService.initialize(canvas)) {
      this.live2DService.run();
    } else {
      console.error('Failed to initialize Live2D');
    }
  }

  ngOnDestroy(): void {
    this.live2DService.release();
  }
}
