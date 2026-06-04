export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        emeraldDeep: '#064e3b',
        emeraldRich: '#047857',
        gold: '#d4af37',
        goldSoft: '#f6e6a6',
        ink: '#111827',
      },
      boxShadow: {
        glow: '0 24px 80px rgba(6, 78, 59, 0.18)',
        gold: '0 18px 55px rgba(212, 175, 55, 0.22)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
};
