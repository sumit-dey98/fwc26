/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: 'rgb(var(--c-navy-950) / <alpha-value>)',
          900: 'rgb(var(--c-navy-900) / <alpha-value>)',
          800: 'rgb(var(--c-navy-800) / <alpha-value>)',
          700: 'rgb(var(--c-navy-700) / <alpha-value>)',
          600: 'rgb(var(--c-navy-600) / <alpha-value>)',
          500: 'rgb(var(--c-navy-500) / <alpha-value>)',
        },
        gold: {
          600: 'rgb(var(--c-gold-600) / <alpha-value>)',
          500: 'rgb(var(--c-gold-500) / <alpha-value>)',
          400: 'rgb(var(--c-gold-400) / <alpha-value>)',
          300: 'rgb(var(--c-gold-300) / <alpha-value>)',
        },
        live: 'rgb(var(--c-live)     / <alpha-value>)',
        finished: 'rgb(var(--c-finished) / <alpha-value>)',
        content: {
          primary: 'rgb(var(--c-text-primary)   / <alpha-value>)',
          secondary: 'rgb(var(--c-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--c-text-muted)     / <alpha-value>)',
          accent: 'rgb(var(--c-text-accent)    / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        label: ['Barlow Condensed', 'Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.5625rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      },
      spacing: {
        'navbar': '56px',
        'sidebar': '320px',
        'row': '52px',
        'row-mob': '60px',
      },
      animation: {
        'live-blink': 'live-blink 2s ease-in-out infinite',
        'live-pulse': 'live-pulse 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 0.15s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.25s ease-out',
        'loader-box': 'loader-box 1.1s ease-in infinite',
      },
      keyframes: {
        'live-blink': {
          '0%, 100%': { filter: 'brightness(1) saturate(1)' },
          '50%': { filter: 'brightness(2.2) saturate(2)' },
        },
        'live-pulse': {
          '0%, 100%': { filter: 'brightness(1)', transform: 'scale(1)', opacity: '1' },
          '50%': { filter: 'brightness(2.5)', transform: 'scale(0.75)', opacity: '0.7' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'loader-box': {
          '0%, 100%': { backgroundColor: 'rgb(var(--c-navy-600))', transform: 'scale(1)' },
          '50%': { backgroundColor: 'rgb(var(--c-gold-500))', transform: 'scale(1.4)' },
        },
      },
    },
  },
  plugins: [],
}