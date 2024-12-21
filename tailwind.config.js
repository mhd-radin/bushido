/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [".//**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
        const colors = theme('colors');
        const cssVars = {};
  
        // Iterate through colors and generate CSS variables
        Object.keys(colors).forEach((color) => {
          const value = colors[color];
          if (typeof value === 'object' && value !== null) {
            Object.keys(value).forEach((shade) => {
              cssVars[`--tw-color-${color}-${shade}`] = value[shade];
            });
          } else {
            cssVars[`--tw-color-${color}`] = value;
          }
        });
  
        // Add variables to :root
        addBase({
          ':root': cssVars,
        });
      }),
    ],
};
