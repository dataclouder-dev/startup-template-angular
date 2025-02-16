import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-generic-detail',
  imports: [],
  template: `<p>generic-detail works!</p>`,
  styleUrl: './generic-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericDetailComponent {}
