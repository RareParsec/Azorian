import type { Config } from "tailwindcss";

export default {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFF",
        secondary: "#fcfbfc",
        active: "#f1f1f3",

        blackText: "#2D2D2D",
      },
    },
  },
  plugins: [],
} satisfies Config;
