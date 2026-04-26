import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e0fff6",
          100: "#b3ffea",
          200: "#80ffdd",
          300: "#4dffd0",
          400: "var(--brand)",
          500: "var(--brand-dim)",
          600: "#00b39a",
          700: "#00917d",
          800: "#006f60",
          900: "#004d43",
          950: "#002b26",
        },
        accent: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "var(--accent)",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        surface: {
          950: "var(--surface-bg)",
          900: "var(--surface-1)",
          800: "var(--surface-2)",
          700: "var(--surface-3)",
          600: "var(--border)",
        },
        text: {
          1: "var(--text-1)",
          2: "var(--text-2)",
          3: "var(--text-3)",
        },
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "hero": ["3.5rem", { lineHeight: "1.1", fontWeight: "800" }],
        "display": ["2.5rem", { lineHeight: "1.15", fontWeight: "700" }],
        "title": ["1.75rem", { lineHeight: "1.25", fontWeight: "700" }],
      },
      animation: {
        "fade-in":       "fadeIn 0.4s ease forwards",
        "slide-up":      "slideUp 0.4s ease forwards",
        "slide-in":      "slideIn 0.3s ease forwards",
        "pulse-slow":    "pulse 3s ease-in-out infinite",
        "shimmer":       "shimmer 2s linear infinite",
        "glow-pulse":    "glowPulse 2s ease-in-out infinite",
        "float":         "float 6s ease-in-out infinite",
        "gradient-shift":"gradientShift 8s ease infinite",
        "spin-slow":     "spin 8s linear infinite",
        "bounce-dot":    "bounceDot 1.4s ease-in-out infinite",
        "orb-float":     "orbFloat 20s ease-in-out infinite",
        "orb-float-2":   "orbFloat2 25s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideIn: { from: { opacity: "0", transform: "translateX(-16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,245,212,0.15), 0 0 60px rgba(0,245,212,0.05)" },
          "50%": { boxShadow: "0 0 30px rgba(0,245,212,0.25), 0 0 80px rgba(0,245,212,0.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        orbFloat: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        orbFloat2: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-40px, 30px) scale(1.05)" },
          "66%": { transform: "translate(25px, -35px) scale(0.95)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
