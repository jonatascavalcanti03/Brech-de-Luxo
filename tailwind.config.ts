import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Color Palette ──────────────────────────────────────
      colors: {
        // Deep Black Foundation
        obsidian: {
          DEFAULT: "#050505",
          50:  "#0a0a0a",
          100: "#111111",
          200: "#1a1a1a",
          300: "#222222",
          400: "#2a2a2a",
        },
        // Emerald – Primary CTA
        emerald: {
          DEFAULT: "#10b981",
          glow:   "#10b981",
          dark:   "#059669",
          light:  "#34d399",
          subtle: "rgba(16,185,129,0.08)",
        },
        // Rose Gold – Accent
        "rose-gold": {
          DEFAULT: "#d4af37",
          light:  "#e5c85e",
          dark:   "#b8960c",
          subtle: "rgba(212,175,55,0.08)",
        },
        // Glass layers
        glass: {
          white:  "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.08)",
          hover:  "rgba(255,255,255,0.10)",
          strong: "rgba(255,255,255,0.15)",
        },
      },

      // ── Typography ─────────────────────────────────────────
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans:  ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },

      // ── Spacing & Sizing ───────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },

      // ── Box Shadows (Glow effects) ─────────────────────────
      boxShadow: {
        "glow-emerald":   "0 0 20px rgba(16,185,129,0.35), 0 0 60px rgba(16,185,129,0.10)",
        "glow-gold":      "0 0 20px rgba(212,175,55,0.35),  0 0 60px rgba(212,175,55,0.10)",
        "glow-white":     "0 0 30px rgba(255,255,255,0.08)",
        "card-glass":     "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover":     "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        "navbar":         "0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)",
        "button-primary": "0 4px 20px rgba(16,185,129,0.4)",
        "button-gold":    "0 4px 20px rgba(212,175,55,0.4)",
      },

      // ── Backdrop Blur ──────────────────────────────────────
      backdropBlur: {
        xs:   "2px",
        "3xl":"48px",
        "4xl":"72px",
      },

      // ── Background Size ────────────────────────────────────
      backgroundSize: {
        "200%": "200% 200%",
        "300%": "300% 300%",
      },

      // ── Custom Animations ──────────────────────────────────
      keyframes: {
        // Shimmer skeleton
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Gradient flow for buttons/hero
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":       { backgroundPosition: "100% 50%" },
        },
        // Pulse glow for badges
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(16,185,129,0.4)" },
          "50%":       { boxShadow: "0 0 20px rgba(16,185,129,0.8)" },
        },
        // Spotlight ray
        "spotlight": {
          "0%":   { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%, -40%) scale(1)" },
        },
        // Floating (hero elements)
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-12px)" },
        },
        // Ken Burns zoom
        "ken-burns": {
          "0%":   { transform: "scale(1.0) translate(0, 0)" },
          "100%": { transform: "scale(1.08) translate(-1%, -1%)" },
        },
        // Fade up (scroll reveal)
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Slide in from left
        "slide-in": {
          "0%":   { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Badge bounce
        "badge-pop": {
          "0%":   { transform: "scale(0.8)", opacity: "0" },
          "60%":  { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)",   opacity: "1" },
        },
        // Cursor expand
        "cursor-expand": {
          "0%":   { transform: "scale(1)" },
          "100%": { transform: "scale(2.5)" },
        },
      },
      animation: {
        shimmer:          "shimmer 2s linear infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "pulse-glow":     "pulse-glow 2s ease-in-out infinite",
        spotlight:        "spotlight 2s ease 0.75s forwards",
        float:            "float 6s ease-in-out infinite",
        "ken-burns":      "ken-burns 8s ease-in-out infinite alternate",
        "fade-up":        "fade-up 0.6s ease-out forwards",
        "slide-in":       "slide-in 0.5s ease-out forwards",
        "badge-pop":      "badge-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },

      // ── Transition Timing ──────────────────────────────────
      transitionTimingFunction: {
        "luxury":    "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "spring":    "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "silk":      "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
