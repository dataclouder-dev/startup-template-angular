import { Injectable, inject } from '@angular/core';
import { IDeckCommander } from './models/deck-commanders.model';
import { FiltersConfig, TOAST_ALERTS_TOKEN, EntityCommunicationService } from '@dataclouder/ngx-core';

const server = 'primary';
// TODO add your own end points
const Endpoints = {
  DeckCommanders: {
    DeckCommanders: 'DeckCommander',
    DeckCommandersFiltered: 'DeckCommander/query',
  },
};

@Injectable({
  providedIn: 'root',
})
export class DeckCommanderService extends EntityCommunicationService<IDeckCommander> {
  private toastService = inject(TOAST_ALERTS_TOKEN);

  constructor() {
    super(Endpoints.DeckCommanders.DeckCommanders);
  }

  public async getDeckCommanders(): Promise<IDeckCommander[]> {
    const response = await this.findAll();
    this.toastService.success({ title: 'Se han encontrado DeckCommanders', subtitle: 'Mostrando información' });
    return response;
  }

  public async getFilteredDeckCommanders(filter: FiltersConfig) {
    return this.query(filter);
  }

  public async getDeckCommander(id: string): Promise<IDeckCommander> {
    return this.findOne(id);
  }

  public async saveDeckCommander(DeckCommander: IDeckCommander): Promise<IDeckCommander> {
    return this.createOrUpdate(DeckCommander);
  }

  public async deleteDeckCommander(id: string) {
    this.remove(id);
  }

  public async executeCommand(deckCommander: IDeckCommander): Promise<IDeckCommander> {
    return this.httpService.post<IDeckCommander>(`api/${Endpoints.DeckCommanders.DeckCommanders}/execute`, deckCommander);
  }
}
