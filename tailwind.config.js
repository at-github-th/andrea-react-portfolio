
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0B1B2A",
          800: "#0E2435",
          700: "#163047",
          600: "#1B3B57",
          glow: "#58F3DE"
        }
      },
      boxShadow: {
        glow: "0 0 25px rgba(88,243,222,0.35)"
      }
    }
  },
  plugins: []
}
