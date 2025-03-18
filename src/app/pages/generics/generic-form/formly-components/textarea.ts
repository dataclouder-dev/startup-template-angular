import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';

interface TextAreaProps extends FormlyFieldProps {}

export interface FormlyTextAreaFieldConfig extends FormlyFieldConfig<TextAreaProps> {
  type: 'textarea' | Type<FormlyFieldTextArea>;
}

@Component({
  imports: [ReactiveFormsModule, TextareaModule, FormlyModule, CommonModule],
  selector: 'formly-field-primeng-textarea',
  template: `
    <div style="display: block; width: 100%; margin-bottom: .5rem;">
      <span style="width: 100%; font-weight: bold; font-size: 1rem; margin-bottom: 0.5rem;">{{ field.key }}</span>
      <textarea style="width: 100%;" [formControl]="formControl" [formlyAttributes]="field" pTextarea></textarea>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType<FieldTypeConfig<TextAreaProps>> {}
