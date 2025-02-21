import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonTitle, IonButton, IonIcon, IonText, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/core/enums';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [IonImg, IonText, IonIcon, IonButton, IonTitle, IonButtons, IonToolbar, IonHeader, CommonModule, IonContent],
})
export class LandingComponent {
  projectName = environment.projectName;
  version = environment.version;
  envName = environment.envName;

  constructor(private router: Router) {}

  public goToSignup() {
    this.router.navigate([RouteNames.Auth + '/' + RouteNames.Signup]);
  }

  public goToSignin() {
    this.router.navigate([RouteNames.Auth + '/' + RouteNames.Signin]);
  }

  public goTo() {}
}
