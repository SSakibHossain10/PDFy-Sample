// import container_queries from "@tailwindcss/container-queries";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import { blackColors, whiteColors } from "./src/constants/colors";
import { createThemes } from "./src/lib/tw-colors";

const config: Config = {
  // content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      maxWidth: {
        screen: "100vw",
      },
      spacing: {
        "0.25": "0.063rem", // 1px
        "0.75": "0.188rem", // 3px
        "1.25": "0.313rem", // 5px
        "1.75": "0.438rem", // 7px
        "13": "3.25rem", // 52px
        "15": "3.75rem", // 60px
      },
      transitionTimingFunction: {
        // "out-jump-bit": "cubic-bezier(0, 0, 0.2, 2)",
      },
      blur: {
        xs: "2px",
      },
      colors: {
        primary: colors.teal,
        forground: "white",
        background: "black",
        white: whiteColors,
        black: blackColors,
      },
      screens: {
        sx: {
          max: "639px",
        },
      },
    },
    positionArea: {
      "bottom-right": "bottom right",
      bottom: "bottom",
      top: "top",
      none: "none",
    },
    anchorName: {
      // none: "none",
    },
    positionAnchor: {
      "unset-important": "unset !important", //for unset for specific device based on media query
    },
    positionFallBacks: {
      "bottom-right": "bottom center, bottom left, center right, top right, top center, top left, left center",
      bottom: "top, right, left",
      none: "none",
    },
    backgroundGradiants: {
      "gr-multi-dark":
        "linear-gradient(var(--gradient-angle),  rgb(0 48 46 / 100%), rgb(0 8 34 / 100%), rgb(0 45 39 / 100%), rgb(0 11 47 / 100%))",
      "gr-multi-dark-revert":
        "linear-gradient(var(--gradient-angle), rgb(0 11 47 / 100%), rgb(0 45 39 / 100%), rgb(0 8 34 / 100%), rgb(0 48 46 / 100%))",
      "gr-multi-dark/30":
        "linear-gradient(var(--gradient-angle), rgb(0 11 47 / 30%), rgb(0 45 39 / 30%), rgb(0 8 34 / 30%), rgb(0 48 46 / 30%))",
    },
    writingMode: {
      "vertical-lr": "vertical-lr",
    },
  },
  darkMode: "class",
  plugins: [
    createThemes({
      dark: {
        ...colors,
        primary: colors.teal,
        forground: "white",
        background: "black",
        white: whiteColors,
        black: blackColors,
      },
      light: {
        ...colors,
        primary: {
          ...colors.teal,
          50: colors.teal[950],
          100: colors.teal[900],
          200: colors.teal[800],
          300: colors.teal[700],
          400: colors.teal[600],
          500: colors.teal[500],
          600: colors.teal[400],
          700: colors.teal[300],
          800: colors.teal[200],
          900: colors.teal[100],
          950: colors.teal[50],
        },
        forground: "black",
        background: "white",
        white: whiteColors,
        black: blackColors,
      },
    }),
    function ({ addVariant }) {
      // Custom variant for ::backdrop pseudo-element
      addVariant("top-layer-backdrop", "&::backdrop");
      addVariant("slider-thumb", "&::-webkit-slider-thumb");
      addVariant("@sx", "@media (max-width: 639px)");
      addVariant("@sm", "@container (width >= 40rem)");
      addVariant("@md", "@container (width >= 48rem)");
      addVariant("@lg", "@container (width >= 64rem)");
      addVariant("@xl", "@container (width >= 80rem)");
      addVariant("@2xl", "@container (width >= 96rem)");
      //   addVariant('hocus', ['&:hover', '&:focus'])
      //   addVariant('inverted-colors', '@media (inverted-colors: inverted)')
    },
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "position-area": (value) => ({
            positionArea: value,
          }),
        },
        { values: theme("positionArea") }
      );
      matchUtilities(
        {
          "anchor-name": (value) => ({
            anchorName: value,
          }),
        },
        { values: theme("anchorName") }
      );
      matchUtilities(
        {
          "position-anchor": (value) => ({
            positionAnchor: value,
          }),
        },
        { values: theme("positionAnchor") }
      );
      matchUtilities(
        {
          "position-fallbacks": (value) => ({
            positionTryFallbacks: value,
          }),
        },
        { values: theme("positionFallBacks") }
      );
      matchUtilities(
        {
          bg: (value) => ({
            "background-image": value,
          }),
        },
        { values: theme("backgroundGradiants") }
      );
      matchUtilities(
        {
          "writing-mode": (value) => ({
            writingMode: value,
          }),
        },
        { values: theme("writingMode") }
      );
    },
  ],
};
export default config;
