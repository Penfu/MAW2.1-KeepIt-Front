/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        navbar: 'var(--h-navbar)',
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [],
};
