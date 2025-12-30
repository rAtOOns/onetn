import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Professional Palette
        tn: {
          primary: "#0891b2",      // Cyan - Modern, professional primary
          secondary: "#7c3aed",    // Violet - Accent for CTAs and highlights
          accent: "#06b6d4",       // Light Cyan - Interactive elements
          highlight: "#10b981",    // Emerald Green - Success states
          government: "#0f766e",   // Dark Teal - Headers and emphasis
          chestnut: "#7c3aed",     // Violet - Secondary accent
          background: "#f0f9ff",   // Light cyan tint
          surface: "#ffffff",      // White - Clean cards
          text: "#0f172a",         // Dark slate text
        },
      },
      fontFamily: {
        tamil: ["Noto Sans Tamil", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "tn-gradient": "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
