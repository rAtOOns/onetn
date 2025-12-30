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
        // Tamil Nadu State Bird (Emerald Dove) Based Palette
        tn: {
          primary: "#065f46",      // Deep Emerald Green - State bird, professional
          secondary: "#10b981",    // Bright Emerald - Dove plumage, highlights
          accent: "#d97706",       // Temple Gold - Gopuram, Gloriosa Lily
          highlight: "#059669",    // Medium Emerald - Interactive states
          government: "#1e3a5f",   // Official Blue - Formal elements
          chestnut: "#7c2d12",     // Maroon - Dove wing accent
          background: "#f0fdf4",   // Light green tint - Professional, clean
          surface: "#ffffff",      // White - Clean cards
          text: "#1a202c",         // Dark text for readability
        },
        // Category Colors for Tools
        category: {
          salary: "#ec4899",       // Pink - Salary & Pay
          leave: "#3b82f6",        // Blue - Leave & Service
          pension: "#f59e0b",      // Amber - Retirement & Pension
          tax: "#ef4444",          // Red - Tax & Deductions
          transfer: "#8b5cf6",     // Purple - Transfer
          exam: "#06b6d4",         // Cyan - Exams & TET
          gpf: "#10b981",          // Green - GPF & Provident Fund
          reference: "#6366f1",    // Indigo - Reference & Info
          utility: "#f97316",      // Orange - Utilities
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
