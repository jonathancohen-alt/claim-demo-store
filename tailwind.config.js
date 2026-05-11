/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      colors: {
        // ORIVA brand palette
        cream: {
          50:  '#FBF5EC',
          100: '#F5EBDD',  // primary background
          200: '#EADBC4',
          300: '#DCC9AA',
        },
        ink: {
          900: '#0E1410',  // primary text
          800: '#1A2520',
          700: '#3A4742',
        },
        forest: {
          900: '#142F25',
          800: '#1F4F3D',  // footer / dark accent
          700: '#2D6E55',
          500: '#4F9477',
        },
        periwinkle: {
          400: '#9AAAE0',
          500: '#7B8DD4',  // hero block
          600: '#5C6FBE',
        },
        // Product accents
        sunset: '#D9532D',     // vitamin C orange
        rose:   '#E8568C',     // hydrating serum pink
        peach:  '#E8A98C',     // repair cream peach
        sage:   '#A8C4B0',     // hydrating gel green
        sky:    '#5A7DBF',     // cleanser blue background
        retailer: {
          walmart: '#0071CE',
          target: '#CC0000',
          amazon: '#FF9900',
          bestbuy: '#0046BE',
          sephora: '#000000',
          chewy: '#E21937',
        },
        // Legacy aliases (keep app from breaking)
        brand: {
          orange: '#D9532D',
          navy: '#1F4F3D',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(14,20,16,0.04), 0 8px 24px rgba(14,20,16,0.06)',
        lift: '0 12px 40px rgba(14,20,16,0.10)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
