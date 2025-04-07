export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      lineHeight: {
        100: "100%",
      },
      shadow: {
        low_black: "0px 4px 4px 0px #B3B3B340",
      },
    },
  },
  plugins: [],
};
