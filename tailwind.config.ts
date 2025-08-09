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
        background: "#000000", // Pure Black Background for total darkness
        foreground: "#f5f5f5", // Very light gray for readability on black
        card: {
          DEFAULT: "#1a1a1a", // Very dark gray card background for subtle contrast
          foreground: "#e0e0e0", // Soft white text
        },
        popover: {
          DEFAULT: "#2c2c2c", // A bit lighter dark shade for popovers
          foreground: "#e0e0e0",
        },
        primary: {
          DEFAULT: "#800000", // Classic maroon for main accents/buttons
          foreground: "#ffffff", // White text on maroon
        },
        secondary: {
          DEFAULT: "#b03060", // Slightly pinkish maroon for secondary accents
          foreground: "#fff0f6", // Light pinkish text
        },
        muted: {
          DEFAULT: "#4b4b4b", // Medium dark gray for disabled/text-muted
          foreground: "#999999",
        },
        accent: {
          DEFAULT: "#aa0033", // Bright cherry red accent to complement maroon
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ff4444", // Strong red for destructive actions
          foreground: "#ffffff",
        },
        border: "#333333", // Dark border color
        input: "#222222", // Input backgrounds darker for focus
        ring: "#800000", // Maroon ring focus outlines
        chart: {
          "1": "#800000",
          "2": "#b03060",
          "3": "#aa0033",
          "4": "#4b4b4b",
          "5": "#222222",
        },
        sidebar: {
          DEFAULT: "#1a1a1a",
          foreground: "#f5f5f5",
          primary: "#800000",
          "primary-foreground": "#ffffff",
          accent: "#aa0033",
          "accent-foreground": "#fff0f6",
          border: "#333333",
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
