//mypreset.ts
import { definePreset } from '@primeng/themes';
// import Aura from '@primeng/themes/aura';

import Lara from '@primeng/themes/lara';

const MyPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{rose.50}',
      100: '{rose.100}',
      200: '{rose.200}',
      300: '{rose.300}',
      400: '{rose.400}',
      500: '{rose.500}',
      600: '{rose.600}',
      700: '{rose.700}',
      800: '{rose.800}',
      900: '{rose.900}',
      950: '{rose.950}',
    },
  },
});

export default MyPreset;
