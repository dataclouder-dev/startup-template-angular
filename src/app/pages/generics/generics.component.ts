import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-generics',
  imports: [RouterModule],
  templateUrl: './generics.component.html',
  styleUrl: './generics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericsComponent {}
