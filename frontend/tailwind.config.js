/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        web: {
          primary: '#3A4F41',
          accent: '#A45A2A',
          bgSoft: '#F8F4EC',
          textDark: '#2C2C2C',
          textMuted: '#7A7467',
          inputBorder: '#C5BAAF',
        }
      }
    },
  },
  plugins: [],
};
