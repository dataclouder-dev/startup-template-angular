import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DCChatComponent, IConversationSettings, ChatUserSettings, ChatRole, AudioSpeed, IAgentCard } from '@dataclouder/ngx-agent-cards';
import { ActivatedRoute } from '@angular/router';
import { AgentCardService } from 'src/app/services/conversation-cards-ai-service';

@Component({
  selector: 'app-conversation-card-chat',
  standalone: true,
  imports: [CommonModule, DCChatComponent],
  templateUrl: './conversation-card-chat.component.html',
  styleUrls: ['./conversation-card-chat.component.scss'],
})
export class ConversationCardChatComponent implements OnInit {
  @Input() conversationCard!: IAgentCard;
  public IConversationSettings: IConversationSettings = {
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

  constructor(private route: ActivatedRoute, private conversationCardsService: AgentCardService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      // TODO fix this, card can be passed as param (WIP), or fetched from the service
      this.conversationCard = JSON.parse(params.get('conversationCard')!);
      if (!this.conversationCard) {
        const id = params.get('id') as string;
        const card = await this.conversationCardsService.findConversationCardByID(id);
        console.log('card', card);
        this.conversationCard = card;
        this.cdr.detectChanges();
      }
    });
  }
  // Add your component logic here
}
