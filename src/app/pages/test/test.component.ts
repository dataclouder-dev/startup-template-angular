import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AudioTourService } from 'src/app/services/audio-tour.service';

import { ExampleSlideComponent } from 'src/app/components/example-slide/example-slide.component'; // Import the example slide component

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [GenericListComponent, DialogModule, ButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent {
  // Renamed: Component type for the reusable slider
  exampleSlideComponentType = ExampleSlideComponent;

  isDialogVisible: boolean = false;
}
