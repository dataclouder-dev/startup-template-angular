//mypreset.ts
import { definePreset } from '@primeng/themes';
// import Aura from '@primeng/themes/aura';

import Nora from '@primeng/themes/nora';

const MyPreset = definePreset(Nora, {
  semantic: {
    primary: {
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}',
    },
  },
});

export default MyPreset;
