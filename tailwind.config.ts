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
        background: "#000000ff", // Midnight Blue
        foreground: "#ffffff",
        card: {
          DEFAULT: "#000000ff", // Slightly lighter midnight blue
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#000000ff",
          foreground: "#ffffff",
        },
        primary: {
          DEFAULT: "#800000", // Maroon
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#a52a2a", // Lighter maroon/brown
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#000000ff",
          foreground: "#d1d1d1",
        },
        accent: {
          DEFAULT: "#b22222", // Firebrick red for accents
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ff4c4c",
          foreground: "#ffffff",
        },
        border: "#000000ff",
        input: "#2f2f6f",
        ring: "#800000",
        chart: {
          "1": "#800000",
          "2": "#b22222",
          "3": "#a52a2a",
          "4": "#262673",
          "5": "#191970",
        },
        sidebar: {
          DEFAULT: "#000000ff",
          foreground: "#ffffff",
          primary: "#800000",
          "primary-foreground": "#ffffff",
          accent: "#b22222",
          "accent-foreground": "#ffffff",
          border: "#000000ff",
          ring: "#800000",
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
