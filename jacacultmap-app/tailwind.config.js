/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        jacacult: {
          green: '#457D58',
          deep: '#006032',
          emerald: '#10B981',
        },
      },
    },
  },
  plugins: [],
};
