import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IGeneric } from '../models/generics.model';
import { GenericService } from '../generics.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { AspectType, CropperComponentModal, ResolutionType, CloudStorageData } from '@dataclouder/ngx-cloud-storage';

import { EntityBaseFormComponent } from '@dataclouder/ngx-core';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { DialogModule } from 'primeng/dialog';
import { GenericListComponent } from '../generic-list/generic-list.component';

@Component({
  selector: 'app-source-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    TextareaModule,
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
export class GenericFormComponent extends EntityBaseFormComponent<IGeneric> implements OnInit {
  protected entityCommunicationService = inject(GenericService);
  private fb = inject(FormBuilder);

  public form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    image: [{} as CloudStorageData],
    type: [''],
    relation: [{ id: '', name: '', description: '' }],
    extension: new FormGroup({}),
  });

  protected override patchForm(entity: IGeneric): void {
    throw new Error('Method not implemented.');
  }

  public storageImgSettings = {
    path: `generics`,
    cropSettings: { aspectRatio: AspectType.Square, resolutions: [ResolutionType.MediumLarge], resizeToWidth: 700 },
  };

  extraFields: FormlyFieldConfig[] = [
    { key: 'title', type: 'input', props: { label: 'Title', placeholder: 'Title', required: false } },
    { key: 'content', type: 'textarea', props: { label: 'Content', placeholder: 'Content', required: false } },
  ];

  public peopleOptions = [
    { id: '1', name: 'Yang Feng', description: 'Description with short description', image: 'assets/defaults/images/face-1.jpg' },
    { id: '2', name: 'Juan Perez', description: 'Description ', image: 'assets/defaults/images/face-2.jpg' },
    { id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/defaults/images/face-3.jpg' },
  ];

  public selectedPeople: any[] = [{ id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/defaults/images/face-3.jpg' }];

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

  async ngOnInit(): Promise<void> {}

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
    alert('Relation selected');
  }
}
