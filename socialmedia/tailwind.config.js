/** @type {import('tailwindcss').Config} */
import scrollbar from "tailwind-scrollbar-hide";
export default {
  important: true,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [scrollbar],
};
