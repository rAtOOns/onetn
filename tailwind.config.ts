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
        // Tamil Nadu Emerald Dove & Cultural Identity
        tn: {
          primary: "#065f46",      // Deep Emerald Green - State bird
          secondary: "#b91c1c",    // Rich Red - TN flag
          accent: "#d97706",       // Temple Gold - Gopuram, Gloriosa Lily
          highlight: "#10b981",    // Bright Emerald - Dove plumage
          government: "#1e3a5f",   // Official Blue - Formal elements
          chestnut: "#7c2d12",     // Maroon - Dove wing accent
          background: "#f0fdf4",   // Light green tint
          surface: "#ffffff",      // White - Clean cards
          text: "#1a202c",         // Dark text
        },
      },
      fontFamily: {
        tamil: ["Noto Sans Tamil", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "tn-gradient": "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
