import { ChangeDetectionStrategy, Component, ElementRef, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-slider',
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
