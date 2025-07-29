/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#111722',
          secondary: '#1A1F26',
          card: '#2A3038',
        },
        accent: {
          cyan: '#00FFF7',
          purple: '#8B5CF6',
          green: '#10B981',
          red: '#EF4444',
        },
        text: {
          primary: '#E5E5E5',
          secondary: '#9CA3AF',
        },
        border: '#374151',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 247, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 247, 0.6)' },
        },
      },
    },
  },
  plugins: [],
} 