import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';

// import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AudioTourService } from 'src/app/services/audio-tour.service';
import { stepsIntro } from './steps-tour-home';

register();
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent {
  private audioTourService = inject(AudioTourService);

  readonly swiperRef = viewChild<ElementRef>('swiper');
  swiper?: Swiper;
  isDarkMode = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    // register();

    console.log('hola');
  }

  public startTour(): void {
    this.audioTourService.setupTour(stepsIntro);
    this.audioTourService.startTour();
  }

  swiperReady() {
    this.swiper = this.swiperRef()?.nativeElement.swiper;
  }

  swiperSlideChanged(e: any) {
    const index = e.target.swiper.activeIndex;
    // this.selectedSegment = this.segmentList[index]
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark');
  }
}
