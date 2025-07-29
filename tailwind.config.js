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
        // Couleurs gaming personnalisées
        'gaming': {
          'dark': '#0a0a0a',
          'darker': '#050505',
          'gray': {
            800: '#1a1a1a',
            700: '#2a2a2a',
            600: '#3a3a3a',
            500: '#4a4a4a',
            400: '#5a5a5a',
            300: '#6a6a6a',
            200: '#7a7a7a',
            100: '#8a8a8a',
          },
          'cyan': {
            500: '#00d4ff',
            400: '#33ddff',
            300: '#66e6ff',
            200: '#99efff',
            100: '#ccf8ff',
          },
          'purple': {
            600: '#8b5cf6',
            500: '#a855f7',
            400: '#c084fc',
            300: '#d8b4fe',
            200: '#e9d5ff',
            100: '#f3e8ff',
          },
          'blue': {
            600: '#2563eb',
            500: '#3b82f6',
            400: '#60a5fa',
            300: '#93c5fd',
            200: '#bfdbfe',
            100: '#dbeafe',
          },
          'green': {
            600: '#16a34a',
            500: '#22c55e',
            400: '#4ade80',
            300: '#86efac',
            200: '#bbf7d0',
            100: '#dcfce7',
          },
          'red': {
            600: '#dc2626',
            500: '#ef4444',
            400: '#f87171',
            300: '#fca5a5',
            200: '#fecaca',
            100: '#fee2e2',
          },
          'yellow': {
            600: '#ca8a04',
            500: '#eab308',
            400: '#facc15',
            300: '#fde047',
            200: '#fef08a',
            100: '#fef9c3',
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gaming-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff' },
          '100%': { boxShadow: '0 0 20px #00d4ff, 0 0 30px #00d4ff' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'gaming': '0 0 20px rgba(0, 212, 255, 0.3)',
        'gaming-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
        'purple-glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'purple-glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
      }
    },
    },
  plugins: [],
} 