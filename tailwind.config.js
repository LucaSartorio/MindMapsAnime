/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette generica per l'atlante digitale
        ink: {
          950: '#070709',
          900: '#0c0d11',
          800: '#13151b',
          700: '#1c1f28',
          600: '#262a36',
          500: '#3a3f4f',
          400: '#5b6275',
          300: '#8a90a3',
          200: '#b6bbcb',
          100: '#e4e7f0',
        },
        chakra: {
          50: '#e6f5ff',
          100: '#bfe3ff',
          200: '#86cdff',
          300: '#4cb6ff',
          400: '#1f9aff',
          500: '#0a7fe6',
          600: '#0664b4',
          700: '#054b86',
          800: '#053962',
          900: '#062a47',
        },
        ember: {
          50: '#fff4ea',
          100: '#ffe1c5',
          200: '#ffc282',
          300: '#ff9f3f',
          400: '#ff8311',
          500: '#f06600',
          600: '#c54e00',
          700: '#963c03',
          800: '#6e2d07',
          900: '#4a1f06',
        },
        sharingan: {
          500: '#e10b0b',
          600: '#b00808',
          700: '#7d0606',
        },
        scroll: {
          100: '#f5ecd1',
          200: '#e8d8a3',
          300: '#d4be78',
          400: '#b89c52',
        },
      },
      fontFamily: {
        display: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(31,154,255,0.35)',
        ember: '0 0 32px rgba(240,102,0,0.35)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      animation: {
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%,100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(-4%,2%,0)' },
        },
      },
    },
  },
  plugins: [],
};
