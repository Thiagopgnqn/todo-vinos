/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tokens de marca y superficie
        brand: {
          DEFAULT: '#111111',
          hover: '#262626',
          light: '#F4F4F5',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#FAFAFA',
          muted: '#F4F4F5',
        },
        border: {
          DEFAULT: '#E4E4E7',
          subtle: '#F4F4F5',
        },
        text: {
          main: '#111111',
          muted: '#52525B',
          subtle: '#71717A',
          faint: '#A1A1AA',
        },
        // Compatibilidad con componentes existentes mapeados a neutros sobrios
        wine: {
          DEFAULT: '#111111',
          dark: '#000000',
          light: '#27272A',
        },
        gold: {
          DEFAULT: '#52525B',
          dark: '#3F3F46',
          light: '#A1A1AA',
        },
        cream: {
          DEFAULT: '#FFFFFF',
          dark: '#FAFAFA',
        },
        parchment: '#E4E4E7',
        charcoal: {
          DEFAULT: '#18181B',
          light: '#52525B',
        },
        slate: '#71717A',
        mist: '#A1A1AA',
        night: '#111111',
        status: {
          success: '#15803D',
          'success-bg': '#F0FDF4',
          warning: '#B45309',
          'warning-bg': '#FFFBEB',
          error: '#B91C1C',
          'error-bg': '#FEF2F2',
        },
      },
      fontFamily: {
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        playfair: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'], // Unificación tipográfica sobria
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'lifted': '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        'overlay': '0 12px 30px -10px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '6px',
        'lg': '8px',
        'xl': '10px',
        '2xl': '12px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
