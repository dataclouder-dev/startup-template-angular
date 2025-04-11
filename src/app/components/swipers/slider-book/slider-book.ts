import { ChangeDetectionStrategy, Component, ElementRef, viewChild, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'slider-book',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider-book.html',
  styleUrl: './slider-book.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Slider5Component {
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
          // slidesPerView: '2',
          // centeredSlides: true,

          effect: 'creative',

          creativeEffect: {
            prev: {
              shadow: false,
              translate: [0, 0, -100],
              opacity: 1,
            },
            next: {
              shadow: false,
              translate: ['98%', 0, 0],
              rotate: [0, 360, 0],
              origin: 'center',
              opacity: 1,
              scale: 1,
            },
          },

          // effect: 'coverflow',
          // coverflowEffect: {
          //   scale: 0.8,
          //   depth: 10,
          //   rotate: 170,
          //   modifier: 1,
          //   stretch: 0,
          //   slideShadows: false,
          // },
        });
      }
    });
  }

  // Method to handle slide change events
  onSlideChange(event: any) {
    console.log('Slide changed:', event.target.swiper.activeIndex);
  }
}
