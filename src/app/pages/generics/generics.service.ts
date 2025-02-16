import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Endpoints } from '../../core/enums';
import { IGenericLLM } from './models/generics.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  constructor(private httpService: HttpService) {}

  public async getGenerics(): Promise<IGenericLLM[]> {
    return [
      { id: '1', name: 'Generic 1', description: 'Description with short description', tag: 'tag1' },
      {
        id: '2',
        name: 'Generic 2',
        description:
          'Description  with a Medium description, lorep ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        tag: 'tag2',
      },
      {
        id: '3',
        name: 'Generic 3',
        description:
          'Description  with a long description, lorep ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        tag: 'tag3',
      },
    ];
  }

  public async getGeneric(id: string): Promise<IGenericLLM> {
    // return this.httpService.getDataFromService<ISourceLLM>(`${Endpoints.Sources.Source}/${id}`);
    return {
      id: '3',
      name: 'Generic 3',
      description: 'Description 3',
    };
  }

  public async saveGeneric(generic: IGenericLLM): Promise<IGenericLLM> {
    // return this.httpService.postDataToService<ISourceLLM>(Endpoints.Sources.Source, source);
    return {
      id: '4',
      name: 'Generic 4',
      description: 'Description 4',
    };
  }

  public async deleteGeneric(id: string) {
    // return this.httpService.deleteDataFromService(`${Endpoints.Sources.Source}/${id}`);
  }
}
