/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'soft-white': '#FEEDDC',
        'blue': '#514EB5',
        'gray': '#7A7A7A',
      },
    },
  },
  plugins: [],
};
