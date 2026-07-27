import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2DB84C',
          dark: '#1a1a1a',
        },
        // Per-store theme tokens backed by CSS variables (see globals.css).
        store: {
          primary: 'rgb(var(--store-primary-rgb) / <alpha-value>)',
          'primary-hover': 'var(--store-primary-hover)',
          'primary-soft': 'var(--store-primary-soft)',
          'primary-muted': 'var(--store-primary-muted)',
          bg: 'rgb(var(--store-bg-rgb) / <alpha-value>)',
          'bg-shell': 'var(--store-bg-shell)',
          text: 'rgb(var(--store-text-rgb) / <alpha-value>)',
          muted: 'rgb(var(--store-muted-rgb) / <alpha-value>)',
          border: 'rgb(var(--store-border-rgb) / <alpha-value>)',
          subtle: 'rgb(var(--store-subtle-rgb) / <alpha-value>)',
          'stock-in': 'rgb(var(--store-stock-in-rgb) / <alpha-value>)',
          'stock-out': 'rgb(var(--store-stock-out-rgb) / <alpha-value>)',
          'stock-low': 'rgb(var(--store-stock-low-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
