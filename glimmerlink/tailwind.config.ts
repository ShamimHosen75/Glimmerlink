import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Legacy (experience page)
        dusk: "#1a0b2e",
        plum: "#2d1b4e",
        lantern: "#F6C453",
        frosting: "#F7A8C4",
        mint: "#8FE3C9",
        cream: "#FFF6EC",
        // Wishprise-style palette
        brand: {
          bg: "#0f0720",
          card: "#1a0f30",
          purple: "#6c2eb9",
          pink: "#e040fb",
          magenta: "#c020e0",
          gold: "#f6c453",
          glow: "#8b5cf6",
        },
      },
      fontFamily: {
        display: ['"Bagel Fat One"', '"Arial Rounded MT Bold"', "system-ui", "sans-serif"],
        sans: ['"Nunito Sans"', "system-ui", "sans-serif"],
        script: ['"Dancing Script"', "cursive"],
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.25) 0%, transparent 70%)",
        "card-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        glow: "0 0 30px 4px rgba(192,32,224,0.4)",
        "glow-sm": "0 0 14px 2px rgba(192,32,224,0.3)",
        card: "0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(-2deg)" },
          "50%": { transform: "translateY(-24px) rotate(2deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(3deg)" },
          "50%": { transform: "translateY(-18px) rotate(-3deg)" },
        },
        drift: {
          "0%": { transform: "translateY(100vh) translateX(0px)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-10vh) translateX(30px)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.3)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        drift: "drift 18s linear infinite",
        shimmer: "shimmer 3s linear infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
        "slide-up": "slideUp 0.4s ease-out",
        twinkle: "twinkle 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
