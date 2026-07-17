/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef1fd',
          100: '#dbe1fb',
          200: '#b7c3f7',
          300: '#8fa2f2',
          400: '#6a83ed',
          500: '#4b64e5',
          600: '#3a4fcb',
          700: '#2f3fa3',
          800: '#28347f',
          900: '#232c63',
        },
        surface: {
          light: '#f6f7fb',
          dark: '#0f1220',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.08)',
      },
    },
  },
  plugins: [],
}
