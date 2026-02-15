import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILive2d } from '../models/live2ds.model';
import { Live2dService } from '../live2ds.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { AspectType, CropperComponentModal, ResolutionType, FileStorageData, BackendUploadComponent, CloudStorage } from '@dataclouder/ngx-cloud-storage';

import { EntityBaseFormComponent } from '@dataclouder/ngx-core';
import { DialogModule } from 'primeng/dialog';
import { Live2dListComponent } from '../live2d-list/live2d-list.component';

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
    DialogModule,
    Live2dListComponent,
    BackendUploadComponent,
    DecimalPipe,
    CommonModule
],
  templateUrl: './live2d-form.component.html',
  styleUrl: './live2d-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Live2dFormComponent extends EntityBaseFormComponent<ILive2d> implements OnInit {
  protected entityCommunicationService = inject(Live2dService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  public form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    image: [{} as FileStorageData],
    type: [''],
    relation: [{ id: '', name: '', description: '' }],
    files: this.fb.control<(FileStorageData & CloudStorage)[]>([]),
  });

  protected override patchForm(entity: ILive2d): void {
    // NOTE: you may need to custom patchForm if contains arrays or custom logic.
    this.form.patchValue(entity);
  }

  public storageImgSettings = {
    path: `live2ds`,
    cropSettings: { aspectRatio: AspectType.Square, resolutions: [ResolutionType.MediumLarge], resizeToWidth: 700 },
  };


  public selectedPeople: any[] = [{ id: '3', name: 'John Doe', description: 'Description with short description', image: 'defaults/images/face-3.jpg' }];

  async ngOnInit(): Promise<void> {}

  public addItemToList(event: any) {
    this.selectedPeople.push(event.value);
  }

  public removeItemFromList(person: any) {
    this.selectedPeople = this.selectedPeople.filter(p => p.id !== person.id);
    console.log(this.selectedPeople);
  }

  public handleImageUpload(event: FileStorageData) {
    this.form.patchValue({ image: event });
    this.save();
    this.cdr.markForCheck();
  }

  public searchRelation() {
    alert('Search relation');
  }

  public isDialogVisible = false;
  public isFileDetailsVisible = false;
  public selectedFileForDetails: FileStorageData | null = null;

  public relationPopupSelector: any[] = [];

  public removeRelationFromList(relation: any) {
    this.relationPopupSelector = this.relationPopupSelector.filter(r => r.id !== relation.id);
    console.log(this.relationPopupSelector);
  }

  public handleRelationSelection(relation: ILive2d) {
    console.log(relation);

    // this.live2dForm.patchValue({ relation: relation });
    this.isDialogVisible = false;
    this.relationPopupSelector.push(relation);
    alert('Relation selected');
  }

  public handleUploadFinish(event: FileStorageData[]) {
    console.log('Uploaded files:', event);
    const currentFiles = this.form.get('files')?.value || [];
    const updatedFiles = [...currentFiles, ...event];
    this.form.patchValue({ files: updatedFiles });
    this.save();
    this.cdr.markForCheck();
  }

  public removeFile(file: FileStorageData) {
    const currentFiles = this.form.get('files')?.value || [];
    const updatedFiles = currentFiles.filter(f => f.url !== file.url);
    this.form.patchValue({ files: updatedFiles });
    this.save();
    this.cdr.markForCheck();
  }

  public showFileDetails(file: FileStorageData) {
    this.selectedFileForDetails = file;
    this.isFileDetailsVisible = true;
    this.cdr.markForCheck();
  }

}
