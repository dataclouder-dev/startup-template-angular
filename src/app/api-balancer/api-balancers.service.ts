import { Injectable, inject } from '@angular/core';
import { IApiBalancer } from './models/api-balancers.model';
import { FiltersConfig, TOAST_ALERTS_TOKEN, EntityCommunicationService } from '@dataclouder/ngx-core';

const server = 'primary';
// TODO add your own end points
const Endpoints = {
  ApiBalancers: {
    ApiBalancers: 'api-balancer',
    ApiBalancersFiltered: 'api-balancer/query',
  },
};

@Injectable({
  providedIn: 'root',
})
export class ApiBalancerService extends EntityCommunicationService<IApiBalancer> {
  private toastService = inject(TOAST_ALERTS_TOKEN);

  constructor() {
    super(Endpoints.ApiBalancers.ApiBalancers);
  }

  public async getApiBalancers(): Promise<IApiBalancer[]> {
    const response = await this.findAll();
    this.toastService.success({ title: 'Se han encontrado ApiBalancers', subtitle: 'Mostrando información' });
    return response;
  }

  public async getFilteredApiBalancers(filter: FiltersConfig) {
    return this.query(filter);
  }

  public async getApiBalancer(id: string): Promise<IApiBalancer> {
    return this.findOne(id);
  }

  public async saveApiBalancer(ApiBalancer: IApiBalancer): Promise<IApiBalancer> {
    return this.createOrUpdate(ApiBalancer);
  }

  public async deleteApiBalancer(id: string) {
    this.remove(id);
  }
}
