// import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
// import { CubismFramework } from '../../../live2d/Framework/dist/live2dcubismframework';
// import { LAppDelegate } from '../live2d/lappdelegate';
// import { LAppModel } from '../live2d/lappmodel';
// import { LAppDefine } from '../live2d/lappdefine';
// import { LAppPal } from '../live2d/lapppal';
// import { LAppTextureManager } from '../live2d/lapptexturemanager';
// import { LAppView } from '../live2d/lappview';
// import { LAppLive2DManager } from '../live2d/lapplive2dmanager';

// @Component({
//   selector: 'app-live2d-viewer',
//   templateUrl: './live2d-viewer.component.html',
//   styleUrls: ['./live2d-viewer.component.scss'],
// })
// export class Live2dViewerComponent implements OnInit, AfterViewInit {
//   @ViewChild('live2dCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

//   private delegate: LAppDelegate;
//   private view: LAppView;
//   private modelManager: LAppLive2DManager;
//   private textureManager: LAppTextureManager;

//   constructor() {
//     // Initialize Live2D Cubism Framework
//     CubismFramework.startUp();
//     CubismFramework.initialize();

//     // Initialize managers
//     this.textureManager = new LAppTextureManager();
//     this.modelManager = new LAppLive2DManager();

//     // Initialize delegate
//     this.delegate = new LAppDelegate();
//   }

//   ngOnInit(): void {
//     // Initialize Live2D
//     this.delegate.initialize();
//   }

//   ngAfterViewInit(): void {
//     const canvas = this.canvasRef.nativeElement;

//     // Initialize view
//     this.view = new LAppView();
//     this.view.initialize(canvas);

//     // Load model
//     this.modelManager.loadModel('live2d/models/Hiyori/Hiyori.model3.json');

//     // Start rendering
//     this.startRendering();
//   }

//   private startRendering(): void {
//     const render = () => {
//       this.view.render();
//       requestAnimationFrame(render);
//     };
//     render();
//   }

//   ngOnDestroy(): void {
//     // Cleanup
//     this.modelManager.releaseAllModel();
//     this.textureManager.releaseAllTexture();
//     this.view.release();
//     this.delegate.release();
//     CubismFramework.dispose();
//   }
// }
