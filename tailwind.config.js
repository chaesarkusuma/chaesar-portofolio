/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080808',
        paper: '#F5F5F5',
        dim: '#777777',
        muted: '#303030'
      },
      fontFamily: {
        display: ['"Fraunces"', '"Noto Sans JP"', '"Noto Sans SC"', '"Noto Sans KR"', '"Noto Naskh Arabic"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      letterSpacing: {
        widest2: '0.35em'
      }
    }
  },
  plugins: []
}
