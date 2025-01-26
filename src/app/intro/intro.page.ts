import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonToolbar, IonFooter, IonButton, IonText, IonicSlides } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { RouteNames } from '../core/enums';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonText, IonButton, IonFooter, IonContent, IonToolbar, CommonModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IntroPage implements OnInit {
  public routeNames = RouteNames;
  swiperModules = [IonicSlides];

  constructor() {}

  ngOnInit() {}
}
