/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [".//**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        darkblue: {
          50: "#E0E5F5",
          100: "#BDC8EA",
          200: "#7B90D6",
          300: "#3B5ABF",
          400: "#283D80",
          500: "#131D3D",
          600: "#101833",
          700: "#0B1123",
          800: "#070B17",
          900: "#04060C",
          950: "#020408",
        },
      },
      screens: {
        'max-sm': { max: '700px' }, // For screens smaller than 640px
        'max-md': { max: '767px' }, // For screens smaller than 768px
        'max-lg': { max: '1023px' }, // For screens smaller than 1024px
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      const colors = theme("colors");
      const cssVars = {};

      // Iterate through colors and generate CSS variables
      Object.keys(colors).forEach((color) => {
        const value = colors[color];
        if (typeof value === "object" && value !== null) {
          Object.keys(value).forEach((shade) => {
            cssVars[`--tw-color-${color}-${shade}`] = value[shade];
          });
        } else {
          cssVars[`--tw-color-${color}`] = value;
        }
      });

      // Add variables to :root
      addBase({
        ":root": cssVars,
      });
    }),
  ],
};
