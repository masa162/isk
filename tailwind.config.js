/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'max-lg': {'max': '1023px'},
      },
    },
  },
  plugins: [],
}
