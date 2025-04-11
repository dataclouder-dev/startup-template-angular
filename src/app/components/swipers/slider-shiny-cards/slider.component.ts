import { ChangeDetectionStrategy, Component, ElementRef, viewChild, effect, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

interface Pokemon {
  id: number;
  name: string;
  number: string; // e.g., '#0001'
  imageUrl: string;
  types: { name: string; class: string }[];
  gradient: string; // e.g., 'linear-gradient(...)'
}

@Component({
  selector: 'app-slider-shiny-cards',
  standalone: true,
  imports: [CommonModule, NgClass], // Added NgClass for type badges
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Keep CUSTOM_ELEMENTS_SCHEMA for swiper-container/swiper-slide
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderShinyCards {
  readonly swiperShinyCardsRef = viewChild<ElementRef>('swiperShinyCards');

  readonly slides = signal<Pokemon[]>([
    // Data based on the example HTML
    {
      id: 1,
      name: 'Bulbasaur',
      number: '#0001',
      imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/001.png',
      types: [
        { name: 'Grass', class: 'type-grass' },
        { name: 'Poison', class: 'type-poison' },
      ],
      gradient: 'linear-gradient(145deg, #78c850 0%, #5ca935 100%)',
    },
    {
      id: 2,
      name: 'Ivysaur',
      number: '#0002',
      imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/002.png',
      types: [
        { name: 'Grass', class: 'type-grass' },
        { name: 'Poison', class: 'type-poison' },
      ],
      gradient: 'linear-gradient(145deg, #78c850 0%, #5ca935 100%)',
    },
    {
      id: 3,
      name: 'Venusaur',
      number: '#0003',
      imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/003.png',
      types: [
        { name: 'Grass', class: 'type-grass' },
        { name: 'Poison', class: 'type-poison' },
      ],
      gradient: 'linear-gradient(145deg, #78c850 0%, #5ca935 100%)',
    },
    {
      id: 4,
      name: 'Charmander',
      number: '#0004',
      imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/004.png',
      types: [{ name: 'Fire', class: 'type-fire' }],
      gradient: 'linear-gradient(145deg, #f08030 0%, #dd6610 100%)',
    },
    {
      id: 5,
      name: 'Charmeleon',
      number: '#0005',
      imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/005.png',
      types: [{ name: 'Fire', class: 'type-fire' }],
      gradient: 'linear-gradient(145deg, #f08030 0%, #dd6610 100%)',
    },
    {
      id: 6,
      name: 'Charizard',
      number: '#0006',
      imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/006.png',
      types: [
        { name: 'Fire', class: 'type-fire' },
        { name: 'Flying', class: 'type-flying' },
      ],
      gradient: 'linear-gradient(145deg, #f08030 0%, #dd6610 100%)',
    },
    {
      id: 7,
      name: 'Squirtle',
      number: '#0007',
      imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/007.png',
      types: [{ name: 'Water', class: 'type-water' }],
      gradient: 'linear-gradient(145deg, #6890f0 0%, #4c6fcc 100%)',
    },
    {
      id: 8,
      name: 'Wartortle',
      number: '#0008',
      imageUrl: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/008.png',
      types: [{ name: 'Water', class: 'type-water' }],
      gradient: 'linear-gradient(145deg, #6890f0 0%, #4c6fcc 100%)',
    },
    // Add more Pokemon as needed
  ]);

  // Method to handle slide change events (optional)
  onSlideChange(event: any) {
    // Access swiper instance via event.target.swiper
    const swiperInstance = event.target.swiper;
    if (swiperInstance) {
      console.log('Slide changed:', swiperInstance.activeIndex);
    }
  }
}
