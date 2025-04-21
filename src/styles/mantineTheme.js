import { createTheme, DEFAULT_THEME } from "@mantine/core";

export const theme = createTheme({
  fontFamily: `Montserrat, ${DEFAULT_THEME.fontFamily}`,
  headings: {
    fontFamily: `Canela, ${DEFAULT_THEME.fontFamily}`,
  },
  primaryColor: "licorice",
  colors: {
    licorice: [
      "#f6f4f4",
      "#e6e6e6",
      "#cbcaca",
      "#b2abad",
      "#9d9194",
      "#908084",
      "#5F454B",
      "#473338",
      "#3B2B2F",
      "#231A1C",
    ],
  },
});
