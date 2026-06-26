import { Injectable, inject } from '@angular/core';
import {
  IAgentCard,
} from '@dataclouder/ngx-agent-cards';
import { HttpService } from './http.service';
import { Endpoints } from '../core/enums';
import {  FiltersConfig, IFilterQueryResponse } from '@dataclouder/ngx-core';
import { AppUserService } from './app-user.service';

export type AudioGenerated = { blobUrl: string; transcription: any };
export type TTSRequest = { text: string; voice: string; generateTranscription: boolean; speedRate: number; speed?: string; ssml?: string };

@Injectable({
  providedIn: 'root',
})
export class AgentCardService {


  private httpService = inject(HttpService);
  private userService = inject(AppUserService);

  public async callInstruction(text: string): Promise<any> {
    if (!text) {
      throw new Error('Text is required');
    }
    text = `Fix grammar and spelling errors in the following text: '${text}'`;
    return await this.httpService.postDataToService(`${Endpoints.AgentCard.Chat}`, { text }, 'node');
  }

  public async findFilteredAgentCards(paginator: FiltersConfig) {
    const response = await this.httpService.postDataToService(`${Endpoints.AgentCard.ConversationQuery}`, paginator);
    return response;
  }

  public async findAgentCardByTitle(title: string): Promise<IAgentCard> {
    const filters: FiltersConfig = { filters: { title } };
    const response = await this.httpService.postDataToService<IFilterQueryResponse<IAgentCard>>(`${Endpoints.AgentCard.ConversationQuery}`, filters);
    return response.rows[0];
  }


  public async getRandomAgentCard() {
    const response = await this.httpService.getDataFromService(`${Endpoints.AgentCard.Random}?size=1&onlyPublic=true`);
    return response;
  }



}
