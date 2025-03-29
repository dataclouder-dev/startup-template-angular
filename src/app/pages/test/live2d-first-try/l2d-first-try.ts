import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
// import { Live2DService } from '../../live2d/live2d.service';
import { LAppModel } from '../../../live2d-demo/lappmodel';
import { LAppDelegate } from '../../../live2d-demo/lappdelegate';
import { LAppLive2DManager } from 'src/app/live2d-demo/lapplive2dmanager';
import { CubismModel } from '@framework/model/cubismmodel';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './l2d-first-try.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class L2DFirstTryComponent implements OnInit, AfterViewInit {
  @ViewChild('live2dCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  isDialogVisible: boolean = false;

  // public live2dManager = LAppLive2DManager.getInstance();

  constructor() {}

  ngOnInit(): void {
    // Remove initialization from here
  }

  public mainDelegate: LAppDelegate | null = null;

  ngAfterViewInit(): void {
    // Initialize canvas size this is required to do in code to work well
    this.initializeLive2D();

    // Initialize Live2D
    this.mainDelegate = LAppDelegate.getInstance();
    this.mainDelegate.initializeV2(this.canvasRef.nativeElement);
    this.mainDelegate.run();
  }

  // With this code im able to initialize and change scenes.
  public changeModel() {
    // Get the first (and only) subdelegate
    const subdelegate = this.mainDelegate!._subdelegates.at(0); // NOTE: it was private i changed to public
    const manager: LAppLive2DManager = subdelegate.getLive2DManager();
    manager.changeScene(1); // NOTE: it was private i changed to public

    // Check model metadata
    const modelApp: LAppModel = manager._models.at(0);
    // const modelCubim: CubismModel = modelApp.getModel();

    console.log('checking metadata', modelApp._motionCount);
  }

  private initializeLive2D(): void {
    const canvas = this.canvasRef.nativeElement;

    // Set canvas size
    canvas.width = 700;
    canvas.height = 500;
  }
}
