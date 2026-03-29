/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#1a1108',
          light: '#3d2e1a',
          muted: '#7a6a55',
        },
        paper: {
          DEFAULT: '#f5f0e8',
          dark: '#ede6d5',
          cream: '#faf7f2',
        },
        saffron: {
          DEFAULT: '#e8630a',
          light: '#f7882e',
          dark: '#c04d00',
        },
        vermillion: '#c0392b',
        teal: {
          DEFAULT: '#0d7377',
          light: '#14a085',
        },
      },
      backgroundImage: {
        'newsprint': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23f5f0e8'/%3E%3Ccircle cx='1' cy='1' r='0.4' fill='%23e8e0cc' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'ticker': 'ticker 30s linear infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
