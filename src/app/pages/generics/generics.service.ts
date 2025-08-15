import { Injectable } from '@angular/core';
import { IGeneric } from './models/generics.model';
import { EntityCommunicationService } from '@dataclouder/ngx-core';

const Endpoints = 'generic';

@Injectable({
  providedIn: 'root',
})
export class GenericService extends EntityCommunicationService<IGeneric> {
  constructor() {
    super(Endpoints);
  }
}
