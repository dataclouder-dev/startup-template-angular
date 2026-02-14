import { Injectable } from '@angular/core';
import { ILive2d } from './models/live2ds.model';
import { EntityCommunicationService } from '@dataclouder/ngx-core';

const Endpoints = 'live2d';

@Injectable({
  providedIn: 'root',
})
export class Live2dService extends EntityCommunicationService<ILive2d> {
  constructor() {
    super(Endpoints);
  }
}
