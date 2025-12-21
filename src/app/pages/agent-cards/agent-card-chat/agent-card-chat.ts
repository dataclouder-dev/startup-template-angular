import { ChangeDetectorRef, Component, Input, OnInit, inject, effect, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import {
  DCChatComponent,
  AudioSpeed,
  IAgentCard,
  ChatMonitorService,
  AGENT_CARDS_STATE_SERVICE,
  IConversationFlow,
  ConversationEvents,
  VideoPlayerService,
} from '@dataclouder/ngx-agent-cards';
import { ActivatedRoute } from '@angular/router';
import { ChatUserSettings, EModelQuality } from '@dataclouder/ngx-core';
import { CONVERSATION_AI_TOKEN } from '@dataclouder/ngx-agent-cards';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { UserService } from '@dataclouder/ngx-users';
import { ConceptStatus, ILearningUserState, KnowledgeLearningSystemService } from '@dataclouder/ngx-knowledge';

@Component({
  selector: 'app-agent-card-chat',
  standalone: true,
  imports: [DCChatComponent],
  templateUrl: './agent-card-chat.html',
  styleUrls: ['./agent-card-chat.scss'],
})
export class AgentCardChatComponent implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private conversationCardsService = inject(CONVERSATION_AI_TOKEN);
  private cdr = inject(ChangeDetectorRef);
  private chatMonitorService = inject(ChatMonitorService);
  private toastrService = inject(TOAST_ALERTS_TOKEN);
  private userService = inject(UserService);
  private knowledgeLearningSystemService = inject(KnowledgeLearningSystemService);
  private agentCardsMasterStateService = inject(AGENT_CARDS_STATE_SERVICE);
  private videoPlayerService = inject(VideoPlayerService);

  public testVideo =
    'https://firebasestorage.googleapis.com/v0/b/appingles-qa.appspot.com/o/conversation-cards%2F68d6a85874782b0505fce42c%2Fmotions%2Ffile%2F1758906445470-angry.mp4?alt=media&token=770a0831-3531-4130-b3f2-b288964cd9f8';

  @ViewChild('videoPlayer') set videoPlayerRef(ref: ElementRef<HTMLVideoElement>) {
    if (ref) {
      this.videoPlayer = ref;
      this.videoPlayerService.initializePlayer(this.videoPlayer);
    }
  }
  public videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor() {
    effect(() => {
      const message = this.chatMonitorService.messageAudioWillPlay$();
      if (message) {
        console.log('AgentCardChatComponent: Audio will play for message:', message);
      }
    });
  }

  @Input() agentCard!: IAgentCard;

  public DefaultConversationFlow: IConversationFlow = {
    goal: {
      enabled: true,
      task: `Evaluate the user's confidence when talking to a ai assistant. Give a score between -5 and 25. 
Assign -5 points if the user is rambling, uncooperative, or not making progress. 
give 5 points if user says short messages like hello, how are you? etc.
give 10 to 25 when user speaks well, cooperates, moves the conversation forward, and participates actively. and is taking leadership in the conversation.`,
      model: { quality: EModelQuality.FAST },
    },
    triggerTasks: {
      [ConversationEvents.OnUserMessage]: {
        enabled: true,
        task: `You are a conversation with a user`,
        model: { quality: EModelQuality.FAST },
      },
      [ConversationEvents.OnAssistantMessage]: {
        enabled: true,
        task: `You are a conversation with a user`,
        model: { quality: EModelQuality.FAST },
      },
    },
    challenges: [],
    dynamicConditions: [],
    moodState: {
      enabled: true,
      useAssetStatesOnly: false,
      detectableStates: [],
    },
  };

  public chatUserSettings: ChatUserSettings = {
    realTime: false,
    repeatRecording: false,
    superHearing: false,
    voice: 'en-US',
    synthVoice: false,
    highlightWords: false,
    speedRate: 1,
    speed: AudioSpeed.Regular,
    userMessageTask: false,
    assistantMessageTask: false,
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      // TODO fix this, card can be passed as param (WIP), or fetched from the service
      this.agentCard = JSON.parse(params.get('conversationCard')!);
      if (!this.agentCard) {
        const id = params.get('id') as string;
        const card = await this.conversationCardsService.findOne(id);
        console.log('loading agent card...');
        this.agentCard = card;
        this.cdr.detectChanges();
      }

      if (this.agentCard) {
        this.videoPlayerService.setAgentCard(this.agentCard);
      }
    });
  }

  public async onGoalCompleted(event: any) {
    console.log('Hurray ', event);
    this.toastrService.success({ subtitle: 'Muy bien anotaré tu esfuerzo', title: 'La conversación esta completada, puedes cerrar el dialogo cuando gustes' });

    const path = `agentCards`;

    const progress: ILearningUserState = {
      id: this.agentCard.id || '',
      path: path,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: ConceptStatus.Learned,
      learningType: 'learningExperience',
      learningExperience: {
        score: 100,
        goalCompleted: true,
      },
      stats: {
        progress: 100,
        totalReviews: 1,
        successCount: 1,
        failedCount: 0,
        totalTimeSpent: 0,
      },
    };

    // TODO: estos 2 deberían ir juntos en la misma función. como en words service que hay metodo actualiza el estado y el backend.
    const response = await this.knowledgeLearningSystemService.saveProgress(progress);
    if (response) {
      console.log(response);
      this.agentCardsMasterStateService.updateUserState(progress);
    }
  }

  public onChatEvent(event: any) {
    if (event.type == 'moodDetected') {
    }
    // console.log(event);
    //
  }

  ngAfterViewInit(): void {
    this.videoPlayerService.startConversation();
  }

  ngOnDestroy(): void {
    this.videoPlayerService.cleanUp();
  }

  // Add your component logic here
}
