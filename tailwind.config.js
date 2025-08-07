// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ... vos extensions de thème existantes
    },
  },
  plugins: [
    require('tailwind-scrollbar'), // ✨ Ajoutez cette ligne ✨
  ],
};