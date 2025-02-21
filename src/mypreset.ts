//mypreset.ts
import { definePreset } from '@primeng/themes';
// import Aura from '@primeng/themes/aura';

import Nora from '@primeng/themes/nora';

const MyPreset = definePreset(Nora, {
  semantic: {
    primary: {
      50: '#f5f3f7',
      100: '#cdc5d9',
      200: '#a597bb',
      300: '#7d689e',
      400: '#553a80',
      500: '#2d0c62',
      600: '#260a53',
      700: '#1f0845',
      800: '#190736',
      900: '#120527',
      950: '#0b0319',
    },
  },
});

export default MyPreset;
