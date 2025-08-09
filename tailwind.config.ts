import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "#0a1045",         // Very dark blue-black
        foreground: "#e8f0ff",         // Gentle soft white-blue for text
        card: {
          DEFAULT: "#151a40",          // Slightly lighter blue-black for cards
          foreground: "#e8f0ff",
        },
        popover: {
          DEFAULT: "#192259",
          foreground: "#dbeafe",
        },
        primary: {
          DEFAULT: "#09fbd3",          // Bright aqua/cyan for main accents/headings
          foreground: "#001f3f",       // Deepest blue for text contrast
        },
        secondary: {
          DEFAULT: "#3ec6ff",          // Neon blue for secondary accents (buttons, icons)
          foreground: "#021f37",
        },
        accent: {
          DEFAULT: "#2ef6ff",          // Electric cyan accent for highlights
          foreground: "#07213c",
        },
        muted: {
          DEFAULT: "#414868",          // Muted blue-gray for less important UI
          foreground: "#b6c2e2",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        border: "#2b3263",             // Blue-gray border color for sharpness
        input: "#192259",              // Input backgrounds blend well with popover/cards
        ring: "#09fbd3",               // Bright cyan for focus outlines
        chart: {
          "1": "#09fbd3",
          "2": "#3ec6ff",
          "3": "#2ef6ff",
          "4": "#414868",
          "5": "#151a40",
        },
        sidebar: {
          DEFAULT: "#151a40",
          foreground: "#e8f0ff",
          primary: "#09fbd3",
          "primary-foreground": "#001f3f",
          accent: "#2ef6ff",
          "accent-foreground": "#07213c",
          border: "#2b3263",
          ring: "#09fbd3",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
