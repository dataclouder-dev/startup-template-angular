import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { ConversationFormComponent } from '@dataclouder/conversation-system';

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
} from '@ionic/angular/standalone';

import { environment } from 'src/environments/environment';

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
    ConversationFormComponent,
  ],
  templateUrl: './conversation-form.page.html',
  styleUrl: './conversation-form.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationFormPage implements OnInit {
  public currentPath: string = ' ';

  public projectName = environment.projectName;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentPath = this.router.url.split('/')[3];
  }
}
