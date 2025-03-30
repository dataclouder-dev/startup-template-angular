import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-model-info',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TableModule],
  templateUrl: './model-info.component.html',
  styleUrls: ['./model-info.component.css']
})
export class ModelInfoComponent implements OnChanges {
  @Input() modelParameters: any = null;
  @Input() modelParts: any = null;
  
  selectedTab: string = 'parameters';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    // Reset to parameters tab when model data changes
    if ((changes['modelParameters'] || changes['modelParts']) && 
        (changes['modelParameters']?.currentValue !== changes['modelParameters']?.previousValue ||
         changes['modelParts']?.currentValue !== changes['modelParts']?.previousValue)) {
      this.selectedTab = 'parameters';
    }
  }

  setActiveTab(tab: string): void {
    this.selectedTab = tab;
  }

  // Helper function to get parameter data in a format suitable for display
  getParametersTableData(): any[] {
    if (!this.modelParameters) return [];

    return this.modelParameters.ids.map((id: string, index: number) => {
      return {
        id: id,
        min: this.modelParameters.minimumValues[index],
        max: this.modelParameters.maximumValues[index],
        default: this.modelParameters.defaultValues[index],
        current: this.modelParameters.currentValues[index],
      };
    });
  }

  // Helper function to get parts data in a format suitable for display
  getPartsTableData(): any[] {
    if (!this.modelParts) return [];

    return this.modelParts.ids.map((id: string, index: number) => {
      return {
        id: id,
        opacity: this.modelParts.opacities[index],
        parentIndex: this.modelParts.parentIndices[index],
      };
    });
  }
}
