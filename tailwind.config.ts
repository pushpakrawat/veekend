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
        foreground: "#e0e7ff",       // Soft light blue text for contrast
        card: {
          DEFAULT: "#1e293b",        // Dark slate blue for cards
          foreground: "#cbd5e1",     // Light slate text
        },
        popover: {
          DEFAULT: "#334155",        // Medium dark blue for popovers
          foreground: "#cbd5e1",
        },
        primary: {
          DEFAULT: "#3b82f6",        // Vivid sky blue primary color
          foreground: "#ffffff",     // White text on primary
        },
        secondary: {
          DEFAULT: "#2563eb",        // Stronger blue for secondary accents
          foreground: "#dbeafe",
        },
        muted: {
          DEFAULT: "#475569",        // Muted steel blue for disabled/text-muted
          foreground: "#94a3b8",
        },
        accent: {
          DEFAULT: "#60a5fa",        // Soft accent blue
          foreground: "#1e40af",
        },
        destructive: {
          DEFAULT: "#ef4444",        // Red for destructive actions
          foreground: "#ffffff",
        },
        border: "#334155",           // Dark border matching popover
        input: "#1e293b",            // Same as card background for inputs
        ring: "#3b82f6",             // Blue ring focus color
        chart: {
          "1": "#3b82f6",
          "2": "#2563eb",
          "3": "#60a5fa",
          "4": "#475569",
          "5": "#1e293b",
        },
        sidebar: {
          DEFAULT: "#1e293b",
          foreground: "#e0e7ff",
          primary: "#3b82f6",
          "primary-foreground": "#ffffff",
          accent: "#60a5fa",
          "accent-foreground": "#1e40af",
          border: "#334155",
          ring: "#3b82f6",
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
