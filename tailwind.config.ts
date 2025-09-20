import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'dark-bg': '#111111',
        'dark-sidebar': '#1a1a1a',
        'dark-hover': '#2a2a2a',
        'dark-surface': '#1f1f1f',
        'dark-border': '#374151',
      }
    },
  },
  plugins: [],
}
export default config
