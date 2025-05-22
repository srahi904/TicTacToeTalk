/** @format */

// tailwind.config.js
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
        green: "#4caf50",

        dm: {
          base: "#1E1E1E", // deep charcoal black, perfect dark background
          surface: "#2C2C2C", // surface/card layer
          primary: "#FF6F61", // warm coral red (CTA, buttons)
          secondary: "#A0A6F0", // soft pastel blue (links, tags)
          accent: "#B39CD0", // lavender accent (decorative/emphasis)
          text: "#E0E7FF", // soft icy white text (easy on eyes)
          muted: "#888888", // proper muted gray for placeholders
        },

        aesthetic: {
          blush: "#ffb3c1",
          periwinkle: "#c3b1e1",
          mint: "#a0f0ba",
          dusk: "#3a445d",
          sunrise: "#ffcf99",
          shadow: "#2e2e2e",
          lava: "#ff6f61",
          cloud: "#e0e7ff",
        },

        // Glass overlays
        glass: {
          light: "rgba(255,255,255,0.35)",
          dark: "rgba(22, 27, 34, 0.5)", // Matches `dm.surface` w/ opacity
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))", // Optional if used
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-in-out",
        pop: "pop 0.3s cubic-bezier(.36,1.61,.58,1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
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
