/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgBase: '#0a0a0c',
        bgCard: '#141417',
        bgCardHover: '#1c1c21',
        accent: '#00f0ff',
        textMain: '#e2e2e6',
        textDim: '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #00f0ff, 0 0 10px #00f0ff' },
          '100%': { textShadow: '0 0 20px #00f0ff, 0 0 40px #00f0ff' },
        },
      },
      boxShadow: {
        accent: '0 0 20px rgba(0, 240, 255, 0.3)',
        'accent-lg': '0 0 40px rgba(0, 240, 255, 0.5)',
      },
    },
  },
  plugins: [],
}
