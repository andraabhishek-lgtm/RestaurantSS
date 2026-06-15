/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        'dark-bg': '#0A0A0A',
        cream: '#F5F0E8',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        outfit: ['Outfit', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
