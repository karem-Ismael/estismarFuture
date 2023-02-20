/**
 * App Light Theme
 */
import { createMuiTheme } from "@material-ui/core/styles";
import AppConfig from "Constants/AppConfig";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: AppConfig.themeColors.secondary,
    },
    secondary: {
      main: AppConfig.themeColors.primary,
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
});

export default theme;
