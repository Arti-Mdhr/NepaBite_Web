/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: "#E63946",
      accent: "#F4A261",
      fresh: "#2A9D8F",
      bgsoft: "#FFF8F2",
      },
    },
  },
  plugins: [],
  darkMode: "media",
};

module.exports = config;
