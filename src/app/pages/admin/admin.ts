import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  template: `<ion-router-outlet></ion-router-outlet>`,
  styles: [],
  standalone: true,
  imports: [IonicModule],
})
export class AdminComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('AdminComponent ngOnInit');
    debugger;
  }
}
