import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, sendSharp, send } from 'ionicons/icons';
import { IConversationSettings, ChatRole, AgentCardListComponent, AudioSpeed, CONVERSATION_AI_TOKEN, IAgentCard } from '@dataclouder/ngx-agent-cards';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ChatUserSettings, OnActionEvent, TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/ngx-core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-agent-card-list',
  templateUrl: './agent-card-list.html',
  styleUrls: ['./agent-card-list.scss'],
  standalone: true,
  imports: [FormsModule, IonContent, AgentCardListComponent, ButtonModule],
})
export class AgentCardListPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject<ToastAlertsAbstractService>(TOAST_ALERTS_TOKEN);
  private agentCardService = inject(CONVERSATION_AI_TOKEN);

  public chatUserSettings: ChatUserSettings = {
    realTime: false,
    repeatRecording: false,
    superHearing: false,
    voice: 'default',
    highlightWords: false,
    synthVoice: false,
    speed: AudioSpeed.Regular,
    speedRate: 1,
    userMessageTask: false,
    assistantMessageTask: false,
  };

  public viewMode: 'table' | 'cards' = 'table';

  public IConversationSettings: IConversationSettings = {
    messages: [
      { role: ChatRole.System, content: 'you are a helpful assistant talking about fruits, vegetables and similar' },
      {
        role: ChatRole.Assistant,
        content: 'hello! How can I assist you today, do you want to know about fruits?',
      },
    ],
  };

  messages: any[] = [];
  newMessage: string = '';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    addIcons({ send, sendOutline, sendSharp });
  }

  ngOnInit() {
    // Initialize with some dummy messages
  }

  public actions: MenuItem[] = [
    { title: 'details', label: 'Ver detalles', icon: 'ionicons:pencil' },
    { title: 'edit', label: 'Editar', icon: 'ionicons:edit' },
    { title: 'delete', label: 'Eliminar', icon: 'ionicons:trash' },
  ];

  public goToDetails(idCard: any) {
    console.log('goToDetails', idCard);
    const navigationExtras: NavigationExtras = {
      state: {
        conversation: idCard,
      },
    };
    this.router.navigate(['/page/stack/conversation-details', idCard], navigationExtras);
  }

  public goToEdit(idCard: string | null = null) {
    if (idCard) {
      this.router.navigate(['/page/stack/conversation-form', idCard]);
    } else {
      this.router.navigate(['/page/stack/conversation-form']);
    }
  }

  public getCustomButtons(card: IAgentCard): MenuItem[] {
    // 🥛 powerfull use of closures
    // [getCustomButtons]: its really hard to explain but, since it use speeddial, i can pass data it self only funtions, and the only way to pass is at initialization time [model]="getCustomButtons(card)"
    // so that why i'm passing a closure function, that means that the command/function will be created with params at the moment of the initialization
    // and becouse i'm using function in this context and in to bind(this) -> getCustomButtons.bind(this)
    return [
      {
        label: 'Ver detalles',
        tooltipOptions: { tooltipLabel: 'Ver detalles', tooltipPosition: 'bottom' },
        icon: 'pi pi-eye',
        command: () => this.doAction('view', card),
      },
      {
        icon: 'pi pi-pencil',
        tooltipOptions: { tooltipLabel: 'Editar', tooltipPosition: 'bottom' },
        command: () => this.doAction('edit', card),
      },
      {
        icon: 'pi pi-trash',
        tooltipOptions: { tooltipLabel: 'Eliminar', tooltipPosition: 'bottom' },
        command: () => this.doAction('delete', card),
      },
    ];
  }

  public async doAction(action: string, item: any) {
    const itemId = item._id || item.id;
    switch (action) {
      case 'view':
        this.router.navigate(['./details', item.id], { relativeTo: this.route });
        break;
      case 'delete':
        const areYouSure = confirm('¿Estás seguro de querer eliminar este origen?');
        if (areYouSure) {
          await this.agentCardService.completeAgentCard(item.id);
          // this.conversationCards = this.conversationCards.filter((card) => card._id !== id);

          this.toastService.success({ title: 'Conversation card deleted', subtitle: 'Pero tienes que actualizar la página para ver el cambio' });
          this.cdr.detectChanges();
        }

        break;
      case 'edit':
        this.router.navigate(['../stack/conversation-form', itemId], { relativeTo: this.route });
        break;
    }
  }

  handleAction(actionEvent: OnActionEvent) {
    debugger;
    console.log('doAction', { item: actionEvent.item, action: actionEvent.action });
    if (actionEvent.action === 'edit') {
      this.goToEdit(actionEvent.item._id);
    } else if (actionEvent.action === 'new') {
      this.goToEdit();
    } else if (actionEvent.action === 'delete') {
      this.doAction('delete', actionEvent.item);
    } else if (actionEvent.action === 'details') {
      this.goToDetails(actionEvent.item._id);
    } else if (actionEvent.action === 'select') {
      this.goToDetails(actionEvent.item._id);
    } else {
      console.log('Unknown action:', actionEvent.action);
    }
  }
}
