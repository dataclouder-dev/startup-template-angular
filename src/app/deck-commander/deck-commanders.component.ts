import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-DeckCommanders',
  imports: [RouterModule],
  templateUrl: './deck-commanders.component.html',
  styleUrl: './deck-commanders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckCommandersComponent {}
