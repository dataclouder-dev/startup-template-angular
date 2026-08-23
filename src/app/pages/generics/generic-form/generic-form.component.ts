import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { emptyGeneric, IGeneric } from '../models/generics.model';
import { GenericService } from '../generics.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { AspectType, CropperComponentModal, ResolutionType, FileStorageData } from '@dataclouder/ngx-cloud-storage';
import { EntityBaseSignalFormComponent } from '@dataclouder/ngx-core';
import { DialogModule } from 'primeng/dialog';
import { GenericListComponent } from '../generic-list/generic-list.component';

@Component({
  selector: 'app-source-form',
  imports: [
    FormField,
    FormsModule,
    CardModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    ChipModule,
    TooltipModule,
    CropperComponentModal,
    DialogModule,
    GenericListComponent,
  ],
  templateUrl: './generic-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class GenericFormComponent extends EntityBaseSignalFormComponent<IGeneric> {
  protected override entityCommunicationService = inject(GenericService);

  public entityForm = signal<IGeneric>(emptyGeneric());

  public form = form(this.entityForm, s => {
    required(s.name, { message: 'El nombre es obligatorio' });
  });

  public storageImgSettings = {
    path: `generics`,
    cropSettings: { aspectRatio: AspectType.Square, resolutions: [ResolutionType.MediumLarge], resizeToWidth: 700 },
  };

  extraFields: any[] = [
    { key: 'title', type: 'input', props: { label: 'Title', placeholder: 'Title', required: false } },
    { key: 'content', type: 'textarea', props: { label: 'Content', placeholder: 'Content', required: false } },
  ];

  public peopleOptions = [
    { id: '1', name: 'Yang Feng', description: 'Description with short description', image: 'defaults/images/face-1.jpg' },
    { id: '2', name: 'Juan Perez', description: 'Description ', image: 'defaults/images/face-2.jpg' },
    { id: '3', name: 'John Doe', description: 'Description with short description', image: 'defaults/images/face-3.jpg' },
  ];

  public selectedPeople: any[] = [{ id: '3', name: 'John Doe', description: 'Description with short description', image: 'defaults/images/face-3.jpg' }];

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

  public addItemToList(event: any) {
    this.selectedPeople.push(event.value);
  }

  public removeItemFromList(person: any) {
    this.selectedPeople = this.selectedPeople.filter(p => p.id !== person.id);
    console.log(this.selectedPeople);
  }

  public handleImageUpload(event: FileStorageData) {
    this.entityForm.update(m => ({ ...m, image: event }));
    this.save();
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
    this.entityForm.update(m => ({
      ...m,
      relation: { id: relation._id || relation.id || '', name: relation.name || '', description: relation.description || '' },
    }));
    this.isDialogVisible = false;
    this.relationPopupSelector.push(relation);
    alert('Relation selected');
  }
}

