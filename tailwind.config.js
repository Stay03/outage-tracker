/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'outage-0': '#e6ffec', // No outage (light green)
        'outage-1': '#ffedd5', // Short outage (light orange)
        'outage-2': '#fed7aa', // Medium-short outage
        'outage-3': '#fb923c', // Medium outage
        'outage-4': '#ea580c', // Medium-long outage
        'outage-5': '#c2410c', // Long outage
        'outage-6': '#7c2d12', // Very long outage (dark red)
      }
    },
  },
  plugins: [],
}