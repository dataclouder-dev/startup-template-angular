import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, sendSharp, send } from 'ionicons/icons';
import {
  ChatUserSettings,
  IConversationSettings,
  ChatRole,
  ConversationCardListsComponent,
  AudioSpeed,
  CONVERSATION_AI_TOKEN,
  AgentCardsAbstractService,
  IAgentCard,
} from '@dataclouder/conversation-system';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/core-components';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, ConversationCardListsComponent],
})
export class ChatComponentPage implements OnInit {
  public chatUserSettings: ChatUserSettings = {
    realTime: false,
    repeatRecording: false,
    fixGrammar: false,
    superHearing: false,
    voice: 'default',
    autoTranslate: false,
    highlightWords: false,
    synthVoice: false,
    speed: AudioSpeed.Regular,
    speedRate: 1,
  };

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService,
    @Inject(CONVERSATION_AI_TOKEN) private agentCardService: AgentCardsAbstractService
  ) {
    addIcons({ send, sendOutline, sendSharp });
  }

  ngOnInit() {
    // Initialize with some dummy messages
  }

  public goToDetails(idCard: any) {
    console.log('goToDetails', idCard);
    const navigationExtras: NavigationExtras = {
      state: {
        conversation: idCard,
      },
    };
    this.router.navigate(['/page/stack/conversation-details', idCard], navigationExtras);
  }

  public goToEdit(idCard: any) {
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
    debugger;
    const itemId = item._id || item.id;
    switch (action) {
      case 'view':
        this.router.navigate(['./details', item.id], { relativeTo: this.route });
        break;
      case 'delete':
        const areYouSure = confirm('¿Estás seguro de querer eliminar este origen?');
        if (areYouSure) {
          await this.agentCardService.deleteConversationCard(item.id);
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
}
