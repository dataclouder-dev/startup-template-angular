import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { LIVE2DS_ROUTES } from './live2d.routes';

@Component({
  selector: 'app-live2ds',
  imports: [RouterModule],
  templateUrl: './live2ds.component.html',
  styleUrl: './live2ds.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Live2dsComponent {
  public static routes = LIVE2DS_ROUTES;
}
