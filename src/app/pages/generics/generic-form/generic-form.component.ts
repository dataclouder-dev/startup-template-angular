import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IGenericLLM } from '../models/generics.model';
import { GenericService } from '../generics.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Textarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/core-components';

@Component({
  selector: 'app-source-form',
  imports: [ReactiveFormsModule, CardModule, InputTextModule, DropdownModule, Textarea, ButtonModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFormComponent implements OnInit {
  genericForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private genericService: GenericService,
    private fb: FormBuilder,
    private router: Router,
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService
  ) {
    this.genericForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public generic: IGenericLLM | null = null;
  public genericId = this.route.snapshot.params['id'];

  async ngOnInit(): Promise<void> {
    if (this.genericId) {
      this.generic = await this.genericService.getGeneric(this.genericId);
      if (this.generic) {
        this.genericForm.patchValue(this.generic);
      }
    }
  }

  async save() {
    if (this.genericForm.valid) {
      const generic = { ...this.genericForm.value, ...this.generic } as IGenericLLM;

      const result = await this.genericService.saveGeneric(generic);

      if (!this.genericId) {
        this.router.navigate([result.id], { relativeTo: this.route });
      }
      this.toastService.success({
        title: 'Origen guardado',
        subtitle: 'El origen ha sido guardado correctamente',
      });
    }
  }
}
