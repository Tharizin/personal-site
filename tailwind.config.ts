import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: "#FF6F61",
        // Pale slate blue. Used for both the hero mist and the panel it melds
        // into, so the two are the same colour by construction.
        mist: "#c7d3e0",
      },
    },
  },
  plugins: [],
};

export default config;
