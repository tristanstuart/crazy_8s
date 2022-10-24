/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {
      '9xl': '10rem',
      '8xl': '3rem',
      '6xl': '2rem',
      '4xl': '1.5rem'
    },
    extend: {
      backgroundColor:{
        'black-t-50': 'rgba(0,0,0,0.5)'
      }
    },
  },
  plugins: [],
}
