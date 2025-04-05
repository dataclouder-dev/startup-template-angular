import { Injectable, inject } from '@angular/core';
import {
  AudioSpeed,
  ChatRole,
  AgentCardsAbstractService,
  ConversationMessagesDTO,
  ChatUserSettings,
  IAgentCard,
  ModelName,
  TranscriptionsWhisper,
  IConversationSettings,
  IAgentResponseDTO,
} from '@dataclouder/ngx-agent-cards';
import { HttpService } from './http.service';
import { UserService } from '../dc-user-module/user.service';
import { Endpoints } from '../core/enums';
import { FiltersConfig, IFilterQueryResponse } from '@dataclouder/ngx-core';

export type AudioGenerated = { blobUrl: string; transcription: any };
export type TTSRequest = { text: string; voice: string; generateTranscription: boolean; speedRate: number; speed?: string; ssml?: string };

@Injectable({
  providedIn: 'root',
})
export class AgentCardService implements AgentCardsAbstractService {
  private httpService = inject(HttpService);
  private userService = inject(UserService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  public async callInstruction(text: string): Promise<any> {
    if (!text) {
      throw new Error('Text is required');
    }
    text = `Fix grammar and spelling errors in the following text: '${text}'`;
    return await this.httpService.postDataToService(`${Endpoints.ConversationCard.AgentChat}`, { text });
  }

  public async findFilteredAgentCards(paginator: FiltersConfig) {
    const response = await this.httpService.postDataToService(`${Endpoints.ConversationCard.ConversationQuery}`, paginator);
    return response;
  }

  public async findAgentCardByTitle(title: string): Promise<IAgentCard> {
    const filters: FiltersConfig = { filters: { title } };
    const response = await this.httpService.postDataToService<IFilterQueryResponse<IAgentCard>>(`${Endpoints.ConversationCard.ConversationQuery}`, filters);
    return response.rows[0];
  }

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

  async translateConversation(currentLang: string, targetLang: string, idCard: string): Promise<ChatUserSettings> {
    const response = await this.httpService.postDataToService(
      `${Endpoints.ConversationCard.TranslateConversation}`,
      { currentLang, targetLang, idCard },
      'python'
    );

    return response;
  }

  async saveConversationUserChatSettings(conversation: ChatUserSettings): Promise<ChatUserSettings> {
    console.log('saveConversationUserChatSettings', conversation);
    const data = await this.userService.saveUser({ conversationSettings: conversation });
    this.userService.user!.conversationSettings = conversation as ChatUserSettings;
    return Promise.resolve(conversation);
  }

  getConversationUserChatSettings(): Promise<ChatUserSettings> {
    if (this.userService.user?.conversationSettings) {
      return Promise.resolve(this.userService.user?.conversationSettings as ChatUserSettings);
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
      } as ChatUserSettings);
    }
  }

  getConversationPromptSettings(): Promise<ConversationMessagesDTO> {
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

  public async callChatCompletion(conversation: IConversationSettings | ConversationMessagesDTO): Promise<IAgentResponseDTO> {
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
