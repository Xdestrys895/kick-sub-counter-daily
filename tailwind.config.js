/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/domain/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dashboard design tokens
        base: "#09090b",
        surface: "#111113",
        raised: "#18181b",
        line: "#232327",
        "line-strong": "#34343a",
        fg: "#fafafa",
        muted: "#8b8b93",
        accent: { DEFAULT: "#53FC18", hover: "#6bff36" },
        // Legacy palette, still used by overlay themes
        kick: {
          green: "#53FC18",
          dark: "#0b0e0f",
          darker: "#07090a",
          card: "#131719",
          border: "#1f2629",
          gray: "#9da3a8"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Consolas", "monospace"],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(83, 252, 24, 0.6))' },
          '50%': { opacity: '.85', filter: 'drop-shadow(0 0 4px rgba(83, 252, 24, 0.3))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
