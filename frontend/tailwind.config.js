/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        music: {
          dark: '#121212',
          card: '#1e1e1e',
          accent: '#bb86fc',
          accentHover: '#9965f4',
          text: '#ffffff',
          textMuted: '#b3b3b3'
        }
      }
    },
  },
  plugins: [],
}
