import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import Swiper from 'swiper/bundle';

@Component({
  selector: 'slider-core',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider-core.html',
  styleUrl: './slider-core.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderCoreComponent implements AfterViewInit, OnDestroy {
  // Get reference to the swiper container element

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiper?: Swiper;
  isInitialized = signal(false);

  // Slide data using signal for reactivity
  readonly slides = signal([
    {
      id: 1,
      image: 'assets/defaults/images/default-feature-1.jpg',
      alt: 'Slide 1',
      title: 'Feature One',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      buttonText: 'Learn More',
    },
    {
      id: 2,
      image: 'assets/defaults/images/default-feature-2.jpg',
      alt: 'Slide 2',
      title: 'Feature Two',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
      buttonText: 'Learn More',
    },
    {
      id: 3,
      image: 'assets/defaults/images/default-feature-3.jpg',
      alt: 'Slide 3',
      title: 'Feature Three',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      buttonText: 'Learn More',
    },
  ]);

  ngAfterViewInit(): void {
    // some how first i need to garantee the cards are loaded
    setTimeout(() => {
      this.swiper = new Swiper('.swiper', {
        // Optional parameters
        speed: 100,
        autoplay: {
          delay: 10,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        },

        direction: 'vertical',
        loop: true,
        effect: 'cards',
        cardsEffect: {
          perSlideOffset: 14,
          perSlideRotate: 9,
          slideShadows: false,
        },
      });
      // this.swiper.init();
    }, 200);
    // this.swiper.slideNext();
  }

  ngOnDestroy(): void {
    // Destroy Swiper instance when component is destroyed
    // The boolean arguments indicate whether to destroy styles and remove event listeners
    this.swiper?.destroy(true, true);
  }
}
