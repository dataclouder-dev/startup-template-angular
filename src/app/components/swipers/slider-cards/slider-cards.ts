import { ChangeDetectionStrategy, Component, ElementRef, viewChild, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-slider-cards',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider-cards.html',
  styleUrl: './slider-cards.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderCardsComponent {
  // View Child reference to the swiper element
  readonly swiperRef = viewChild<ElementRef>('swiper');

  // Swiper instance
  swiper?: Swiper;

  // Swiper configuration options will be applied directly in ngAfterViewInit

  // Slide data using signal for reactivity
  readonly slides = signal([
    {
      id: 1,
      image: 'assets/defaults/images/default-feature-1.jpg',
      title: 'Feature One',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    },
    {
      id: 2,
      image: 'assets/defaults/images/default-feature-2.jpg',
      title: 'Feature Two',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
    },
    {
      id: 3,
      image: 'assets/defaults/images/default-feature-3.jpg',
      title: 'Feature Three',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
  ]);

  constructor() {
    // Set up effect to initialize swiper when the element is available
    effect(() => {
      const swiperElement = this.swiperRef()?.nativeElement;
      if (swiperElement) {
        console.log('Swiper reference is now available:', swiperElement);

        // Configure Swiper parameters directly using Object.assign
        Object.assign(swiperElement, {
          effect: 'cards',
          loop: true,
          pagination: false,
          slidesPerView: 'auto',
          centeredSlides: true,
          cardsEffect: {
            slideShadows: false,
          },
        });
      }
    });
  }

  // Method to handle slide change events
  onSlideChange(event: any) {
    console.log('Slide changed:', event.target.swiper.activeIndex);
  }
}
