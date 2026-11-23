import type { TourStep } from '@dataclouder/ngx-tour';

/**
 * Recorrido guiado de ejemplo para Home usando `@dataclouder/ngx-tour` (driver.js).
 * Ancla cada paso a un atributo `data-tour="<anchor>"` en la plantilla o déjalo sin ancla
 * para un paso introductorio centrado.
 */
export const stepsIntro: TourStep[] = [
  {
    title: 'Welcome to Startup Template',
    body: 'This is a guided tour powered by @dataclouder/ngx-tour (driver.js).',
  },
  {
    title: 'Tour Complete',
    body: 'Add data-tour attributes to your UI elements and declare steps here to guide new users.',
  },
];
