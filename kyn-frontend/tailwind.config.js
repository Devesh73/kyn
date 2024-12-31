/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Add custom scrollbar styles here
      scrollbar: {
        DEFAULT: {
          track: "bg-purple-100",
          thumb: "bg-purple-600",
          size: "thin",
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
