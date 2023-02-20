/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unused-state */
/* eslint-disable prettier/prettier */
/**
 * Reactify Sidebar
 */
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { Scrollbars } from "react-custom-scrollbars";

// redux actions
import { collapsedSidebarAction } from "Actions";
import jwt_decode from "jwt-decode";

// components
import UserBlock from "./UserBlock";
import SidebarContent from "./SidebarContent";
import AgencySidebar from "../AgencyMenu/AgencySidebar";
import UserProfile from "./Profile";
import LogoImage from "../../assets/img/img-logo.png"

class Sidebar extends Component {
  UNSAFE_componentWillMount() {
    this.updateDimensions();
  }

  shouldComponentUpdate(nextProps) {
    const {
      enableSidebarBackgroundImage,
      selectedSidebarImage,
      isDarkSidenav,
      locale,
    } = this.props;
    if (
      enableSidebarBackgroundImage !== nextProps.enableSidebarBackgroundImage ||
      selectedSidebarImage !== nextProps.selectedSidebarImage ||
      isDarkSidenav !== nextProps.isDarkSidenav ||
      locale
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { windowWidth } = this.state;
    const { collapsedSidebar } = this.props;
    if (nextProps.location !== this.props.location) {
      if (windowWidth <= 1199) {
        this.props.collapsedSidebarAction(false);
      }
    }
  }

  updateDimensions = () => {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  };

  render() {
    const {
      enableSidebarBackgroundImage,
      selectedSidebarImage,
      isDarkSidenav,
      agencySidebar,
    } = this.props;

    return (
      <>
        <div
          className={classNames("rct-sidebar")}
          style={{
            backgroundImage: enableSidebarBackgroundImage ? `url(${selectedSidebarImage})` : "none",
          }}
        >
          <div
            className={classNames("rct-sidebar-content", {
              "sidebar-overlay-dark": isDarkSidenav,
              "sidebar-overlay-light": !isDarkSidenav,
            })}
          >
            <div className="site-logo d-flex justify-content-around">
              <Link to="/" className="logo-mini">
                <img
                  src={LogoImage}
                  className="mt-2"
                  alt="site logo"
                  width="55"
                  height="55"
                />
              </Link>
            </div>
            {/* <UserProfile /> */}

            <div className="rct-sidebar-wrap">
              <Scrollbars
                className="rct-scroll"
                autoHide
                autoHideDuration={100}
                style={{ height: "calc(100vh - 60px)" }}
              >
                <SidebarContent />
              </Scrollbars>
            </div>
          </div>
        </div>
      </>
    );
  }
}

// map state to props
const mapStateToProps = ({ settings }) => {
  const {
    enableSidebarBackgroundImage,
    selectedSidebarImage,
    collapsedSidebar,
    isDarkSidenav,
    locale,
  } = settings;
  return {
    enableSidebarBackgroundImage,
    selectedSidebarImage,
    collapsedSidebar,
    isDarkSidenav,
    locale,
  };
};

Sidebar.propTypes = {
  enableSidebarBackgroundImage: PropTypes.bool,
  selectedSidebarImage: PropTypes.any,
  isDarkSidenav: PropTypes.bool,
  locale: PropTypes.object,
  collapsedSidebar: PropTypes.func,
  collapsedSidebarAction: PropTypes.func,
  location: PropTypes.object,
  agencySidebar: PropTypes.any,
};

export default withRouter(connect(mapStateToProps, { collapsedSidebarAction })(Sidebar));
