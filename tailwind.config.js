/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: { darker: "#000624", dark: "#000939", light: "#0037FA", lighter: "#9BB1FF" },
        secondary: "#374151",
      },
    },
  },
  plugins: [],
};
