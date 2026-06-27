/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050510',
        surface: '#0f0f1f',
        card: '#141428',
        border: '#232348',
        cyan: '#00d4ff',
        purple: '#7d38f5',
        green: '#21e695',
        orange: '#ff8a1a',
        'text-primary': '#f5f5fa',
        'text-secondary': '#8c8cb3',
        'text-muted': '#595980',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #00d4ff 0%, #7d38f5 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(20,20,40,0.9) 0%, rgba(15,15,31,0.9) 100%)',
      },
    },
  },
  plugins: [],
}
