/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C0392B',
          dark: '#a93226',
          light: '#e74c3c',
        },
        success: '#27ae60',
      },
      fontFamily: {
        serif: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
