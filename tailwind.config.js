/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zentry: ["zentry", "sans-serif"],
        circular: ["circular-web", "sans-serif"],
        general: ["general", "sans-serif"],
        "robert-medium": ["robert-medium", "sans-serif"],
        "robert-regular": ["robert-regular", "sans-serif"],
      },
      colors: {
        bgColor: "#DFDFF2",
        textColor: "#DFDFF2",
        textColorInverted: "#000",
        accentColor: "#EDFF66",
        colorsPurple: "#5542FF",
        colorsGrey: "#DFDFF2",
        colorsRed: "#FF264E",
        colorsOrange: "#FF6F2F",
        colorsYellow: "#EDFF66",
        colorsBlack: "#000",
      },
    },
  },
  plugins: [],
};
