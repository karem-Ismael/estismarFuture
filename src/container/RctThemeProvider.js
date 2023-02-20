/**
 * Rct Theme Provider
 */
import React, { Component, Fragment } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";

// App locale
import PropTypes from "prop-types";
import { translationMessages } from "../translations/i18n";

// themes
import primaryTheme from "./themes/primaryTheme";
import darkTheme from "./themes/darkTheme";
import secondaryTheme from "./themes/secondaryTheme";
import warningTheme from "./themes/warningTheme";
import dangerTheme from "./themes/dangerTheme";
import infoTheme from "./themes/infoTheme";
import successTheme from "./themes/successTheme";

class RctThemeProvider extends Component {
  render() {
    const { darkMode, rtlLayout, activeTheme, children, locale } = this.props;

    // theme changes
    let theme = "";
    switch (activeTheme.id) {
      case 1:
        theme = primaryTheme;
        break;
      case 2:
        theme = secondaryTheme;
        break;
      case 3:
        theme = warningTheme;
        break;
      case 4:
        theme = infoTheme;
        break;
      case 5:
        theme = dangerTheme;
        break;
      case 6:
        theme = successTheme;
        break;
      default:
        break;
    }

    if (darkMode) {
      theme = darkTheme;
    }

    if (rtlLayout) {
      theme.direction = "rtl";
    } else {
      theme.direction = "ltr";
    }
    return (
      <MuiThemeProvider theme={theme}>
        <IntlProvider
          locale={locale?.locale || "en"}
          messages={translationMessages[locale?.locale || "en"]}
        >
          <>{children}</>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}
RctThemeProvider.propTypes = {
  darkMode: PropTypes.bool,
  rtlLayout: PropTypes.any,
  activeTheme: PropTypes.object,
  children: PropTypes.array,
  locale: PropTypes.object,
};
// map state to props
const mapStateToProps = ({ settings }) => settings;

export default connect(mapStateToProps)(RctThemeProvider);
