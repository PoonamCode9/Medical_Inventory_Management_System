/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          750: '#1e293b/80',
          850: '#1e293b/50'
        }
      }
    },
  },
  plugins: [],
}
