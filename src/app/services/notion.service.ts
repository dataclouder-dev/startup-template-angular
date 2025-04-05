import { Injectable, inject } from '@angular/core';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { Endpoints } from 'src/app/core/enums';
import { NotionAbstractService, NotionDBResponse, NotionExportType, NotionPageResponse } from '@dataclouder/ngx-lessons';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class NotionService implements NotionAbstractService {
  private httpService = inject(HttpService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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
