import { Component, inject } from '@angular/core';

import { IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, IonButton, IonIcon, IonText, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/core/enums';
import { APP_CONFIG } from '@dataclouder/ngx-core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [IonImg, IonText, IonIcon, IonButton, IonTitle, IonButtons, IonToolbar, IonHeader, IonContent],
})
export class LandingComponent {
  private router = inject(Router);
  private config = inject(APP_CONFIG);

  projectName = this.config.projectName;
  version = this.config.version;
  envName = this.config.envName;

  features = [
    {
      title: 'Character-Driven Architectures',
      description: 'AI agents that respond with unique personalities, following Character Card Specs and Google Agent Card Protocols.',
      icon: 'people-outline'
    },
    {
      title: 'Goal-Oriented Design',
      description: 'Conversations designed to achieve specific learning outcomes, from language mastery to high-stakes conflict resolution.',
      icon: 'flag-outline'
    },
    {
      title: 'Real-Time Feedback',
      description: 'Immediate coaching and sentiment analysis during simulated interactions to accelerate skill acquisition.',
      icon: 'analytics-outline'
    }
  ];

  useCases = [
    {
      title: 'Navigate Hard Conversations',
      description: 'Practice grief counseling, conflict management, and tough workplace topics in a safe environment.',
      icon: 'heart-outline'
    },
    {
      title: 'Language Coaching',
      description: 'Immersion with real-time feedback on grammar, pronunciation, and cultural nuances.',
      icon: 'language-outline'
    },
    {
      title: 'Storytelling & Prep',
      description: 'TED talk preparation and public speaking strategy through persona-driven feedback.',
      icon: 'mic-outline'
    }
  ];

  constructor() {}

  public goToSignup() {
    this.router.navigate([RouteNames.Auth + '/' + RouteNames.Signup]);
  }

  public goToSignin() {
    this.router.navigate([RouteNames.Auth + '/' + RouteNames.Signin]);
  }

  public openUrl(url: string) {
    window.open(url, '_blank');
  }
}
