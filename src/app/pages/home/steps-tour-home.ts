//  this is special step for my service over shepherd.js
export const stepsIntro: any[] = [
  {
    id: 'intro',
    attachTo: {
      element: '#home-tab',
      on: 'top' as const,
    },
    title: 'Welcome to the Test Page',
    text: [
      'This is a guided tour of the test page features.',
      '<div class="tour-image-container"><img src="assets/defaults/poli.webp" alt="Poli" style="max-width: 100%; height: auto;"></div>',
    ],
    audioPath: 'assets/audio/start.mp3',
  },
  {
    id: 'dialog-button',
    attachTo: {
      element: '#swiper-1',
      on: 'bottom' as const,
    },
    title: 'Show Dialog Button',
    text: [
      'Click this button to open a dialog with a generic list component.',
      '<div class="tour-image-container"><img src="assets/defaults/poliabajo.webp" alt="Yoga" style="max-width: 100%; height: auto;"></div>',
    ],
    audioPath: 'assets/audio/intro2.mp3',
  },
  {
    id: 'conclusion',
    title: 'Tour Complete',
    text: [
      'You have now seen all the main features of this page!',
      '<div class="tour-image-container"><img src="assets/defaults/poli1.webp" alt="Poli" style="max-width: 100%; height: auto;"></div>',
    ],
    audioPath: 'assets/audio/intro3.mp3',
  },
];
