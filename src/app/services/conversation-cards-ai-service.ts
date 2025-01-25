import { Injectable } from '@angular/core';
import {
  AudioSpeed,
  ChatRole,
  ConversationAIAbstractService,
  ConversationPromptSettings,
  ConversationUserSettings,
  IConversationCard,
  ModelName,
} from '@dataclouder/conversation-system';
import { HttpService } from './http.service';
import { UserService } from '../dc-user-module/user.service';
import { Endpoints } from '../core/enums';

export type AudioGenerated = { blobUrl: string; transcription: any };
export type TTSRequest = { text: string; voice: string; generateTranscription: boolean; speedRate: number; speed?: string; ssml?: string };

@Injectable({
  providedIn: 'root',
})
export class ConversationCardsService implements ConversationAIAbstractService {
  constructor(private httpService: HttpService, private userService: UserService) {}

  public async getListModels(provider: string): Promise<any> {
    const data = await this.httpService.getDataFromService(`${Endpoints.ConversationCard.ListModels}?provider=${provider}`, 'python');
    return data;
  }

  async translateConversation(currentLang: string, targetLang: string, idCard: string): Promise<ConversationUserSettings> {
    const response = await this.httpService.postDataToService(
      `${Endpoints.ConversationCard.TranslateConversation}`,
      { currentLang, targetLang, idCard },
      'python'
    );

    return response;
  }

  async saveConversationUserChatSettings(conversation: ConversationUserSettings): Promise<ConversationUserSettings> {
    console.log('saveConversationUserChatSettings', conversation);
    const data = await this.userService.saveUser({ conversationSettings: conversation });
    this.userService.user!.conversationSettings = conversation as ConversationUserSettings;
    return Promise.resolve(conversation);
  }

  getConversationUserChatSettings(): Promise<ConversationUserSettings> {
    debugger;
    if (this.userService.user?.conversationSettings) {
      return Promise.resolve(this.userService.user?.conversationSettings as ConversationUserSettings);
    } else {
      return Promise.resolve({
        realTime: false,
        repeatRecording: false,
        fixGrammar: false,
        superHearing: false,
        voice: 'en-US',
        autoTranslate: false,
        synthVoice: false,
        highlightWords: false,
        speedRate: 1,
        modelName: '',
        provider: '',
        speed: AudioSpeed.Regular,
      } as ConversationUserSettings);
    }
  }

  getConversationPromptSettings(): Promise<ConversationPromptSettings> {
    throw new Error('Method not implemented.');
  }

  public async getTextAudioFile(tts: TTSRequest): Promise<AudioGenerated> {
    const httpReq: any = await this.httpService.receiveFile(`api/conversation-ai/tts`, tts);
    const audioData: any = { blobUrl: null, transcription: null };
    const transcription = httpReq?.headers.get('transcription');

    if (transcription) {
      const data = JSON.parse(transcription);
      audioData.transcription = data;
    }

    const mp3 = window.URL.createObjectURL(httpReq.body);
    audioData.blobUrl = mp3;

    return audioData;
  }

  public deleteConversationCard(id: string): Promise<IConversationCard> {
    return this.httpService.deleteDataFromService(`${Endpoints.ConversationCard.Conversation}/${id}`);
  }

  public findConversationCard(id: string): Promise<IConversationCard> {
    return this.httpService.getDataFromService(`${Endpoints.ConversationCard.Conversation}/${id}`);
  }
  public getAllConversationCards(): Promise<IConversationCard[]> {
    return this.httpService.getDataFromService(`${Endpoints.ConversationCard.Conversation}`);
  }

  async saveConversationCard(conversation: IConversationCard): Promise<IConversationCard> {
    if (conversation.id || conversation._id) {
      return await this.httpService.putDataFromService(`${Endpoints.ConversationCard.Conversation}/${conversation._id}`, conversation);
    } else {
      return await this.httpService.postDataToService(`${Endpoints.ConversationCard.Conversation}`, conversation);
    }
  }

  public async callChatCompletion(conversation: ConversationPromptSettings): Promise<any> {
    console.log('callChatCompletion', conversation);

    let messages = conversation.messages?.map((m: any) => ({ content: m.content, role: m.role }));

    messages = messages?.filter((m: any) => m.role != ChatRole.AssistantHelper);
    const conversationFiltered = { ...conversation, messages };

    return await this.httpService.postDataToService(`${Endpoints.ConversationCard.Conversation}`, conversationFiltered, 'python');
  }

  getText(): void {
    console.log('getText');
  }

  setTTS(): void {
    console.log('getText');
  }
}
