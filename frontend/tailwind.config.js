/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Ensure that your file extensions are included
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {},
      fontFamily: {
        dancing: ['Dancing Script', 'cursive', 'sans-serif'],
        damion: ['Damion', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
