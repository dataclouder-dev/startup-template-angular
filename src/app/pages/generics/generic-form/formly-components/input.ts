import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

interface InputProps extends FormlyFieldProps {}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<InputProps> {
  type: 'input' | Type<FormlyFieldInput>;
}

@Component({
  imports: [ReactiveFormsModule, InputTextModule, FormlyModule, CommonModule],

  selector: 'formly-field-primeng-input',
  template: `
    <div style="display: block; width: 100%; margin-bottom: .5rem;">
      <span style="width: 100%; font-weight: bold; font-size: 1rem; margin-bottom: 0.5rem;">{{ field.key }}</span>
      <input
        style="width: 100%;"
        *ngIf="props.type !== 'number'; else numberTmp"
        pInputText
        [type]="props.type || 'text'"
        [formControl]="formControl"
        [formlyAttributes]="field" />
      <ng-template #numberTmp>
        <input style="width: 100%;" type="number" pInputText [formControl]="formControl" [formlyAttributes]="field" />
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {}
