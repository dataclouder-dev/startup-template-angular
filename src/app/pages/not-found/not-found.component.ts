import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class NotFoundComponent {
  constructor() { }
}
