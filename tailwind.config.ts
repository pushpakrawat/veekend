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
        background: "#000000",       // Pure black background
        foreground: "#ffffff",       // White text
        card: {
          DEFAULT: "#111111",        // Very dark gray for slight contrast with background
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#1a1a1a",
          foreground: "#ffffff",
        },
        primary: {
          DEFAULT: "#ffffff",        // White for primary elements
          foreground: "#000000",     // Black text on white
        },
        secondary: {
          DEFAULT: "#e5e5e5",        // Light gray for secondary buttons
          foreground: "#000000",
        },
        muted: {
          DEFAULT: "#333333",        // Mid-gray for muted areas
          foreground: "#cccccc",
        },
        accent: {
          DEFAULT: "#f5f5f5",        // Almost white for accents
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#ff0000",        // Red for danger
          foreground: "#ffffff",
        },
        border: "#333333",           // Dark border
        input: "#1a1a1a",            // Input bg
        ring: "#ffffff",             // White focus ring
        chart: {
          "1": "#ffffff",
          "2": "#cccccc",
          "3": "#999999",
          "4": "#666666",
          "5": "#333333",
        },
        sidebar: {
          DEFAULT: "#111111",
          foreground: "#ffffff",
          primary: "#ffffff",
          "primary-foreground": "#000000",
          accent: "#f5f5f5",
          "accent-foreground": "#000000",
          border: "#333333",
          ring: "#ffffff",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
