import { Component, OnInit, inject } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { DcAgentCardDetailsComponent, IAgentCard } from '@dataclouder/ngx-agent-cards';

@Component({
  selector: 'app-agent-card-details',
  templateUrl: './agent-card-details.html',
  styleUrls: ['./agent-card-details.scss'],
  standalone: true,
  imports: [DcAgentCardDetailsComponent],
})
export class AgentCardDetailsPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  conversationId: any;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    // First try to get from state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { conversation: any };
    if (state?.conversation) {
      this.conversationId = state.conversation;
    } else {
      // If not in state, get from path params
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.conversationId = params['id'];
        }
      });
    }
  }

  ngOnInit() {
    if (!this.conversationId) {
      this.router.navigate(['/page/chat']);
    }
  }

  public startConversation(card: IAgentCard) {
    console.log('startConversation', card);
    this.router.navigate(['/page/stack/chat', card._id], {
      state: {
        conversation: card,
      },
    });
  }
}
