import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-admin',
  template: `
    <p-tabs value="0" style="width: 100%">
      <p-tablist>
        <p-tab value="1" routerLink="users">Usuarios</p-tab>
        <p-tab value="2" routerLink="codes">Codigos</p-tab>
        <p-tab value="3" routerLink="pricing">Pricing</p-tab>
      </p-tablist>
      <p-tabpanels style="padding: 10px">
        <router-outlet></router-outlet>
      </p-tabpanels>
    </p-tabs>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 30px;
      }
      p-tabpanels {
        padding: 10px;
      }
    `,
  ],
  standalone: true,
  imports: [IonicModule, TabsModule, RouterModule],
})
export class AdminComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('AdminComponent ngOnInit');
  }
}
