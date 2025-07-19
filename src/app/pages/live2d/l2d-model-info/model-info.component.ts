import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal, computed, effect, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ModelParameters, ModelParts } from 'src/app/pages/live2d/models/live2d-types';

@Component({
  selector: 'app-model-info',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, TableModule, SliderModule],
  templateUrl: './model-info.component.html',
  styleUrls: ['./model-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelInfoComponent {
  // Input signals
  modelParametersSignal = signal<ModelParameters | null>(null);
  modelPartsSignal = signal<ModelParts | null>(null);

  // Set up input setters
  @Input() set modelParameters(value: ModelParameters | null) {
    if (value !== this.modelParametersSignal()) {
      this.modelParametersSignal.set(value);
      this.initializeParamValues();
    }
  }

  @Input() set modelParts(value: ModelParts | null) {
    this.modelPartsSignal.set(value);
  }

  @Output() parameterChanged = new EventEmitter<{ id: string; value: number; index: number }>();

  // UI state
  selectedTab = signal<string>('parameters');
  paramValues = signal<{ [key: string]: number }>({});

  // Computed values for table data
  parametersTableData = computed(() => this.getParametersTableData());
  partsTableData = computed(() => this.getPartsTableData());

  constructor() {}

  private initializeParamValues(): void {
    const modelParams = this.modelParametersSignal();
    if (!modelParams) return;

    const newValues = { ...this.paramValues() };
    modelParams.ids.forEach((id, index) => {
      newValues[id] = modelParams.currentValues[index] || 0;
    });

    this.paramValues.set(newValues);
  }

  setActiveTab(tab: string): void {
    this.selectedTab.set(tab);
  }

  // Helper function to get parameter data in a format suitable for display
  private getParametersTableData(): any[] {
    const modelParams = this.modelParametersSignal();
    const currentParamValues = this.paramValues();

    if (!modelParams) return [];

    return modelParams.ids.map((id: string, index: number) => {
      return {
        id: id,
        index: index,
        min: modelParams.minimumValues[index],
        max: modelParams.maximumValues[index],
        default: modelParams.defaultValues[index],
        current: modelParams.currentValues[index],
        value: currentParamValues[id] || modelParams.currentValues[index] || 0,
      };
    });
  }

  // Helper function to get parts data in a format suitable for display
  private getPartsTableData(): any[] {
    const modelParts = this.modelPartsSignal();
    if (!modelParts) return [];

    return modelParts.ids.map((id: string, index: number) => {
      return {
        id: id,
        opacity: modelParts.opacities[index],
        parentIndex: modelParts.parentIndices[index],
      };
    });
  }

  // Update parameter value and emit change event
  onParameterChange(param: any): void {
    if (!this.modelParametersSignal()) return;

    // Update local value using signal
    const newValues = { ...this.paramValues() };
    newValues[param.id] = param.value;
    this.paramValues.set(newValues);

    // Emit event to parent component
    this.parameterChanged.emit({
      id: param.id,
      value: param.value,
      index: param.index,
    });
  }

  // Reset parameter to default value
  resetParameter(param: any): void {
    const modelParams = this.modelParametersSignal();
    if (!modelParams) return;

    const defaultValue = modelParams.defaultValues[param.index];

    // Update local value using signal
    const newValues = { ...this.paramValues() };
    newValues[param.id] = defaultValue;
    this.paramValues.set(newValues);

    this.parameterChanged.emit({
      id: param.id,
      value: defaultValue,
      index: param.index,
    });
  }

  // Getters for template access
  get modelParameters(): ModelParameters | null {
    return this.modelParametersSignal();
  }

  get modelParts(): ModelParts | null {
    return this.modelPartsSignal();
  }

  opacity = signal(0);

  value!: number;
}
