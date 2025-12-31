/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      colors: {
        'wc-blue': '#1e40af',
        'wc-green': '#10b981',
        'wc-red': '#ef4444',
        'wc-yellow': '#f59e0b',
      },
    },
  },
  plugins: [],
}