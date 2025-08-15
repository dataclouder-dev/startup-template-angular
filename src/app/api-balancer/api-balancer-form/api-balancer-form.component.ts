import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IApiBalancer } from '../models/api-balancers.model';
import { ApiBalancerService } from '../api-balancers.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { EntityBaseFormComponent } from '@dataclouder/ngx-core';
import { InputNumberModule } from 'primeng/inputnumber';


@Component({
  selector: 'app-api-balancer-form',
  imports: [ReactiveFormsModule, CardModule, TextareaModule, ButtonModule, InputTextModule, InputNumberModule],
  templateUrl: './api-balancer-form.component.html',
  styleUrl: './api-balancer-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ApiBalancerFormComponent extends EntityBaseFormComponent<IApiBalancer> {
  protected entityCommunicationService = inject(ApiBalancerService);
  private fb = inject(FormBuilder);

  public form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    provider: ['', Validators.required],
    key: ['', Validators.required],
    model: ['', Validators.required],
    rateLimits: this.fb.group({
      RPM: [0, Validators.required],
      RPD: [0, Validators.required],
      TPM: [0, Validators.required],
    }),
  });

  protected override patchForm(entity: IApiBalancer): void {
    if (entity) {
      this.form.patchValue(entity);
    }
  }
}
