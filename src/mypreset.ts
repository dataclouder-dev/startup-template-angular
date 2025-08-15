// import { definePreset } from '@primeng/themes';
// import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeuix/themes';

import Nora from '@primeng/themes/nora';

import Aura from '@primeuix/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      dark: {
        primary: {
          50: '#89FBD1',
          100: '#75FAC9',
          200: '#62F9C2',
          300: '#4EF9BA',
          400: '#74FAC9',
          500: '#62F9C2',
          600: '#4EF9BA',
          700: '#26F7AB',
          800: '#13F6A3',
          900: '#09EC99',
          950: '#08D98C',
        },

        card: {
          root: {
            background: '#0b0319',
            color: '{content.color}',
            shadow: '0 1px 4px 0 rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
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
