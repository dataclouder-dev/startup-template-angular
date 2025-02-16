import { Injectable } from '@angular/core';
import { IAgentCard } from '@dataclouder/conversation-system';
import { Endpoints } from 'src/app/core/enums';
import { NotionAbstractService, NotionDBResponse, NotionExportType, NotionPageResponse } from '@dataclouder/lessons';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class NotionService implements NotionAbstractService {
  constructor(private httpService: HttpService) {}

  public getDBAvailible(): Promise<NotionDBResponse> {
    return this.httpService.getDataFromService(Endpoints.Notion.ListDBs);
  }

  public getPagesAvailable(): Promise<NotionPageResponse> {
    return this.httpService.getDataFromService(Endpoints.Notion.ListPages);
  }

  public createNotionPage(card: IAgentCard): Promise<{ success: boolean; error: string; page: any }> {
    return this.httpService.getDataFromService(`${Endpoints.Notion.CreatePage}/${card.id}`);
  }

  public async getPageInSpecificFormat(pageId: string, format: NotionExportType): Promise<any> {
    const data = await this.httpService.getDataFromService(`${Endpoints.Notion.PageInSpecificFormat}/${pageId}?exportType=${format}`);
    return data;
  }
}
