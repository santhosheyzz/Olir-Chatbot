const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const tailwindNesting = require('tailwindcss/nesting');

module.exports = {
  plugins: [
    tailwindNesting,
    tailwindcss,
    autoprefixer
  ]
};
