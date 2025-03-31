import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IGeneric } from '../models/generics.model';
import { GenericService } from '../generics.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { AspectType, CropperComponentModal, ResolutionType, CloudStorageData } from '@dataclouder/ngx-cloud-storage';

import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/ngx-core';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { DialogModule } from 'primeng/dialog';
import { GenericListComponent } from '../generic-list/generic-list.component';
import { QuickTableComponent } from '../quick-table/quick-table';

@Component({
  selector: 'app-source-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    TextareaModule,
    DropdownModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    ChipModule,
    TooltipModule,
    CropperComponentModal,
    FormlyModule,
    DialogModule,
    GenericListComponent,
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class GenericFormComponent implements OnInit {
  public storageImgSettings = {
    path: `generics`,
    cropSettings: { aspectRatio: AspectType.Square, resolutions: [ResolutionType.MediumLarge], resizeToWidth: 700 },
  };

  extraFields: FormlyFieldConfig[] = [
    { key: 'title', type: 'input', props: { label: 'Title', placeholder: 'Title', required: false } },
    { key: 'content', type: 'textarea', props: { label: 'Content', placeholder: 'Content', required: false } },
  ];

  public genericForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    image: [{} as CloudStorageData],
    type: [''],
    relation: [{ id: '', name: '', description: '' }],
    extension: new FormGroup({}),
  });

  public peopleOptions = [
    { id: '1', name: 'Yang Feng', description: 'Description with short description', image: 'assets/images/face-1.jpg' },
    { id: '2', name: 'Juan Perez', description: 'Description ', image: 'assets/images/face-2.jpg' },
    { id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/images/face-3.jpg' },
  ];

  public selectedPeople: any[] = [{ id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/images/face-3.jpg' }];

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
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService,
    private cdr: ChangeDetectorRef
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
      const generic = { ...this.generic, ...this.genericForm.value } as IGeneric;

      const result = await this.genericService.saveGeneric(generic);

      if (!this.genericId) {
        this.router.navigate([result.id], { relativeTo: this.route });
      }
      this.toastService.success({ title: 'Origen guardado', subtitle: 'El origen ha sido guardado correctamente' });
    }
  }

  public addItemToList(event: any) {
    this.selectedPeople.push(event.value);
  }

  public removeItemFromList(person: any) {
    this.selectedPeople = this.selectedPeople.filter(p => p.id !== person.id);
    console.log(this.selectedPeople);
  }

  public handleImageUpload(event: any) {
    // this.genericForm.patchValue({ image: event });
    alert('Image uploaded');
  }

  public searchRelation() {
    alert('Search relation');
  }

  public isDialogVisible = false;

  public relationPopupSelector: any[] = [];

  public removeRelationFromList(relation: any) {
    this.relationPopupSelector = this.relationPopupSelector.filter(r => r.id !== relation.id);
    console.log(this.relationPopupSelector);
  }

  public handleRelationSelection(relation: IGeneric) {
    console.log(relation);

    // this.genericForm.patchValue({ relation: relation });
    this.isDialogVisible = false;
    this.relationPopupSelector.push(relation);
    this.cdr.detectChanges();
    alert('Relation selected');
  }
}
