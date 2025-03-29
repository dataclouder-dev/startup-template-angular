import { Component, ElementRef, ViewChild } from '@angular/core';
import { Live2dParameter, Live2dService } from '../services/live2d/live2d.service';
import { MatSelectChange } from '@angular/material/select';
import { Vector2D } from '../two-dimensional-slider/two-dimensional-slider.component';
// import { UpdateMode } from 'src/live2d-library/Samples/TypeScript/Demo/src/lapplive2dmanager';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-live2d',
  templateUrl: './live2d.component.html',
  styleUrls: ['./live2d.component.scss'],
})
export class Live2dComponent {
  @ViewChild('canvasContainer') canvasContainer: ElementRef;

  public selectedModelName: string;
  public selectedMotionGroupName: string = '';
  public expressionNames = [];
  public motionGroupNames = [];
  public motionNames = [];
  public parameters: Live2dParameter[] = [];
  // public updateMode: UpdateMode;
  // public UpdateMode = UpdateMode;

  constructor(public live2dService: Live2dService) {
    this.selectedModelName = live2dService.getModelNames()[0];
    this.loadModelByName(this.selectedModelName);
    // this.updateMode = this.live2dService.getUpdateMode();
  }

  ngAfterViewInit() {
    this.live2dService.setCanvasParent(this.canvasContainer.nativeElement);
  }

  async handleCharacterSelectionChanged(selectChange: MatSelectChange): Promise<void> {
    await this.loadModelByName(selectChange.value);
  }

  async loadModelByName(modelName: string): Promise<void> {
    await this.live2dService.loadModelByName(modelName);
    const model = this.live2dService.getLoadedModels().at(0);
    this.expressionNames = this.live2dService.getModelExpressionNames(model);
    this.motionGroupNames = this.live2dService.getModelMotionGroupNames(model);
    this.parameters = this.live2dService.getModelParameters(model);
  }

  handleExpressionClicked(expressionName: string): void {
    const model = this.live2dService.getLoadedModels().at(0);
    model.setExpression(expressionName);
  }

  handleMotionGroupClicked(motionGroupName: string): void {
    this.selectedMotionGroupName = motionGroupName;
    const model = this.live2dService.getLoadedModels().at(0);
    this.motionNames = this.live2dService.getModelMotionNames(model, motionGroupName);
  }

  handleMotionClicked(motionGroupName: string, motionIndex: number): void {
    const model = this.live2dService.getLoadedModels().at(0);
    model.startMotion(motionGroupName, motionIndex, 2);
  }

  handleLookDirectionChanged(vector2d: Vector2D): void {
    const model = this.live2dService.getLoadedModels().at(0);
    const { x, y } = vector2d;

    const lookX = x * 2 - 1;
    const lookY = -(y * 2 - 1);

    this.live2dService.setModelFaceTarget(model, lookX, lookY);
  }

  handleParameterSliderValueChanged(parameter: Live2dParameter, value: number): void {
    const model = this.live2dService.getLoadedModels().at(0);
    this.live2dService.setModelParameterValue(model, parameter.id, value);
    parameter.value = value;
  }

  handleUpdateModeChanged(change: MatButtonToggleChange): void {
    // this.updateMode = change.value;
    // this.live2dService.setUpdateMode(change.value);
  }

  handleResetParamsClicked(): void {
    const model = this.live2dService.getLoadedModels().at(0);
    this.parameters.map(param => {
      this.live2dService.setModelParameterValue(model, param.id, param.defaultValue);
      param.value = param.defaultValue;
    });
  }
}
