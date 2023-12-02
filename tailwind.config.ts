import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'crush-it-blue': '#6284FF',
        'crush-it-black': '#252628',
        'crush-it-text-black': '#1F1F1F',
        'crush-it-line': '#3E3F42',
        'crush-it-blue-g': '#4B6DE9',
        'crush-it-grey': '#F5F7F9',
        'crush-it-light-grey': '#545454',
        'crush-it-orange': '#FE754D',
        'crush-it-border-grey': '#E2EAF1'
      },
      fontFamily: {
        'sans': ['DM Sans'],
        'Fredoka': ['Fredoka']
      }
    },
  },
  plugins: [],
}
export default config
