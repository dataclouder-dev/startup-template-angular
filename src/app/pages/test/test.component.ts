import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AudioTourService } from '../../services/audio-tour.service';
import { stepsIntro } from '../home/steps-tour-home';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, GenericListComponent, DialogModule, ButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit {
  isDialogVisible: boolean = false;

  constructor(private audioTourService: AudioTourService) {}

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
