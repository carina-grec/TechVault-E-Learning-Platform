/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Stitch Colors
        primary: '#65a30d',
        'background-light': '#f7f6f8',
        'background-dark': '#171121',

        // Legacy/Compat Colors (keeping some for safety, but overriding main ones)
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
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        // Stitch Shadows (Neobrutalism)
        'hard': '4px 4px 0px #1e293b',
        'hard-lg': '8px 8px 0px #1e293b',
        'hard-sm-hover': '2px 2px 0px #1e293b',
        'hard-hover': '6px 6px 0px #1e293b',

        // Legacy
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
