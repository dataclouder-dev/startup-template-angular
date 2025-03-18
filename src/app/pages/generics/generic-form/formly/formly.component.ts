import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyModule } from '@ngx-formly/core';
@Component({
  selector: 'app-extra-forms',
  imports: [FormlyModule, ReactiveFormsModule],
  templateUrl: './formly.component.html',
  styleUrl: './formly.component.css',
  standalone: true,
})
export class ExtraForms {
  form = new FormGroup({});
  model = { email: 'email@gmail.com', Data: 'Data from form' };
  // options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'Data',
      type: 'input',
      props: { label: 'Text', placeholder: 'Formly is terrific!', required: true },
    },
    {
      key: 'email',
      type: 'textarea',
      templateOptions: { label: 'Email address', placeholder: 'Enter email', required: true },
    },
  ];

  onSubmit() {
    console.log(this.form);
    debugger;
    alert(JSON.stringify(this.model, null, 4));
  }
}
