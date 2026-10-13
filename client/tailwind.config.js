/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F15A24',
          'orange-dark': '#D94814',
          'orange-light': '#FFF3ED',
          green: '#10B981',
          'green-dark': '#059669',
          'green-light': '#ECFDF5',
          grey: '#64748B',
          'grey-light': '#F8FAFC',
          'grey-border': '#E2E8F0',
          charcoal: '#1E293B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif']
      }
    },
  },
  plugins: [],
}
