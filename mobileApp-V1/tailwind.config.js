/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgba(6, 148, 148, 1)",
          50: "rgba(230, 244, 244, 1)",
          100: "rgba(178, 222, 222, 1)",
          200: "rgba(140, 206, 206, 1)",
          400: "rgba(56, 169, 169, 1)",
          600: "rgba(5, 135, 135, 1)",
          800: "rgba(3, 81, 81, 1)",
          900: "rgba(3, 62, 62, 1)",
        },
        secondary: {
          DEFAULT: "rgba(7, 168, 114, 1)",
          50: "rgba(230, 246, 241, 1)",
          100: "rgba(178, 228, 211, 1)",
          200: "rgba(141, 215, 190, 1)",
          800: "rgba(4, 92, 63, 1)",
        },
        accents: {
          DEFAULT: "rgba(151, 11, 1, 1)",
          50: "rgba(245, 231, 230, 1)",
          100: "rgba(223, 179, 176, 1)",
          200: "rgba(207, 143, 138, 1)",
          800: "rgba(83, 6, 1, 1)",
        },
        warning: {
          DEFAULT: "rgba(255, 165, 0, 1)",
          50: "rgba(255, 246, 230, 1)",
          100: "rgba(255, 227, 176, 1)",
          200: "rgba(255, 214, 138, 1)",
          800: "rgba(140, 91, 0, 1)",
        },
        neutrals: {
          DEFAULT: "rgba(255, 255, 255, 1)",
          "neutrals-n20": "rgba(247, 247, 247, 1)",
          "neutrals-n40": "rgba(228, 228, 228, 1)",
          "neutrals-n100": "rgba(145, 145, 145, 1)",
          "neutrals-n300": "rgba(120, 120, 120, 1)",
          "neutrals-n500": "rgba(98, 98, 98, 1)",
          "surface-information": "rgba(255, 214, 138, 1)",
          "neutrals-n700": "rgba(73, 73, 73, 1)",
          "neutrals-n900": "rgba(51, 51, 51, 1)",
        },
      },
      fontFamily: {
        lblack: ["Lato-Black", "sans-serif"],
        lbold: ["Lato-Bold", "sans-serif"],
        llight: ["Lato-Light", "sans-serif"],
        lregular: ["Lato-Regular", "sans-serif"],
        lthin: ["Lato-Thin", "sans-serif"],
        rregular: ["Roboto-Regular", "sans-serif"],
        rthin: ["Roboto-Thin", "sans-serif"],
        rmedium: ["Roboto-Medium", "sans-serif"],
        rlight: ["Roboto-Light", "sans-serif"],
        rbold: ["Roboto-Bold", "sans-serif"],
        rblack: ["Roboto-Black", "sans-serif"],
      },
    },
  },

  plugins: [],
};
