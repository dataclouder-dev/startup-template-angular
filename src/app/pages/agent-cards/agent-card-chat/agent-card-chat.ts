import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';

import { DCChatComponent, IConversationSettings, ChatRole, AudioSpeed, IAgentCard } from '@dataclouder/ngx-agent-cards';
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
        console.log('card', card);
        this.agentCard = card;
        this.cdr.detectChanges();
      }
    });
  }

  // Add your component logic here
}
