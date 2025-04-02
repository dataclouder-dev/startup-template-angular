
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AudioTourService } from '../../services/audio-tour.service';
import { stepsIntro } from '../home/steps-tour-home';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [GenericListComponent, DialogModule, ButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit {
  private audioTourService = inject(AudioTourService);

  isDialogVisible: boolean = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    console.log('TestComponent');
    // this.setupTour();
  }

  // setupTour(): void {
  //   // Setup the tour with our steps
  // }

  startTour(): void {
    // Start the tour with intro audio
    this.audioTourService.setupTour(stepsIntro);
    this.audioTourService.startTour();
  }
}
