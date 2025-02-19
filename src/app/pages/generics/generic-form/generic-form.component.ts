import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IGeneric } from '../models/generics.model';
import { GenericService } from '../generics.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/core-components';

@Component({
  selector: 'app-source-form',
  imports: [ReactiveFormsModule, CardModule, TextareaModule, DropdownModule, ButtonModule, SelectModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFormComponent implements OnInit {
  public genericForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    type: [''],
    relation: [{ id: '', name: '', description: '' }],
  });

  public genericTypes = [
    { label: 'Type 1', value: 'type1' },
    { label: 'Type 2', value: 'type2' },
    { label: 'Type 3', value: 'type3' },
  ];

  public relationObjects = [
    { id: 'Relation 1', name: 'relation1', description: 'Description with short description' },
    { id: 'Relation 2', name: 'relation2', description: 'Description with short description' },
    { id: 'Relation 3', name: 'relation3', description: 'Description with short description' },
  ];

  constructor(
    private route: ActivatedRoute,
    private genericService: GenericService,
    private fb: FormBuilder,
    private router: Router,
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService
  ) {}

  public generic: IGeneric | null = null;
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
      const generic = { ...this.genericForm.value, ...this.generic } as IGeneric;

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
