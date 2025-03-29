import { Injectable } from '@angular/core';
import { LAppLive2DManager, UpdateMode } from 'src/live2d-library/Samples/TypeScript/Demo/src/lapplive2dmanager';
import { LAppDelegate, canvas } from 'src/live2d-library/Samples/TypeScript/Demo/src/lappdelegate';
import * as LAppDefine from 'src/live2d-library/Samples/TypeScript/Demo/src/lappdefine';
import { csmVector } from 'src/live2d-library/Framework/src/type/csmvector';
import { LAppModel } from 'src/live2d-library/Samples/TypeScript/Demo/src/lappmodel';
import { getRange } from 'src/utilities/array/array-utilities';
import { csmString } from 'src/live2d-library/Framework/src/type/csmstring';
import { CubismFramework } from 'src/live2d-library/Framework/src/live2dcubismframework';

enum ModelName {
  HARU = 'Haru',
  HIYORI = 'Hiyori',
  MAO = 'Mao',
  MARK = 'Mark',
  NATORI = 'Natori',
  RICE = 'Rice',
}

export interface Live2dParameter {
  id: string;
  minimumValue: number;
  maximumValue: number;
  defaultValue: number;
  value: number;
  keys: Live2dParameterKey[];
}

export interface Live2dParameterKey {
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class Live2dService {
  // Live2D uses a singleton class LAppLive2DManager to manage the scenes
  // This singleton service wraps around that class in an angular way

  private live2dManager: LAppLive2DManager;

  constructor() {
    window.onresize = () => {
      if (LAppDefine.CanvasSize === 'auto') {
        LAppDelegate.getInstance().onResize();
      }
    };

    if (LAppDelegate.getInstance().initialize() == false) {
      throw new Error('Could not initialize Live2D LAppDelegate');
    }

    LAppDelegate.getInstance().run();
    this.live2dManager = LAppLive2DManager.getInstance();
  }

  ngOnDestroy(): void {
    LAppDelegate.releaseInstance();
  }

  getModelNames(): string[] {
    return Object.values(ModelName);
  }

  getCanvas(): HTMLCanvasElement {
    return canvas;
  }

  setCanvasParent(element: HTMLElement): void {
    canvas.parentElement.removeChild(canvas);
    element.appendChild(canvas);
  }

  loadModelByName(modelName: string): Promise<void> {
    return this.live2dManager.loadModelByName(modelName);
  }

  getLoadedModels(): csmVector<LAppModel> {
    return this.live2dManager._models;
  }

  getModelExpressionNames(model: LAppModel): string[] {
    return model._expressions._keyValues
      .filter((keyValue) => keyValue !== undefined)
      .map((keyValue) => keyValue.first)
      .sort((nameA, nameB) => nameA.localeCompare(nameB));
  }

  getModelMotionGroupNames(model: LAppModel): string[] {
    const modelSetting = model._modelSetting;
    const motionGroupCount = modelSetting.getMotionGroupCount();
    const range = getRange(motionGroupCount);
    return range.map((index) => modelSetting.getMotionGroupName(index));
  }

  getModelMotionNames(model: LAppModel, motionGroupName: string): string[] {
    const modelSetting = model._modelSetting;
    const motionCount = modelSetting.getMotionCount(motionGroupName);
    const range = getRange(motionCount);
    return range.map((index) => modelSetting.getMotionFileName(motionGroupName, index));
  }

  setModelFaceTarget(model: LAppModel, targetX: number, targetY: number): void {
    model.setDragging(targetX, targetY);
  }

  setModelParameterValue(model: LAppModel, parameterName: string, value: number): void {
    model.overrideParameterValueByName(parameterName, value);
  }

  getModelParameters(model: LAppModel): Live2dParameter[] {
    const cubismModel = model.getModel();
    const parameters = cubismModel.getParameters();

    const range = getRange(parameters.count);
    return range.map((paramIndex) => {
      const keyValues = Array.from(parameters.keyValues[paramIndex]);
      const keys = keyValues.map((keyValue) => ({ value: keyValue }));

      return {
        id: parameters.ids[paramIndex],
        minimumValue: parameters.minimumValues[paramIndex],
        maximumValue: parameters.maximumValues[paramIndex],
        defaultValue: parameters.defaultValues[paramIndex],
        value: parameters.values[paramIndex],
        keys,
      };
    });
  }

  getUpdateMode(): UpdateMode {
    return this.live2dManager.getUpdateMode();
  }

  setUpdateMode(updateMode: UpdateMode): void {
    this.live2dManager.setUpdateMode(updateMode);
  }
}
