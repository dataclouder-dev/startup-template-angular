import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { GENERICS_ROUTES } from './generic.routes';

@Component({
  selector: 'app-generics',
  imports: [RouterModule],
  templateUrl: './generics.component.html',
  styleUrl: './generics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericsComponent {
  public static routes = GENERICS_ROUTES;
}
