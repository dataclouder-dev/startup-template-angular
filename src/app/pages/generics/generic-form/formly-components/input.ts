import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';
import { InputTextModule } from 'primeng/inputtext';


interface InputProps extends FormlyFieldProps {}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<InputProps> {
  type: 'input' | Type<FormlyFieldInput>;
}

@Component({
  imports: [ReactiveFormsModule, InputTextModule, FormlyModule],

  selector: 'formly-field-primeng-input',
  template: `
    <div style="display: block; width: 100%; margin-bottom: .5rem;">
      <span style="width: 100%; font-weight: bold; font-size: 1rem; margin-bottom: 0.5rem;">{{ field.key }}</span>
      @if (props.type !== 'number') {
        <input
          style="width: 100%;"
          pInputText
          [type]="props.type || 'text'"
          [formControl]="formControl"
          [formlyAttributes]="field" />
      } @else {
        <input style="width: 100%;" type="number" pInputText [formControl]="formControl" [formlyAttributes]="field" />
      }
    </div>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {}
