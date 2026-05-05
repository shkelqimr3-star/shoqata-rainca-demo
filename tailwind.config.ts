import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211c",
        pine: "#1f5f4b",
        leaf: "#4c956c",
        skywash: "#e9f2f5",
        gold: "#d89d37",
        ember: "#b23a2f"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(23, 33, 28, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
