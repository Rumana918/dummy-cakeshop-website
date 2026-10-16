/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDFB',
          100: '#FFF9F3', // Primary background
          200: '#FDF2E7',
          300: '#F8ECE0',
          400: '#F0DFD0',
        },
        blush: {
          50: '#FFF5F7',
          100: '#FDE8EC', // Secondary background
          200: '#FCD1D9',
          300: '#F9B8C5',
          400: '#F69FB0',
          500: '#F4A7B9', // Primary accent
        },
        rose: {
          DEFAULT: '#F4A7B9',
          tint: '#FFD9E0',
          dark: '#894C5C',
          deep: '#8A5A64', // Headings
        },
        butter: {
          50: '#FFFAED',
          100: '#FFF4D4',
          200: '#FFE9A8', // Butter yellow accent
          300: '#F7DC8B',
        },
        mint: {
          50: '#F4FAF6',
          100: '#DFF3E8', // Mint cream accent
          200: '#C5EBD6',
        },
        warm: {
          text: '#6B5B5B', // Primary text
          muted: '#8E7D7D',
          dark: '#4A3E3E',
          heading: '#8A5A64',
          border: '#EADFD7',
          card: '#FFFFFF',
        },
        // Stitch system aliases
        surface: '#FFF9F3',
        'surface-container-low': '#FDE8EC',
        'surface-container-high': '#F5EBE1',
        'surface-container-lowest': '#FFFFFF',
        primary: '#894C5C',
        'primary-container': '#F4A7B9',
        'on-primary': '#FFFFFF',
        'on-primary-container': '#733949',
        'on-surface': '#6B5B5B',
        'on-surface-variant': '#8E7D7D',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Newsreader', 'Georgia', 'serif'],
        sans: ['Poppins', '"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Playfair Display"', 'Newsreader', 'serif'],
        body: ['Poppins', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(138, 90, 100, 0.07)',
        'soft-lg': '0 10px 30px -4px rgba(138, 90, 100, 0.12)',
        'rose': '0 8px 25px -4px rgba(244, 167, 185, 0.35)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
