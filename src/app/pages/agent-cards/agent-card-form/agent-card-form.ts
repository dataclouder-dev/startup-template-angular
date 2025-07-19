import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

import { DCAgentCardFormComponent, IAgentCard } from '@dataclouder/ngx-agent-cards';

import { AlertController } from '@ionic/angular/standalone';

import { environment } from 'src/environments/environment';
import { RouteNames } from 'src/app/core/enums';
import { AgentCardService } from 'src/app/services/agent-card-service';

@Component({
  selector: 'app-agent-card-form',
  standalone: true,
  imports: [DCAgentCardFormComponent],
  templateUrl: './agent-card-form.html',
  styleUrl: './agent-card-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCardFormPage implements OnInit {
  private conversationCardsService = inject(AgentCardService);
  private router = inject(Router);
  private AlertController = inject(AlertController);
  private toastController = inject(ToastController);

  public currentPath: string = ' ';

  public projectName = environment.projectName;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.currentPath = this.router.url.split('/')[3];
  }

  public onSave() {
    this.AlertController.create({
      header: 'Save',
      message: 'Conversation saved',
      buttons: ['OK'],
    }).then(alert => alert.present);
  }

  public async goToDetails(id: string) {
    this.router.navigate([RouteNames.Page, RouteNames.Stack, RouteNames.ConversationDetails, id]);
  }

  public async onTranslate(dataEvent: { card: IAgentCard; currentLang: string; targetLang: string; id: string }) {
    console.log(dataEvent);
    try {
      const toast = await this.toastController.create({
        message: 'Traduciendo la conversación. Espera unos minutos por favor.',
        duration: 2000,
        position: 'top',
      });
      await toast.present();

      const originalCard = dataEvent.card as any;
      // remove id from originalCard
      delete originalCard.id;
      delete originalCard._id;

      const response: any = await this.conversationCardsService.translateConversation(dataEvent.currentLang, dataEvent.targetLang, dataEvent.id);
      const trasnlatedCard: IAgentCard = {
        ...originalCard,
        characterCard: { ...originalCard.characterCard, data: response },
        lang: dataEvent.targetLang,
      };
      await this.conversationCardsService.saveAgentCard(trasnlatedCard);

      const successToast = await this.toastController.create({
        message: 'Conversación traducida correctamente. Revisa para confirmar, vuelvelo a intentar si no es correcto.',
        duration: 2000,
        position: 'top',
      });
      await successToast.present();
    } catch (error) {
      console.log(error);
      const errorToast = await this.toastController.create({
        message: 'Error al traducir la conversación.',
        duration: 2000,
        position: 'top',
      });
      await errorToast.present();
    }
  }
}
