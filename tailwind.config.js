/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        forest: {
          800: '#0f2419',
          900: '#0b1510',
          950: '#060d09',
        },
        surface: {
          light: '#ffffff',
          dark: '#122119',
          darker: '#0e1b14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'eco-glow': '0 0 25px rgba(16, 185, 129, 0.35)',
        'eco-card': '0 10px 30px -5px rgba(16, 68, 41, 0.08)',
      }
    },
  },
  plugins: [],
}
