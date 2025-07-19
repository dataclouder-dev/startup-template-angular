import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-live2d',
  template: ` <ion-router-outlet></ion-router-outlet> `,
  standalone: true,
  imports: [IonicModule],
})
export class Live2dComponent {}
