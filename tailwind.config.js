/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      black: '#1b0e02',
      blue: '#12296c',
      'blue-light': '#1a3a97',
      brown: '#b17a02',
      red: '#e65f59',
      'gray-secondary': '#6b6d6a',
      'gray-main': '#acb0ad',
      'yellow-main': '#fbda03',
      'yellow-secondary': '#fee569',
      white: '#fcfcfc'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    },
    extend: {}
  },
  plugins: []
}
