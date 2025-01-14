import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular/standalone';

import { DCConversationFormComponent, IConversationCard } from '@dataclouder/conversation-system';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonListHeader,
  IonItem,
  IonAvatar,
  IonLabel,
  IonNote,
  IonFab,
  IonFabButton,
  IonTabButton,
  IonTabBar,
  IonFooter,
  IonApp,
  AlertController,
} from '@ionic/angular/standalone';

import { environment } from 'src/environments/environment';
import { RouteNames } from 'src/app/core/enums';
import { ConversationAIService } from 'src/app/services/chat-ai-service';

@Component({
  selector: 'app-conversation-form',
  standalone: true,
  imports: [
    IonApp,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonFabButton,
    IonFab,
    IonNote,
    IonLabel,
    IonAvatar,
    IonItem,
    IonListHeader,
    IonList,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonCard,
    IonRefresherContent,
    IonRefresher,
    IonContent,
    IonIcon,
    IonButton,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    CommonModule,
    RouterOutlet,
    DCConversationFormComponent,
  ],
  templateUrl: './conversation-form.page.html',
  styleUrl: './conversation-form.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationFormPage implements OnInit {
  public currentPath: string = ' ';

  public projectName = environment.projectName;

  constructor(
    private conversationAIService: ConversationAIService,
    private route: ActivatedRoute,
    private router: Router,
    private AlertController: AlertController,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

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

  public async onTranslate(dataEvent: { card: IConversationCard; currentLang: string; targetLang: string; id: string }) {
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

      const response: any = await this.conversationAIService.translateConversation(dataEvent.currentLang, dataEvent.targetLang, dataEvent.id);
      const trasnlatedCard: IConversationCard = {
        ...originalCard,
        characterCard: { ...originalCard.characterCard, data: response },
        lang: dataEvent.targetLang,
      };
      await this.conversationAIService.saveConversationCard(trasnlatedCard);

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
