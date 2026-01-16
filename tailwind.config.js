/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandOrange: "#FF7F50",
        brandRed: "#FF0000",
        cardBg: "#FFF6ED",
        inputBg: "#F3E8EE",
      },
    },
  },
  plugins: [],
  darkMode: "media",
};

module.exports = config;
