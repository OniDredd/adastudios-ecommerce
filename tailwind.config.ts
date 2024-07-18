import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        "main-creme": "#fff6db",
        "secondary-green": "#008517",
        "main-green": "#15803D",
        "dark-green": "#275b27",
        "secondary-brown": "#564734"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'main-font': ['PlantagenetCherokee', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
