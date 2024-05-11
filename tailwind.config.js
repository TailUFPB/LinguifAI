/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        limit: "1190px",
      },
      colors: {
        main: {
          darker: "#000624",
          dark: "#000939",
          bold: "#000C4C",
          medium: "#001169",
          light: "#0037FA",
          lighter: "#9BB1FF",
        },
        grey: "D9D9D9",
        secondary: "#374151",
      },
    },
  },
  plugins: [],
};
