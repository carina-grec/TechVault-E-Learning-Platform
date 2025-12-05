/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: '#f9f5ec',
        sand: '#e6dcc7',
        stone: '#d6d0c4',
        softGold: '#eacb8f',
        charcoal: '#0f1218',
        onyx: '#111827',
        deepViolet: '#2b1b47',
        mutedSilver: '#9ca3af',
        accentRose: '#d1549b',
        accentLime: '#a3e635',
        accentBlue: '#60a5fa',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      spacing: {
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
      },
      fontSize: {
        title: ['2.25rem', { lineHeight: '1.1', fontWeight: '700' }],
        subtitle: ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 18, 24, 0.08)',
        depth: '6px 6px 0 rgba(17, 24, 39, 0.18)',
        glow: '0 0 24px rgba(86, 60, 141, 0.35)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          lg: '2rem',
        },
      },
    },
  },
  plugins: [],
};
