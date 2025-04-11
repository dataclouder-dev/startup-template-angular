import { ChangeDetectionStrategy, Component, ElementRef, viewChild, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'slider-creative',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider-creative.html',
  styleUrl: './slider-creative.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderCreativeComponent {
  // View Child reference to the swiper element
  readonly swiperRef = viewChild<ElementRef>('swiper');

  swiper?: Swiper;

  readonly slides = signal([
    {
      id: 1,
      image: 'assets/images/default-feature-1.jpg',
      alt: 'Slide 1',
      title: 'Feature One',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      buttonText: 'Learn More',
    },
    {
      id: 2,
      image: 'assets/images/default-feature-2.jpg',
      alt: 'Slide 2',
      title: 'Feature Two',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
      buttonText: 'Learn More',
    },
    {
      id: 3,
      image: 'assets/images/default-feature-3.jpg',
      alt: 'Slide 3',
      title: 'Feature Three',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      buttonText: 'Learn More',
    },

    {
      id: 4,
      image: 'assets/images/default-feature-4.jpg',
      alt: 'Slide 3',
      title: 'Feature Three',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      buttonText: 'Learn More',
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
          loop: true,
          pagination: true,
          slidesPerView: '3',
          centeredSlides: true,

          effect: 'creative',

          creativeEffect: {
            prev: {
              shadow: false,
              translate: ['-25%', 10, -100],
              rotate: [0, 0, -20],
            },
            next: {
              shadow: false,
              translate: ['20%', -10, -100],
              rotate: [0, 0, 22],
            },
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
