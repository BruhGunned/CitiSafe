/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        primary: '#0f172a',
        secondary: '#64748b',
        risk: {
          low: '#22c55e',
          medium: '#facc15',
          high: '#ef4444'
        }
      },
      boxShadow: {
        'card': '0 2px 10px -4px rgba(15,23,42,0.1)',
      }
    },
  },
  plugins: [],
}
