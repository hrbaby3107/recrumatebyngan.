/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        blush: {
          50: "#fdf5f8",
          100: "#fbebf1",
          200: "#f8dde7",
          300: "#f1c3d3",
          400: "#e6a3ba",
          500: "#d4809c",
          600: "#b8607d",
          700: "#964a63",
        },
        cream: {
          DEFAULT: "#fff9f2",
          100: "#f7efe4",
          200: "#ece1d1",
        },
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
        },
      },
      boxShadow: {
        clay: "0 1px 2px rgb(100 129 107 / 0.08), 0 8px 20px -8px rgb(100 129 107 / 0.28)",
        "clay-lg": "0 2px 4px rgb(100 129 107 / 0.08), 0 22px 44px -14px rgb(100 129 107 / 0.32)",
        card: "0 1px 2px rgb(120 100 80 / 0.05), 0 6px 18px -8px rgb(120 100 80 / 0.14)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
