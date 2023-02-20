/* eslint-disable  */
/**
 * Theme Options
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Scrollbars } from "react-custom-scrollbars";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import AppConfig from "constants/AppConfig";

// redux actions
import {
  toggleSidebarImage,
  setSidebarBgImageAction,
  miniSidebarAction,
  darkModeAction,
  boxLayoutAction,
  rtlLayoutAction,
  changeThemeColor,
  toggleDarkSidebar,
} from "actions";

// intl messages
import IntlMessages from "util/IntlMessages";
import AgencyLayoutBgProvider from "./AgencyLayoutBgProvider";

class ThemeOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switched: false,
      themeOptionPanelOpen: false,
    };
  }

  componentDidMount() {
    const { darkMode, boxLayout, rtlLayout, miniSidebar } = this.props;
    if (darkMode) {
      this.darkModeHanlder(true);
    }
    if (boxLayout) {
      this.boxLayoutHanlder(true);
    }
    if (rtlLayout) {
      this.rtlLayoutHanlder(true);
    }
    if (miniSidebar) {
      this.miniSidebarHanlder(true);
    }
  }

  /**
   * Set Sidebar Background Image
   */
  setSidebarBgImage(sidebarImage) {
    this.props.setSidebarBgImageAction(sidebarImage);
  }

  /**
   * Function To Toggle Theme Option Panel
   */
  toggleThemePanel() {
    this.setState({
      themeOptionPanelOpen: !this.state.themeOptionPanelOpen,
    });
  }

  /**
   * Mini Sidebar Event Handler
   */
  miniSidebarHanlder(isTrue) {
    if (isTrue) {
      document.body.classList.add("mini-sidebar");
    } else {
      document.body.classList.remove("mini-sidebar");
    }
    setTimeout(() => {
      this.props.miniSidebarAction(isTrue);
    }, 100);
  }

  /**
   * Dark Mode Event Hanlder
   * Use To Enable Dark Mode
   * @param {*object} event
   */
  darkModeHanlder(isTrue) {
    if (isTrue) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    this.props.darkModeAction(isTrue);
  }

  /**
   * Box Layout Event Hanlder
   * Use To Enable Boxed Layout
   * @param {*object} event
   */
  boxLayoutHanlder(isTrue) {
    if (isTrue) {
      document.body.classList.add("boxed-layout");
    } else {
      document.body.classList.remove("boxed-layout");
    }
    this.props.boxLayoutAction(isTrue);
  }

  /**
   * Rtl Layout Event Hanlder
   * Use to Enable rtl Layout
   * @param {*object} event
   */
  rtlLayoutHanlder(isTrue) {
    const root = document.getElementsByTagName("html")[0];
    if (isTrue) {
      root.setAttribute("dir", "rtl");
      document.body.classList.add("rtl");
    } else {
      root.setAttribute("dir", "ltr");
      document.body.classList.remove("rtl");
    }
    this.props.rtlLayoutAction(isTrue);
  }

  /**
   * Change Theme Color Event Handler
   * @param {*object} theme
   */
  changeThemeColor(theme) {
    const { themes } = this.props;
    for (const appTheme of themes) {
      if (document.body.classList.contains(`theme-${appTheme.name}`)) {
        document.body.classList.remove(`theme-${appTheme.name}`);
      }
    }
    document.body.classList.add(`theme-${theme.name}`);
    this.darkModeHanlder(false);
    this.props.changeThemeColor(theme);
  }

  render() {
    const {
      themes,
      activeTheme,
      enableSidebarBackgroundImage,
      sidebarBackgroundImages,
      selectedSidebarImage,
      miniSidebar,
      darkMode,
      boxLayout,
      rtlLayout,
      navCollapsed,
      isDarkSidenav,
    } = this.props;
    return (
      <div className="fixed-plugin">
        {AppConfig.enableThemeOptions && (
          <Dropdown isOpen={this.state.themeOptionPanelOpen} toggle={() => this.toggleThemePanel()}>
            <DropdownToggle className="bg-primary">
              <Tooltip title="Theme Options" placement="left">
                <i className="zmdi zmdi-settings font-2x tour-step-6 spin-icon" />
              </Tooltip>
            </DropdownToggle>
            <DropdownMenu>
              <Scrollbars
                className="rct-scroll"
                autoHeight
                autoHeightMin={100}
                autoHeightMax={530}
                autoHide
                autoHideDuration={100}
              >
                <ul className="list-unstyled text-center mb-0">
                  <li className="header-title mb-10">
                    <IntlMessages id="themeOptions.themeColor" />
                  </li>
                  <li className="adjustments-line mb-10">
                    <a href="#">
                      <div>
                        {themes.map((theme, key) => (
                          <Tooltip title={theme.name} placement="top" key={JSON.stringify(key)}>
                            <img
                              onClick={() => this.changeThemeColor(theme)}
                              src={require(`assets/img/${theme.name}-theme.png`)}
                              alt="theme"
                              className={classnames("img-fluid mr-5", {
                                active: theme.id === activeTheme.id,
                              })}
                            />
                          </Tooltip>
                        ))}
                      </div>
                    </a>
                  </li>
                  <li className="header-title sidebar-overlay">
                    <IntlMessages id="themeOptions.sidebarOverlay" />
                  </li>
                  <li className="sidebar-color">
                    <IntlMessages id="themeOptions.sidebarLight" />
                    <FormControlLabel
                      className="m-0"
                      control={
                        <Switch
                          checked={isDarkSidenav}
                          onClick={() => this.props.toggleDarkSidebar()}
                          color="primary"
                          className="switch-btn"
                        />
                      }
                    />
                    <IntlMessages id="themeOptions.sidebarDark" />
                  </li>
                  <li className="header-title sidebar-img-check">
                    <FormControlLabel
                      className="m-0"
                      control={
                        <Switch
                          checked={enableSidebarBackgroundImage}
                          onClick={() => this.props.toggleSidebarImage()}
                          color="primary"
                          className="switch-btn"
                        />
                      }
                      label={<IntlMessages id="themeOptions.sidebarImage" />}
                    />
                  </li>
                  {enableSidebarBackgroundImage && (
                    <li className="background-img">
                      {sidebarBackgroundImages.map((sidebarImage, key) => (
                        <a
                          className={classnames("img-holder", {
                            active: selectedSidebarImage === sidebarImage,
                          })}
                          href="#"
                          key={JSON.stringify(key)}
                          onClick={() => this.setSidebarBgImage(sidebarImage)}
                        >
                          <img
                            src={sidebarImage}
                            alt="sidebar"
                            className="img-fluid"
                            width=""
                            height=""
                          />
                        </a>
                      ))}
                    </li>
                  )}
                </ul>
                <AgencyLayoutBgProvider />
                <ul className="list-unstyled mb-0 p-10 app-settings">
                  <li className="header-title mb-10">
                    <IntlMessages id="themeOptions.appSettings" />
                  </li>
                  <li className="header-title mini-sidebar-option">
                    <FormControlLabel
                      control={
                        <Switch
                          disabled={navCollapsed}
                          checked={miniSidebar}
                          onChange={e => this.miniSidebarHanlder(e.target.checked)}
                          className="switch-btn"
                        />
                      }
                      label={<IntlMessages id="themeOptions.miniSidebar" />}
                      className="m-0"
                    />
                  </li>
                  <li className="header-title box-layout-option">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={boxLayout}
                          onChange={e => this.boxLayoutHanlder(e.target.checked)}
                          className="switch-btn"
                        />
                      }
                      label={<IntlMessages id="themeOptions.boxLayout" />}
                      className="m-0"
                    />
                  </li>
                  <li className="header-title">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={rtlLayout}
                          onChange={e => this.rtlLayoutHanlder(e.target.checked)}
                          className="switch-btn"
                        />
                      }
                      label={<IntlMessages id="themeOptions.rtlLayout" />}
                      className="m-0"
                    />
                  </li>
                  <li className="header-title">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={darkMode}
                          onChange={e => this.darkModeHanlder(e.target.checked)}
                          className="switch-btn"
                        />
                      }
                      label={<IntlMessages id="themeOptions.darkMode" />}
                      className="m-0"
                    />
                  </li>
                </ul>
              </Scrollbars>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ settings }) => settings;

ThemeOptions.propTypes = {
  darkMode: PropTypes.any,
  boxLayout: PropTypes.any,
  rtlLayout: PropTypes.any,
  miniSidebar: PropTypes.any,
  themes: PropTypes.any,
  activeTheme: PropTypes.any,
  enableSidebarBackgroundImage: PropTypes.any,
  sidebarBackgroundImages: PropTypes.any,
  selectedSidebarImage: PropTypes.any,
  miniSidebar: PropTypes.any,
  darkMode: PropTypes.any,
  boxLayout: PropTypes.any,
  rtlLayout: PropTypes.any,
  navCollapsed: PropTypes.any,
  isDarkSidenav: PropTypes.any,
};

export default connect(
  mapStateToProps,
  {
    toggleSidebarImage,
    setSidebarBgImageAction,
    miniSidebarAction,
    darkModeAction,
    boxLayoutAction,
    rtlLayoutAction,
    changeThemeColor,
    toggleDarkSidebar,
  },
)(ThemeOptions);
