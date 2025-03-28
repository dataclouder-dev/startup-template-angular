import { Injectable } from '@angular/core';
import { LAppDelegate } from './lappdelegate';
import { LAppLive2DManager } from './lapplive2dmanager';
import { LAppSubdelegate } from './lappsubdelegate';
import * as LAppDefine from './lappdefine';

@Injectable({
  providedIn: 'root',
})
export class Live2DService {
  private delegate: LAppDelegate;
  private live2DManager: LAppLive2DManager;
  private subdelegate: LAppSubdelegate;

  constructor() {
    this.delegate = LAppDelegate.getInstance();
    this.live2DManager = new LAppLive2DManager();
    this.subdelegate = new LAppSubdelegate();
  }

  initialize(canvas: HTMLCanvasElement): boolean {
    if (!this.delegate.initialize()) {
      return false;
    }

    // Initialize the Live2D manager with the subdelegate
    this.live2DManager.initialize(this.subdelegate);

    // Load the default model
    this.live2DManager.addModel(0);

    return true;
  }

  run(): void {
    this.delegate.run();
  }

  release(): void {
    LAppDelegate.releaseInstance();
  }

  getLive2DManager(): LAppLive2DManager {
    return this.live2DManager;
  }
}
