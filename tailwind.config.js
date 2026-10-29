/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#060B19',
        surface: {
          lowest: '#03060f',
          DEFAULT: '#060B19',
          low: '#0A1021',
          container: '#10182B',
          high: '#151F35',
          highest: '#242a39',
        },
        primary: {
          DEFAULT: '#20D9F2',
          glow: '#9BEFFF',
          dark: '#00363E',
          container: '#20D9F2',
          onContainer: '#00363E',
        },
        secondary: {
          DEFAULT: '#8565FA',
          light: '#CBBEFF',
          dark: '#340098',
          container: '#4B1FBE',
        },
        tertiary: {
          DEFAULT: '#FFB45B',
          light: '#FFDCBA',
          dark: '#482900',
        },
        text: {
          primary: '#F5F7FF',
          secondary: '#98A7BF',
          muted: '#4F617D',
        },
        border: {
          subtle: '#141D30',
          DEFAULT: '#1D2A44',
          highlight: '#20D9F2',
        },
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        telemetry: ['"Space Grotesk"', 'monospace'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(32, 217, 242, 0.35)',
        'glow-violet': '0 0 20px -3px rgba(133, 101, 250, 0.35)',
        'glow-gold': '0 0 20px -3px rgba(255, 180, 91, 0.35)',
        'hud-panel': '0 4px 24px -2px rgba(6, 11, 25, 0.8), 0 0 16px -2px rgba(32, 217, 242, 0.08)',
      },
      animation: {
        'spin-slow': 'spin 120s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

