/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#a3cb39",
        secundary: "#5f7527",
        black: "#000000",
        white: "#ffffff",
        red: "#9a0000",
      },
    },
    animation: {
      moveBackground: "moveBackground 20s linear infinite",
    },
    keyframes: {
      moveBackground: {
        "0%": { backgroundPosition: "0% 0%" },
        "50%": { backgroundPosition: "100% 100%" },
        "100%": { backgroundPosition: "0% 0%" },
      },
    },
  },
  important: true,
  plugins: [],
};
