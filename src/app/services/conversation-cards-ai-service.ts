import { Injectable } from '@angular/core';
import {
  AudioSpeed,
  ChatRole,
  AgentCardsAbstractService,
  ConversationPromptSettings,
  ConversationUserSettings,
  IAgentCard,
  ModelName,
  TranscriptionsWhisper,
} from '@dataclouder/conversation-system';
import { HttpService } from './http.service';
import { UserService } from '../dc-user-module/user.service';
import { Endpoints } from '../core/enums';
import { FiltersConfig } from '@dataclouder/core-components';

export type AudioGenerated = { blobUrl: string; transcription: any };
export type TTSRequest = { text: string; voice: string; generateTranscription: boolean; speedRate: number; speed?: string; ssml?: string };

@Injectable({
  providedIn: 'root',
})
export class AgentCardService implements AgentCardsAbstractService {
  constructor(private httpService: HttpService, private userService: UserService) {}

  async filterConversationCards(filters: FiltersConfig): Promise<any> {
    return await this.httpService.postDataToService(`${Endpoints.ConversationCard.ConversationQuery}`, filters);
  }

  public async getAudioTranscriptions(audioBlob: Blob, metadata: any = null): Promise<TranscriptionsWhisper> {
    alert('revisar que ya funcionan  las transcriptions');
    return await this.httpService.uploadAudioFile(`${Endpoints.ConversationCard.Whisper}`, audioBlob, metadata, 'python');
  }

  public async findAgentCards(paginator: FiltersConfig) {
    const response = await this.httpService.postDataToService(`${Endpoints.ConversationCard.ConversationQuery}`, paginator);
    return response;
  }

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
    const httpReq: any = await this.httpService.receiveFile(`api/tts-library/tts`, tts, 'python');
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

  public deleteConversationCard(id: string): Promise<IAgentCard> {
    return this.httpService.deleteDataFromService(`${Endpoints.ConversationCard.Conversation}/${id}`);
  }

  public findConversationCardByID(id: string): Promise<IAgentCard> {
    return this.httpService.getDataFromService(`${Endpoints.ConversationCard.Conversation}/${id}`);
  }
  public getAllConversationCards(): Promise<IAgentCard[]> {
    return this.httpService.getDataFromService(`${Endpoints.ConversationCard.Conversation}`);
  }

  async saveConversationCard(conversation: IAgentCard): Promise<IAgentCard> {
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

    return await this.httpService.postDataToService(`${Endpoints.ConversationCard.AgentChat}`, conversationFiltered, 'python');
  }

  getText(): void {
    console.log('getText');
  }

  setTTS(): void {
    console.log('getText');
  }
}
