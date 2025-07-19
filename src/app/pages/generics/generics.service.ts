import { Injectable, inject } from '@angular/core';
import { IGeneric } from './models/generics.model';
import { FiltersConfig, TOAST_ALERTS_TOKEN, EntityCommunicationService } from '@dataclouder/ngx-core';

const server = 'primary';
// TODO add your own end points
const Endpoints = {
  Generics: {
    Generics: 'api/generic',
    GenericsFiltered: 'api/generic/query',
  },
};

@Injectable({
  providedIn: 'root',
})
export class GenericService extends EntityCommunicationService<IGeneric> {
  private toastService = inject(TOAST_ALERTS_TOKEN);

  constructor() {
    super(Endpoints.Generics.Generics);
  }

  public async getGenerics(): Promise<IGeneric[]> {
    const response = await this.findAll();
    this.toastService.success({ title: 'Se han encontrado generics', subtitle: 'Mostrando información' });
    return response;
  }

  public async getFilteredGenerics(filter: FiltersConfig) {
    return this.query(filter);
  }

  public async getGeneric(id: string): Promise<IGeneric> {
    return this.findOne(id);
  }

  public async saveGeneric(generic: IGeneric): Promise<IGeneric> {
    return this.createOrUpdate(generic);
  }

  public async deleteGeneric(id: string) {
    this.remove(id);
  }
}
