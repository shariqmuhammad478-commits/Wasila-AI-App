/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1220',
          900: '#0F1729',
          800: '#16213E',
          700: '#1E2B4D',
          600: '#2A3A63',
        },
        gold: {
          400: '#E3C67A',
          500: '#C9A961',
          600: '#B08D3F',
        },
        parchment: '#F5F3ED',
        slate: {
          400: '#8B93A7',
          500: '#6B7386',
        },
        seal: '#4A7C59',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
