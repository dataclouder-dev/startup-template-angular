import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AudioTourService } from 'src/app/services/audio-tour.service';
import { SliderComponent } from '../../components/slider/slider.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    GenericListComponent, 
    DialogModule, 
    ButtonModule,
    SliderComponent
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent {
  private audioTourService = inject(AudioTourService);

  isDialogVisible: boolean = false;
}
