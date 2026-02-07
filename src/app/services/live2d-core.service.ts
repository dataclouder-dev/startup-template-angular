import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Live2DCubismCore } from 'pixi-live2d-display-lipsyncpatch';
// import { Live2DCubismCore } from '../live2d/Core/live2dcubismcore';

@Injectable({
  providedIn: 'root',
})
export class Live2dCoreService {
  private core: typeof Live2DCubismCore | null = null;
  private isInitialized = false;

  constructor(private http: HttpClient) {}

  initialize(): Observable<void> {
    if (this.isInitialized) {
      return from(Promise.resolve());
    }

    return this.http.get('assets/live2d/core/live2dcubismcore.js', { responseType: 'text' }).pipe(
      switchMap(scriptContent => {
        return from(
          new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.textContent = scriptContent;
            script.onload = () => {
              this.core = (window as any).Live2DCubismCore as typeof Live2DCubismCore;
              this.isInitialized = true;
              resolve();
            };
            script.onerror = error => reject(error);
            document.body.appendChild(script);
          })
        );
      })
    );
  }

  getCore(): typeof Live2DCubismCore {
    if (!this.core) {
      throw new Error('Live2D Core not initialized. Call initialize() first.');
    }
    return this.core;
  }

  dispose(): void {
    this.core = null;
    this.isInitialized = false;
  }

  // Helper methods to access Core functionality
  getVersion(): number {
    return this.getCore().Version.csmGetVersion();
  }

  getLatestMocVersion(): number {
    return this.getCore().Version.csmGetLatestMocVersion();
  }

  createMoc(mocBytes: ArrayBuffer): Live2DCubismCore.Moc {
    return this.getCore().Moc.fromArrayBuffer(mocBytes);
  }

  createModel(moc: Live2DCubismCore.Moc): Live2DCubismCore.Model {
    return this.getCore().Model.fromMoc(moc);
  }
}
