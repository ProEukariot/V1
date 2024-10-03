/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        royalBlue: "#3D52A0",
        skyBlue: "#7091E6",
        softLavender: "#8697C4",
        palePeriwinkle: "#ADBBDA",
        lightLilac: "#EDE8F5",
      },
    },
  },
  plugins: [],
};
