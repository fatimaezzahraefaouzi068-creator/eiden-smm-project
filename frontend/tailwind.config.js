/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'canvas': '#FEFDFB',
        'surface': '#FFFFFF',
        'beige': '#F4EBD0',
        'beige-dk': '#E8DCC8',
        'cream': '#F8F3E8',
        'forest': '#122620',
        'forest-md': '#2D4A44',
        'teal': '#0C5752',
        'teal-lt': '#0E7A73',
        'gold': '#CFC292',
        'gold-dk': '#B8A876',
        'mint': '#34D399',
        'red': '#C0392B',
        'blue': '#1A4A7A',
        'amber': '#9E6B0E',
        'purple': '#4A3470',
      },
      fontFamily: {
        'head': ['Outfit', 'sans-serif'],
        'edit': ['DM Serif Display', 'serif'],
        'label': ['Cormorant Garamond', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
