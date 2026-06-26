import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GenericService } from '../generics.service';
import { JsonPipe } from '@angular/common';
import { IGeneric } from '../models/generics.model';
import { EntityBaseDetailComponent } from '@dataclouder/ngx-core';

@Component({
  selector: 'app-generic-detail',
  imports: [JsonPipe],
  templateUrl: './generic-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericDetailComponent extends EntityBaseDetailComponent<IGeneric> {
  protected entityCommunicationService = inject(GenericService);
}
