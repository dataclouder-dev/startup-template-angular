import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';


import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class ExplorePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
