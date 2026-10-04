import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#eaedf2",
          200: "#d5dbe6",
          300: "#b3bdcc",
          400: "#8896ab",
          500: "#67758c",
          600: "#525e73",
          700: "#434c5e",
          800: "#2c3548",
          900: "#1c2740",
          950: "#12192b",
        },
        cedar: {
          50: "#fbf7ef",
          100: "#f4ead6",
          200: "#e7d4ab",
          300: "#d4b56e",
          400: "#c49a48",
          500: "#b08a3a",
          600: "#95712f",
          700: "#78592a",
          800: "#634928",
          900: "#533d25",
          950: "#2e2113",
        },
        mist: {
          50: "#f3f6f8",
          100: "#e6eef2",
          200: "#cddce5",
          300: "#a8c2d0",
          400: "#7aa0b4",
          500: "#5b8499",
          600: "#4a6c80",
          700: "#3e5869",
          800: "#364a58",
          900: "#303f4b",
          950: "#1b262e",
        },
      },
      fontFamily: {
        display: ['"Shippori Mincho"', "Yu Mincho", "serif"],
        sans: ['"Zen Kaku Gothic New"', "Hiragino Sans", "sans-serif"],
      },
      borderRadius: {
        card: "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
