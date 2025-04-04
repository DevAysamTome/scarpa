/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          900: '#111827',
        },
        dark: {
          background: '#121212',
          foreground: '#f5f5f5',
          card: '#1e1e1e',
          border: '#333333',
          primary: {
            600: '#3b82f6',
            700: '#2563eb',
          },
          secondary: {
            100: '#2a2a2a',
            200: '#333333',
            300: '#444444',
            400: '#666666',
            500: '#888888',
            900: '#f5f5f5',
          },
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 