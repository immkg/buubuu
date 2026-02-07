/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}"
    ],
    theme: {
      extend: {
        colors: {
          blush: "#f8b4c4",
          rose: "#f43f5e",
          cream: "#fff5ec",
          wine: "#7f1d1d"
        },
        fontFamily: {
          cozy: ["'Poppins'", "sans-serif"],
          love: ["'Playfair Display'", "serif"]
        }
      },
    },
    plugins: [],
  }
  