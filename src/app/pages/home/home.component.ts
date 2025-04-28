import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild, effect, signal, OnInit } from '@angular/core'; // Import effect

import { InputTextModule } from 'primeng/inputtext';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AudioTourService } from 'src/app/services/audio-tour.service';
import { stepsIntro } from './steps-tour-home';
import { LessonsService } from 'src/app/pages/lessons/lessons.service';
import { AgentCardService } from 'src/app/services/agent-card-service';
import { IAgentCard, DCConversationCardUIComponent } from '@dataclouder/ngx-agent-cards';
import { ILesson } from '@dataclouder/ngx-lessons';
import { DcLessonCardComponent } from '@dataclouder/ngx-lessons';

// Define card interface for type safety
interface CardItem {
  imageUrl: string;
  title: string;
  subtitle: string;
  content: string;
}

register();
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, CardModule, DcLessonCardComponent, DCConversationCardUIComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  // Services
  private audioTourService = inject(AudioTourService);
  private lessonsService = inject(LessonsService);
  private agentCardService = inject(AgentCardService);

  // Input States
  agentCards = signal<IAgentCard[]>([]);
  lessons = signal<ILesson[]>([]);

  // View Child
  readonly swiperRef = viewChild<ElementRef>('mainSwiper');

  // States
  isDarkMode = false;
  swiper?: Swiper; // You might not need this property if you access via swiperRef().nativeElement.swiper

  // Card data using signal for reactivity
  cards = signal<CardItem[]>([
    {
      imageUrl: 'assets/images/default-feature-1.jpg',
      title: 'Advanced Card',
      subtitle: 'Card subtitle',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
    },
    {
      imageUrl: 'assets/images/default-feature-2.jpg',
      title: 'Advanced Card',
      subtitle: 'Card subtitle',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
    },
    {
      imageUrl: 'assets/images/default-feature-3.jpg',
      title: 'Advanced Card',
      subtitle: 'Card subtitle',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
    },
  ]);

  constructor() {
    // Add an effect to react when swiperRef is available
    effect(() => {
      const swiperElement = this.swiperRef()?.nativeElement;
      if (swiperElement) {
        console.log('Swiper reference is now available:', swiperElement);
      } else {
        console.log('Swiper reference not available yet.');
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const agents = await this.agentCardService.findAgentCards({});
    this.agentCards.set(agents.rows);
    const lessons = await this.lessonsService.getLessons({});

    this.lessons.set(lessons.rows);
  }

  public startTour(): void {
    this.audioTourService.setupTour(stepsIntro);
    this.audioTourService.startTour();
  }

  swiperSlideChanged(e: any) {
    const index = e.target.swiper.activeIndex;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark');
  }

  public goToLesson(lesson: any) {
    console.log('goToLesson', lesson);
  }
}
