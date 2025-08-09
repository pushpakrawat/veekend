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
        foreground: "#d1d5db",       // Soft light gray text for readability
        card: {
          DEFAULT: "#1e293b",        // Dark slate blue for card backgrounds
          foreground: "#e0e7ff",     // Light blue text on cards
        },
        popover: {
          DEFAULT: "#273449",        // Dark bluish shade for popovers
          foreground: "#cbd5e1",
        },
        primary: {
          DEFAULT: "#2563eb",        // Strong royal blue for primary buttons/highlights
          foreground: "#ffffff",     // White text on primary
        },
        secondary: {
          DEFAULT: "#1e40af",        // Darker indigo blue for secondary accents
          foreground: "#dbeafe",     // Pale blue text
        },
        muted: {
          DEFAULT: "#475569",        // Muted blue-gray for disabled text, placeholders
          foreground: "#94a3b8",
        },
        accent: {
          DEFAULT: "#3b82f6",        // Medium bright blue accent for links, highlights
          foreground: "#1e3a8a",
        },
        destructive: {
          DEFAULT: "#ef4444",        // Red for destructive actions
          foreground: "#ffffff",
        },
        border: "#334155",           // Border color matching card/popover edges
        input: "#1e293b",            // Input background same as card color for blending
        ring: "#2563eb",             // Blue focus ring for accessibility
        chart: {
          "1": "#2563eb",
          "2": "#1e40af",
          "3": "#3b82f6",
          "4": "#475569",
          "5": "#1e293b",
        },
        sidebar: {
          DEFAULT: "#1e293b",        // Sidebar background consistent with cards
          foreground: "#d1d5db",
          primary: "#2563eb",
          "primary-foreground": "#ffffff",
          accent: "#3b82f6",
          "accent-foreground": "#1e3a8a",
          border: "#334155",
          ring: "#2563eb",
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
