import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
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
import { filter } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stack-ionic',
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
  ],
  templateUrl: './stack-ionic.component.html',
  styleUrl: './stack-ionic.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackIonicComponent implements OnInit {
  public currentPath: string = ' ';

  public projectName = environment.projectName;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentPath = this.router.url.split('/')[3];
  }
}
