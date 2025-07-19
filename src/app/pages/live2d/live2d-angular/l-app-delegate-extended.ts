import { LAppDelegate } from 'src/app/live2d-demo/lappdelegate';
import { LAppSubdelegate } from 'src/app/live2d-demo/lappsubdelegate';
import { CubismLogError } from '@framework/utils/cubismdebug';

class LAppDelegateExtended extends LAppDelegate {
  constructor() {
    super();
  }

  /**
   * Initialize the Live2D canvas with a single canvas element
   * @param canvas The canvas element to use for Live2D rendering
   */
  public initializeWithCanvas(canvas: HTMLCanvasElement): void {
    if (!canvas) {
      CubismLogError('No canvas element provided');
      return;
    }

    // Create a single subdelegate for the canvas
    const subdelegate = new LAppSubdelegate();
    subdelegate.initialize(canvas);

    // Call the parent's initialization
    this.initialize();
  }
}
