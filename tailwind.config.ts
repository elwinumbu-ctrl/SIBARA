import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B2A4A",
          light: "#2F4470",
          dark: "#101B33",
        },
        paper: {
          DEFAULT: "#F5F2EA",
          card: "#FBF9F4",
          line: "#E4DFD0",
        },
        seal: {
          DEFAULT: "#B8862E",
          light: "#D3A758",
        },
        status: {
          berlaku: "#3F7355",
          ditinjau: "#B8862E",
          dicabut: "#A64B4B",
        },
        slate: {
          text: "#3A3F4B",
          muted: "#6B7080",
        },
      },
      fontFamily: {
        display: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,42,74,0.06), 0 1px 0 rgba(27,42,74,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
