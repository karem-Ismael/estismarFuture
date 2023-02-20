/* eslint-disable prettier/prettier */
/**
 * App Light Theme
 */
import { createMuiTheme } from "@material-ui/core/styles";
import AppConfig from "Constants/AppConfig";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: AppConfig.themeColors.primary,
    },
    secondary: {
      main: AppConfig.themeColors.warning,
    },
  },
  overrides: {
    MuiFormLabel: {
      asterisk: {
        color: "#db3131",
        "&$error": {
          color: "#db3131",
        },
      },
    },
  },
  typography: {
    useNextVariants: true,
    // suppressDeprecationWarnings: true,
    // Use the system font instead of the default Roboto font.
    fontFamily: ["Almarai", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    htmlFontSize: 16,
    h2: {
      fontSize: 21,
      fontWeight: 400,
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
});

export default theme;
