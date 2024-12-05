import { Injectable } from '@angular/core';
import { ChatRole, ConversationAIAbstractService, ConversationChatSettings, IConversationCard } from '@dataclouder/conversation-system';
import { HttpService } from './http.service';

export type AudioGenerated = { blobUrl: string; transcription: any };
export type TTSRequest = { text: string; voice: string; generateTranscription: boolean; speedRate: number; speed?: string; ssml?: string };

@Injectable({
  providedIn: 'root',
})
export class ConversationAIService implements ConversationAIAbstractService {
  constructor(private httpService: HttpService) {}

  public deleteConversationCard(id: string): Promise<IConversationCard> {
    return this.httpService.deleteDataFromService(`api/conversation-ai/conversation/${id}`);
  }

  public findConversationCard(id: string): Promise<IConversationCard> {
    return this.httpService.getDataFromService(`api/conversation-ai/conversation/${id}`);
  }
  public getAllConversationCards(): Promise<IConversationCard[]> {
    return this.httpService.getDataFromService(`api/conversation-ai/conversation`);
  }

  async saveConversationCard(conversation: IConversationCard): Promise<IConversationCard> {
    if (conversation.id || conversation._id) {
      return await this.httpService.putDataFromService(`api/conversation-ai/conversation/${conversation._id}`, conversation);
    } else {
      return await this.httpService.putDataFromService('api/conversation-ai/conversation', conversation);
    }
  }

  // TODO: necesito ponerle un tipo al return.

  public async callChatCompletion(conversation: ConversationChatSettings): Promise<any> {
    console.log('callChatCompletion', conversation);

    let messages = conversation.messages?.map((m: any) => ({ content: m.content, role: m.role }));

    messages = messages?.filter((m: any) => m.role != ChatRole.AssistantHelper);
    const conversationFiltered = { ...conversation, messages };

    return await this.httpService.postDataToService(`api/conversation-ai/chat`, conversationFiltered, 'python');
  }

  getText(): void {
    console.log('getText');
  }

  setTTS(): void {
    console.log('getText');
  }
}
