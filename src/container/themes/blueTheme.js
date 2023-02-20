/**
 * App Light Theme
 */
import { createMuiTheme } from "@material-ui/core/styles";
import AppConfig from "Constants/AppConfig";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: AppConfig.themeColors.info,
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
    secondary: {
      main: AppConfig.themeColors.warning,
    },
  },
});

export default theme;
