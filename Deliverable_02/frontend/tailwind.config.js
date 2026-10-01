/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f5e8d3",
        cardbg: "#fffaf0",
        ink: "#3a2415",
        inksoft: "#6b5645",
        border: "#e3d2ac",
        rust: "#b5451e",
        rustdark: "#8c3313",
        gold: "#d9a227",
        olive: "#74712e",
        error: "#a62b1f",
      },
      fontFamily: {
        // These replace Tailwind's default font stacks entirely (see
        // index.css @layer base) — no default Tailwind or browser font
        // is left active anywhere on the site.
        heading: ["Georgia", "Times New Roman", "serif"],
        body: ["Trebuchet MS", "Segoe UI", "Verdana", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};
