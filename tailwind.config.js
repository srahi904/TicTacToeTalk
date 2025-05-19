/** @format */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Blue-600
        secondary: "#06b6d4", // Cyan-500
        accent: "#f43f5e", // Rose-500
        background: "#f8fafc", // Slate-50
        surface: "rgba(255,255,255,0.85)",
        textDark: "#0f172a", // Slate-900
        textLight: "#f1f5f9", // Slate-100
        glass: "rgba(255,255,255,0.35)",
        // lavender: "#a78bfa", // Digital Lavender
        green: "#4caf50", // Verdant Green
        navy: "#181F2A",
        lavender: "#a78bfa",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-in",
        pop: "pop 0.3s cubic-bezier(.36,1.61,.58,1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        pop: {
          "0%": { transform: "scale(0.8)" },
          "80%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
