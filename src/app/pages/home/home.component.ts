import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';

// import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

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
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  isDarkMode = false;

  constructor() {
    // register();

    console.log('hola');
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
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
