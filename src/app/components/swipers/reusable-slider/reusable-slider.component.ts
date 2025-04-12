import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input, // Import input signal function
  InputSignal, // Import InputSignal type if needed for explicit typing
  OnDestroy,
  Type,
  viewChild,
} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper/bundle';
import { SwiperOptions } from 'swiper/types';

const defaultOptions: SwiperOptions = {
  speed: 100,
  autoplay: { delay: 10, disableOnInteraction: true, pauseOnMouseEnter: true },
  direction: 'vertical',
  loop: true,
  effect: 'cards',
  cardsEffect: { perSlideOffset: 14, perSlideRotate: 9, slideShadows: false },
};

@Component({
  selector: 'app-reusable-slider',
  standalone: true,
  imports: [CommonModule], // CommonModule is needed for *ngComponentOutlet
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Needed if using swiper web components directly in template
  templateUrl: './reusable-slider.component.html',
  styleUrl: './reusable-slider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableSliderComponent implements OnDestroy {
  // Inputs signals
  items: InputSignal<any[]> = input<any[]>([]);
  slideComponentType: InputSignal<Type<any>> = input.required<Type<any>>(); // Use input.required if it must be provided
  swiperOptions: InputSignal<SwiperOptions> = input<SwiperOptions>({});
  // View child
  swiperContainer = viewChild.required<ElementRef<HTMLElement>>('swiperContainer'); // Use viewChild.required
  swiperInstance?: Swiper;

  constructor() {
    effect(
      () => {
        const items = this.items();
        const options = this.swiperOptions();

        // Access the signal's value using ()
        const containerElementRef = this.swiperContainer();
        const container = containerElementRef?.nativeElement;
        if (container && items.length > 0) {
          if (!this.swiperInstance || this.didOptionsChange(options)) {
            this.destroySwiper(); // Ensure previous instance is destroyed
            this.initializeSwiper(container, options);
          }
        } else if (this.swiperInstance) {
          // If items become empty or container disappears, destroy swiper
          this.destroySwiper();
        }
      },
      { allowSignalWrites: true }
    ); // Allow signal writes if needed inside effect (though not strictly needed here)
  }

  // Helper to track previous options for comparison (simple approach)
  private previousOptions: SwiperOptions | null = null;
  private didOptionsChange(newOptions: SwiperOptions): boolean {
    // Basic check: stringify and compare. Improve if complex options cause issues.
    const changed = JSON.stringify(newOptions) !== JSON.stringify(this.previousOptions);
    this.previousOptions = { ...newOptions }; // Store a copy for next comparison
    return changed;
  }

  public startDefaultSwiper(): void {
    setTimeout(() => {
      const inputOptions: SwiperOptions = this.swiperOptions();
      this.swiperInstance = new Swiper('.swiper', inputOptions || defaultOptions);
    }, 200);
  }

  ngOnDestroy(): void {
    this.destroySwiper();
  }

  // Modified initializeSwiper to accept container and options directly from effect
  private initializeSwiper(container: HTMLElement, options: SwiperOptions): void {
    // Use setTimeout to ensure dynamic components within slides are rendered before Swiper initializes

    this.startDefaultSwiper();
  }

  private destroySwiper(): void {
    this.swiperInstance?.destroy(true, true); // Destroy Swiper instance and remove listeners
    this.swiperInstance = undefined;
  }
}
