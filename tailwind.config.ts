import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default <Partial<Config>>{
  theme: {
    darkMode: "class",
    fontFamily: {
      sans: ["'Noto Sans'", ...defaultTheme.fontFamily.sans],
      serif: ["'Noto Serif'", ...defaultTheme.fontFamily.serif],
    },
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        hero: `
          linear-gradient(114.86deg, #2D0936 14.71%, #170312 78.23%),
          url('/books4.jpg')`,
      },
      backgroundSize: {
        hero: "400px, 100%",
      },
      colors: {
        "carrot-orange": {
          50: "#fef9ec",
          100: "#fbefca",
          200: "#f7de90",
          300: "#f4c755",
          400: "#f1b02e",
          500: "#ea9219",
          600: "#cf6d10",
          700: "#ac4c11",
          800: "#8c3c14",
          900: "#733114",
          950: "#421806",
        },
      },
    },
  },
};
