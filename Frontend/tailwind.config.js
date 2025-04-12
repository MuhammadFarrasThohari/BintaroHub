/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0E5799",
        allWhite: "#F1F1F1",
        allBlack: "#303030",
        subhead: "#707070",
        subsubhead: "#BEBEBE",
        desc: "#707070",
        danger: "#B23A3A",
        forumBox: "#EAEAEA",
      },
      fontFamily: {
        lisanslight: ["lisans-light", "sans-serif"],
        lisansregular: ["lisans-regular", "sans-serif"],
        lisanssmbold: ["lisans-semibold", "sans-serif"],
        lisansblack: ["lisans-regular", "sans-serif"],
        lisanslightitalic: ["lisans-light-italic", "sans-serif"],
        lisansregularitalic: ["lisans-regular-italic", "sans-serif"],
        lisanssmbolditalic: ["lisans-semibold-italic", "sans-serif"],
      }
    },
  },
  plugins: [],
}
