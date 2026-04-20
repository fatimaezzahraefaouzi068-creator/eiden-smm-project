/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest': '#122620',
        'teal': '#0C5752',
        'teal-lt': '#0E7A73',
        'gold': '#CFC292',
        'gold-dk': '#B8A876',
        'beige': '#F4EBD0',
        'canvas': '#FEFDFB',
        'red': '#C0392B',
      },
      fontFamily: {
        'head': ['Outfit', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'label': ['Cormorant Garamond', 'serif'],
      }
    },
  },
  plugins: [],
}
