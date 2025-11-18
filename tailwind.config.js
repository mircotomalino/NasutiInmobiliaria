/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',
        secondary: '#6B7280',
        accent: '#f0782c'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1F2937 0%, #f0782c 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f0782c 0%, #e65a1a 100%)'
      }
    },
  },
  plugins: [],
}

