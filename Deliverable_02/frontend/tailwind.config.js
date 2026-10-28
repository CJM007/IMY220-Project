/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4ECD8",
        paperdark: "#1E1A14",
        cardbg: "#FBF6EA",
        cardbgdark: "#2A251D",
        ink: "#2E2419",
        inkdark: "#EDE4D3",
        inksoft: "#6B5E4C",
        inksoftdark: "#B8A98C",
        border: "#D8C9A3",
        borderdark: "#45392A",
        rust: "#C4654A",
        rustdark: "#8F4530",
        gold: "#B08A3E",
        olive: "#7D8C5C",
        error: "#A33B2B",
      },
      fontFamily: {
        heading: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Trebuchet MS", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
