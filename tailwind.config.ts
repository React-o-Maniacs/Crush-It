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
        'crush-it-line': '#3E3F42',
      },
    },
  },
  plugins: [],
}
export default config
