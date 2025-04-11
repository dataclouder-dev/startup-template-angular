import { ChangeDetectionStrategy, Component, ElementRef, viewChild, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';

// // register(); was done in main component, Register Swiper custom elements

@Component({
  selector: 'app-slider-seleted',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent {
  // View Child reference to the swiper element
  readonly swiperRef = viewChild<ElementRef>('swiper');

  // Swiper instance
  swiper?: Swiper;

  // Slide data using signal for reactivity
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
  ]);

  constructor() {
    // Set up effect to initialize swiper when the element is available
    effect(() => {
      const swiperElement = this.swiperRef()?.nativeElement;
      if (swiperElement) {
        console.log('Swiper reference is now available:', swiperElement);
      }
    });
  }

  // Method to handle slide change events
  onSlideChange(event: any) {
    console.log('Slide changed:', event.target.swiper.activeIndex);
  }
}
