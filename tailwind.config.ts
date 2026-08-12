import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: { DEFAULT: "#183A4A", deep: "#0F2733" },
        kesari: "#C56A2D",
        parchment: { DEFAULT: "#F3EBDD", soft: "#ECE1CC" },
        sandstone: "#D8C5A4",
        ink: { DEFAULT: "#20201D", soft: "#4A453D" },
        forest: "#304D3B",
        brass: "#A9864A",
      },
      fontFamily: {
        display: ["'DM Serif Display'", "serif"],
        body: ["Manrope", "sans-serif"],
        hindi: ["'Noto Sans Devanagari'", "sans-serif"],
        sanskrit: ["'Noto Serif Devanagari'", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
