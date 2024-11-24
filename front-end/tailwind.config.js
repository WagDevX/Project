/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#07a776",
        secondary: "#1E2044",
      },
    },
  },
  plugins: [],
};
