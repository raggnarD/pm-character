/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 8-bit theme colors
        'bit8': {
          bg: '#1a1a3e',
          border: '#4a9eff',
          text: '#ffffff',
          accent: '#ffd700',
          stat: {
            cyan: '#00ffff',
            green: '#00ff00',
            yellow: '#ffff99',
          }
        },
        // FF7 theme colors
        'ff7': {
          bg: '#1a2a5e',
          'bg-light': '#2a3a7e',
          border: '#ffd700',
          text: '#00ffff',
          'text-alt': '#88ffff',
          mako: '#00ff88',
          hp: '#ff99cc',
          mp: '#9999ff',
        },
        // FF7 Rebirth theme colors
        'rebirth': {
          bg: '#1a2433',
          'bg-overlay': 'rgba(26, 36, 51, 0.85)',
          text: '#ffffff',
          'text-highlight': '#88ddff',
          accent: '#00ccdd',
          teal: '#00ccdd',
        }
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'ff7': ['"Orbitron"', 'sans-serif'],
        'rebirth': ['"Inter"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'draw': 'draw 1s ease-out',
        'bar-grow': 'barGrow 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        draw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        barGrow: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
