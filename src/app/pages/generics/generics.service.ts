import { inject, Injectable } from '@angular/core';
import { IGeneric } from './models/generics.model';
import { APP_CONFIG, EntityCommunicationService, IAppConfig } from '@dataclouder/ngx-core';

const Endpoints = 'generic';

@Injectable({
  providedIn: 'root',
})
export class GenericService extends EntityCommunicationService<IGeneric> {
  public config: IAppConfig = inject(APP_CONFIG);

  constructor() {
    super(Endpoints);
    this.customHost = this.config.backendPythonUrl;
  }
}
