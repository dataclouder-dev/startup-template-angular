import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AudioTourService } from 'src/app/services/audio-tour.service';
import { SliderComponent } from '../../components/swipers/slider/slider.component';
import { SliderShinyCards } from '../../components/swipers/slider-shiny-cards/slider.component';
import { SliderCardsComponent } from '../../components/swipers/slider-cards/slider-cards';
import { SliderCardsFlipComponent } from 'src/app/components/swipers/slider-cards-flip/slider-cards-flip';
import { Slider5Component } from 'src/app/components/swipers/slider-book/slider-book';
import { SliderVerticalCardsComponent } from 'src/app/components/swipers/slider-vertical-cards/slider-vertical-cards';
import { SliderCreativeComponent } from 'src/app/components/swipers/slider-creative/slider-creative';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    GenericListComponent,
    DialogModule,
    ButtonModule,
    SliderComponent,
    SliderShinyCards,
    SliderCardsComponent,
    SliderCardsFlipComponent,
    Slider5Component,
    SliderVerticalCardsComponent,
    SliderCreativeComponent,
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent {
  private audioTourService = inject(AudioTourService);

  // Slide data using signal for reactivity
  readonly slides = signal([
    {
      id: 1,
      image: 'assets/images/default-feature-1.jpg',
      backImage: 'assets/images/default-feature-3.jpg',
      title: 'Feature One',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      isFlipped: false,
    },
    {
      id: 2,
      image: 'assets/images/default-feature-2.jpg',
      backImage: 'assets/images/default-feature-1.jpg',
      title: 'Feature Two',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
      isFlipped: false,
    },
    {
      id: 3,
      image: 'assets/images/default-feature-3.jpg',
      backImage: 'assets/images/default-feature-2.jpg',
      title: 'Feature Three',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      isFlipped: false,
    },
  ]);

  isDialogVisible: boolean = false;
}
