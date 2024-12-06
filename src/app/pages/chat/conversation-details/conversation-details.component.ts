import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons } from '@ionic/angular/standalone';

import { DcConversationCardDetailsComponent } from '@dataclouder/conversation-system';

@Component({
  selector: 'app-conversation-details',
  templateUrl: './conversation-details.component.html',
  styleUrls: ['./conversation-details.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, DcConversationCardDetailsComponent],
})
export class ConversationDetailsPage implements OnInit {
  conversationId: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { conversation: any };
    if (state) {
      this.conversationId = state.conversation;
    }
  }

  ngOnInit() {
    if (!this.conversationId) {
      this.router.navigate(['/page/chat']);
    }
  }

  public startConversation($event: any) {
    console.log('startConversation', $event);
    this.router.navigate(['/page/stack/chat'], {
      state: {
        conversation: $event,
      },
    });
  }
}
