import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Endpoints } from '../../core/enums';
import { GenericType, IGeneric } from './models/generics.model';
import { FiltersConfig, IFilterQueryResponse, TOAST_ALERTS_TOKEN } from '@dataclouder/core-components';
import { ToastAlertService } from 'src/app/services/toast.service';

const server = 'python';
@Injectable({
  providedIn: 'root',
})
export class GenericService {
  constructor(private httpService: HttpService, @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertService) {}

  public async getGenerics(): Promise<IGeneric[]> {
    try {
      const response = await this.httpService.getDataFromService(Endpoints.Generics.Generics, server);
      this.toastService.success({ title: 'Se han encontrado generics', subtitle: 'Mostrando información' });
      return response;
    } catch (error) {
      this.toastService.warn({ title: 'Error fetching generics', subtitle: 'Showing Default Data' });
      return [
        { id: '1', name: 'Generic 1', description: 'Description with short description', type: GenericType.Gen1 },
        {
          id: '2',
          name: 'Generic 2',
          description:
            'Description  with a Medium description, lorep ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          type: GenericType.Gen2,
        },
        {
          id: '3',
          name: 'Generic 3',
          description:
            'Description  with a long description, lorep ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          type: GenericType.Gen3,
        },
      ];
    }
  }

  public async getFilteredGenerics(filter: FiltersConfig) {
    return this.httpService.postDataToService<IFilterQueryResponse<IGeneric>>(Endpoints.Generics.GenericsFiltered, filter, server);
  }

  public async getGeneric(id: string): Promise<IGeneric> {
    // return this.httpService.getDataFromService<ISourceLLM>(`${Endpoints.Sources.Source}/${id}`);
    return {
      id: '3',
      name: 'Generic 3',
      description: 'Description 3',
    };
  }

  public async saveGeneric(generic: IGeneric): Promise<IGeneric> {
    return this.httpService.postDataToService(Endpoints.Generics.Generics, generic, server);
  }

  public async deleteGeneric(id: string) {
    // return this.httpService.deleteDataFromService(`${Endpoints.Sources.Source}/${id}`);
  }
}
