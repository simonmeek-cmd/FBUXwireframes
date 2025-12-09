/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wire: {
          50: '#f8fafc',   // Very light blue-grey
          100: '#f1f5f9',  // Light blue-grey background
          200: '#e2e8f0',  // Soft blue border
          300: '#cbd5e1',  // Medium blue-grey
          400: '#94a3b8',  // Muted blue
          500: '#64748b',  // Slate blue
          600: '#475569',  // Dark slate blue
          700: '#334155',  // Darker blue
          800: '#1e293b',  // Very dark blue
          900: '#0f172a',  // Near black blue
        }
      }
    },
  },
  plugins: [],
}
