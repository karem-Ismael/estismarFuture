/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 * App Header
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link, withRouter } from "react-router-dom";
import screenfull from "screenfull";
import Tooltip from "@material-ui/core/Tooltip";
import MenuIcon from "@material-ui/icons/Menu";

// actions
import { collapsedSidebarAction } from "Actions";

// helpers
// import { getAppLayout } from "Helpers/helpers";

// intl messages
// import IntlMessages from "Util/IntlMessages";

// components
// import Notifications from "./Notifications";
import ChatSidebar from "./ChatSidebar";
import DashboardOverlay from "../DashboardOverlay/DashboardOverlay";
import LanguageProvider from "./LanguageProvider";
import SearchForm from "./SearchForm";
import QuickLinks from "./QuickLinks";
import MobileSearchForm from "./MobileSearchForm";
// import Cart from "./Cart";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customizer: false,
      isMobileSearchFormVisible: false,
    };
  }

  // function to change the state of collapsed sidebar
  onToggleNavCollapsed = (event) => {
    const val = !this.props.navCollapsed;
    this.props.collapsedSidebarAction(val);
  };

  // open dashboard overlay
  openDashboardOverlay(e) {
    const el = document.getElementsByClassName("dashboard-overlay")[0];
    el.classList.toggle("d-none");
    el.classList.toggle("show");
    if (el.classList.contains("show")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    e.preventDefault();
  }

  // close dashboard overlay
  closeDashboardOverlay() {
    const e = document.getElementsByClassName("dashboard-overlay")[0];
    e.classList.remove("show");
    e.classList.add("d-none");
    document.body.style.overflow = "";
  }

  // toggle screen full
  toggleScreenFull() {
    screenfull.toggle();
  }

  // mobile search form
  openMobileSearchForm() {
    this.setState({ isMobileSearchFormVisible: true });
  }

  render() {
    const { isMobileSearchFormVisible } = this.state;
    const { horizontalMenu, agencyMenu, location } = this.props;
    return (
      <AppBar position="static" className="rct-header">
        <Toolbar className="d-flex justify-content-between w-100 pl-0">
          <div className="d-flex align-items-center">
            {(horizontalMenu || agencyMenu) && (
              <div className="site-logo">
                <Link to="/" className="logo-mini">
                  <img
                    src={require("Assets/img/appLogo.png")}
                    className="mr-15"
                    alt="site logo"
                    width="35"
                    height="35"
                  />
                </Link>
                <Link to="/" className="logo-normal">
                  <img
                    src={require("Assets/img/appLogoText.png")}
                    className="img-fluid"
                    alt="site-logo"
                    width="67"
                    height="17"
                  />
                </Link>
              </div>
            )}
            {!agencyMenu && (
              <ul className="list-inline mb-0 navbar-left">
                {!horizontalMenu ? (
                  <li className="list-inline-item" onClick={(e) => this.onToggleNavCollapsed(e)}>
                    <Tooltip title="Sidebar Toggle" placement="bottom">
                      <IconButton
                        color="inherit"
                        mini="true"
                        aria-label="Menu"
                        className="humburger p-0"
                      >
                        <MenuIcon />
                      </IconButton>
                    </Tooltip>
                  </li>
                ) : (
                  <li className="list-inline-item">
                    <Tooltip title="Sidebar Toggle" placement="bottom">
                      <IconButton
                        color="inherit"
                        aria-label="Menu"
                        className="humburger p-0"
                        component={Link}
                        to="/"
                      >
                        <i className="ti-layout-sidebar-left" />
                      </IconButton>
                    </Tooltip>
                  </li>
                )}
                {/* {!horizontalMenu && <QuickLinks />} */}
                <li className="list-inline-item search-icon d-none">
                  {/* <SearchForm /> */}
                  <IconButton
                    mini="true"
                    className="search-icon-btn"
                    onClick={() => this.openMobileSearchForm()}
                  >
                    <i className="zmdi zmdi-search" />
                  </IconButton>
                  <MobileSearchForm
                    isOpen={isMobileSearchFormVisible}
                    onClose={() => this.setState({ isMobileSearchFormVisible: false })}
                  />
                </li>
              </ul>
            )}
          </div>
          <ul className="navbar-right list-inline mb-0">
            {/* <li className="list-inline-item summary-icon">
              <Tooltip title="Summary" placement="bottom">
                <a
                  href="#"
                  className="header-icon tour-step-3"
                  onClick={e => this.openDashboardOverlay(e)}
                >
                  <i className="zmdi zmdi-info-outline" />
                </a>
              </Tooltip>
            </li> */}
            {/* {!horizontalMenu && (
              <li className="list-inline-item">
                <Tooltip title="Upgrade" placement="bottom">
                  <Button
                    component={Link}
                    to={`/${getAppLayout(location)}/pages/pricing`}
                    variant="contained"
                    className="upgrade-btn tour-step-4 text-white"
                    color="primary"
                  >
                    <IntlMessages id="widgets.upgrade" />
                  </Button>
                </Tooltip>
              </li>
            )} */}
            <QuickLinks />
            <LanguageProvider />
            {/* <Notifications /> */}
            {/* <Cart /> */}
            {/* <li className="list-inline-item setting-icon">
              <Tooltip title="Chat" placement="bottom">
                <IconButton
                  aria-label="settings"
                  onClick={() => this.setState({ customizer: true })}
                >
                  <i className="zmdi zmdi-comment" />
                </IconButton>
              </Tooltip>
            </li> */}
            <li className="list-inline-item">
              <Tooltip title="Full Screen" placement="bottom">
                <IconButton aria-label="settings" onClick={() => this.toggleScreenFull()}>
                  <i className="zmdi zmdi-crop-free" />
                </IconButton>
              </Tooltip>
            </li>
          </ul>
          <Drawer
            anchor="right"
            open={this.state.customizer}
            onClose={() => this.setState({ customizer: false })}
          >
            <ChatSidebar />
          </Drawer>
        </Toolbar>
        <DashboardOverlay onClose={() => this.closeDashboardOverlay()} />
      </AppBar>
    );
  }
}

Header.propTypes = {
  navCollapsed: PropTypes.bool,
  horizontalMenu: PropTypes.bool,
  agencyMenu: PropTypes.bool,
  collapsedSidebarAction: PropTypes.func,
  location: PropTypes.object,
};

// map state to props
const mapStateToProps = ({ settings }) => settings;

export default withRouter(
  connect(mapStateToProps, {
    collapsedSidebarAction,
  })(Header),
);
