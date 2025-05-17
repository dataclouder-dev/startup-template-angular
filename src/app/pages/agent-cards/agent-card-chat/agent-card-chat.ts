import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';

import { DCChatComponent, IConversationSettings, ChatUserSettings, ChatRole, AudioSpeed, IAgentCard } from '@dataclouder/ngx-agent-cards';
import { ActivatedRoute } from '@angular/router';
import { AgentCardService } from 'src/app/services/agent-card-service';

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
    fixGrammar: false,
    superHearing: false,
    voice: 'en-US',
    autoTranslate: false,
    synthVoice: false,
    highlightWords: false,
    speedRate: 1,
    speed: AudioSpeed.Regular,
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      // TODO fix this, card can be passed as param (WIP), or fetched from the service
      this.agentCard = JSON.parse(params.get('conversationCard')!);
      if (!this.agentCard) {
        const id = params.get('id') as string;
        const card = await this.conversationCardsService.findConversationCardByID(id);
        console.log('card', card);
        this.agentCard = card;
        this.cdr.detectChanges();
      }
    });
  }

  // Add your component logic here
}
