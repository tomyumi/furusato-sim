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
          50: "#f4f7f5",
          100: "#e4ebe6",
          200: "#c8d6cc",
          300: "#a3b8a9",
          400: "#7a9683",
          500: "#5a7a64",
          600: "#45614e",
          700: "#384e40",
          800: "#2f4035",
          900: "#28362d",
          950: "#141c17",
        },
        cedar: {
          50: "#f7f4ef",
          100: "#ebe3d6",
          200: "#d8c7ae",
          300: "#c2a57f",
          400: "#b0895c",
          500: "#a1754c",
          600: "#8a5e40",
          700: "#6f4937",
          800: "#5d3d32",
          900: "#51352d",
          950: "#2e1b17",
        },
        mist: {
          50: "#f3f8f9",
          100: "#dff0f3",
          200: "#c3e2e8",
          300: "#94cbd6",
          400: "#5eacbd",
          500: "#4390a3",
          600: "#3a7689",
          700: "#346070",
          800: "#31515d",
          900: "#2d454f",
          950: "#1a2c34",
        },
      },
      fontFamily: {
        display: ['"Shippori Mincho"', "Yu Mincho", "serif"],
        sans: ['"Zen Kaku Gothic New"', "Hiragino Sans", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px -16px rgba(20, 28, 23, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
