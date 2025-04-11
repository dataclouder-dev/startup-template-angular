import { ChangeDetectionStrategy, Component, ElementRef, viewChild, effect, signal, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-slider-cards-flip',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider-cards-flip.html',
  styleUrl: './slider-cards-flip.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderCardsFlipComponent {
  // View Child reference to the swiper element
  readonly swiperRef = viewChild<ElementRef>('swiper');

  // Swiper instance
  swiper?: Swiper;

  // Input slides data with default values
  slides = input<Array<{
    id: number;
    image: string;
    backImage: string;
    title: string;
    description: string;
    isFlipped: boolean;
  }>>([]);

  // Event emitter for slide change
  @Output() slideChanged = new EventEmitter<number>();

  // Internal signal to track flipped state
  private readonly flippedState = signal<Record<number, boolean>>({});

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
          pagination: true,
          slidesPerView: 'auto',
          centeredSlides: true,
          cardsEffect: {
            slideShadows: false,
            rotate: true,
            perSlideOffset: 1, // Increase spacing between cards (default is 8)
            perSlideRotate: 12, // Increase rotation angle (default is 2)
          },
        });
      }
    });
  }

  // Method to handle slide change events
  onSlideChange(event: any) {
    const activeIndex = event.target.swiper.activeIndex;
    console.log('Slide changed:', activeIndex);
    this.slideChanged.emit(activeIndex);
  }

  // Method to flip a card
  flipCard(slideId: number) {
    this.flippedState.update(state => {
      return { ...state, [slideId]: !state[slideId] };
    });
  }
  
  // Helper method to check if a slide is flipped
  isFlipped(slideId: number): boolean {
    return !!this.flippedState()[slideId];
  }
}
