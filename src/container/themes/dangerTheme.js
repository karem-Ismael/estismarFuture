/**
 * App Danger Theme
 */
import { createMuiTheme } from "@material-ui/core/styles";
import AppConfig from "Constants/AppConfig";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: AppConfig.themeColors.danger,
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
      main: AppConfig.themeColors.primary,
    },
  },
});

export default theme;
