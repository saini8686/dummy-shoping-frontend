export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      lineHeight: {
        150: "164%",
      },
      colors: {
        green_100: "#53B175",
        green_900: "#01BE62",
        black_100: "#181725",
        black_200: "#010101",
        grey_100: "#F2F3F1",
        grey_200: "#7C7C7C",
        grey_200: "#E2E2E2",
        yellow_200: "#FEF700",
        red_100: "#FFE8E8",
        red_200: "#FFE8E8",
        red_900: "#FF3131",
      },
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
