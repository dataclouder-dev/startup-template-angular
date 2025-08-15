import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ApiBalancers',
  imports: [RouterModule],
  templateUrl: './api-balancers.component.html',
  styleUrl: './api-balancers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiBalancersComponent {}
