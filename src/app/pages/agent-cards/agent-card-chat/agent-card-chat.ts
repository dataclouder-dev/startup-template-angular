import { ChangeDetectorRef, Component, Input, OnInit, inject, effect } from '@angular/core';

import { DCChatComponent, IConversationSettings, ChatRole, AudioSpeed, IAgentCard, ChatMonitorService } from '@dataclouder/ngx-agent-cards';
import { ActivatedRoute } from '@angular/router';
import { AgentCardService } from 'src/app/services/agent-card-service';
import { ChatUserSettings } from '@dataclouder/ngx-core';

@Component({
  selector: 'app-agent-card-chat',
  standalone: true,
  imports: [DCChatComponent],
  templateUrl: './agent-card-chat.html',
  styleUrls: ['./agent-card-chat.scss'],
})
export class AgentCardChatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private conversationCardsService = inject(AgentCardService);
  private cdr = inject(ChangeDetectorRef);
  private chatMonitorService = inject(ChatMonitorService);

  constructor() {
    effect(() => {
      const message = this.chatMonitorService.messageAudioWillPlay$();
      if (message) {
        console.log('AgentCardChatComponent: Audio will play for message:', message);
      }
    });
  }

  @Input() agentCard!: IAgentCard;
  public conversationSettings: IConversationSettings = {
    messages: [{ text: 'you are having a conversation with?', content: 'bot', role: ChatRole.System }],
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
        const card = await this.conversationCardsService.findAgentCardByID(id);
        console.log('loading agent card...');
        this.agentCard = card;
        this.cdr.detectChanges();
      }
    });
  }

  // Add your component logic here
}
