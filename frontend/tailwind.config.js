/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C8963E",
        "primary-dark": "#A67830",
        "primary-light": "#E8B86D",
        cream: "#FDF6EE",
        "cream-dark": "#F5E8D4",
        navy: "#1C2B4A",
        "navy-light": "#2E4070",
        gold: "#D4A843",
        "gold-light": "#F0C96A",
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern": "linear-gradient(135deg, rgba(28,43,74,0.85) 0%, rgba(28,43,74,0.6) 50%, rgba(200,150,62,0.3) 100%)",
      },
    },
  },
  plugins: [],
};
