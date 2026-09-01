import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Primary navy — identitas profesional Inspektorat
        primary: {
          50: "#EEF2F8",
          100: "#DCE4F1",
          200: "#B7C7E3",
          300: "#8CA5CE",
          400: "#5C7EB0",
          500: "#3C5D8F",
          600: "#2A4470",
          700: "#1B2A4A",
          800: "#141F38",
          900: "#0D1526",
          DEFAULT: "#1B2A4A",
        },
        // Royal blue — CTA, active states, links, focus
        accent: {
          DEFAULT: "#155EEF",
          50: "#EDF3FF",
          100: "#DCE8FF",
          400: "#3B7BFA",
          500: "#155EEF",
          600: "#2563EB",
          light: "#5B93FF",
        },
        // Cyan — secondary highlight, used sparingly for gradients/glow
        cyan: {
          DEFAULT: "#0EA5E9",
          50: "#EBF9FF",
        },
        // Status semantik
        status: {
          berlaku: "#16A34A",
          "berlaku-bg": "#ECFDF3",
          ditinjau: "#D97706",
          "ditinjau-bg": "#FFFBEB",
          dicabut: "#DC2626",
          "dicabut-bg": "#FEF2F2",
        },
        // Netral / permukaan
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F8FA",
          subtle: "#F1F3F6",
        },
        border: {
          DEFAULT: "#E4E7EC",
          strong: "#D0D5DD",
        },
        ink: {
          DEFAULT: "#101828",
          muted: "#475467",
          subtle: "#667085",
          faint: "#98A2B3",
        },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "14px",
        "3xl": "18px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(16,24,40,0.04)",
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        "card-hover": "0 4px 10px rgba(16,24,40,0.06), 0 2px 4px rgba(16,24,40,0.05)",
        panel: "0 2px 8px rgba(16,24,40,0.05), 0 1px 2px rgba(16,24,40,0.04)",
        glow: "0 0 0 1px rgba(21,94,239,0.35), 0 4px 14px rgba(21,94,239,0.25)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
