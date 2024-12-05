import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '@dataclouder/conversation-system';

@Component({
  selector: 'app-conversation-card-chat',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  templateUrl: './conversation-card-chat.component.html',
  styleUrls: ['./conversation-card-chat.component.scss'],
})
export class ConversationCardChatComponent {
  // Add your component logic here
}
