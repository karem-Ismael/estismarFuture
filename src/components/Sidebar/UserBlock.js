/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 * User Block Component
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { useHistory } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";

import { NotificationManager } from "react-notifications";
// redux action
import { logoutUserFromFirebase, logoutUserFromDashboard } from "actions";

// intl messages
import IntlMessages from "util/IntlMessages";
import { LogoutMutation } from "gql/mutations/Authentication.mutations.gql";
import SupportPage from "../Support/Support";

class UserBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDropdownMenu: false,
      isSupportModal: false,
    };
  }

  /**
   * Logout User
   */
  logoutUser() {
    this.props.logoutUserFromFirebase();
  }

  /**
   * Toggle User Dropdown Menu
   */
  toggleUserDropdownMenu() {
    this.setState({ userDropdownMenu: !this.state.userDropdownMenu });
  }

  /**
   * Open Support Modal
   */
  openSupportModal() {
    this.setState({ isSupportModal: true });
  }

  /**
   * On Close Support Page
   */
  onCloseSupportPage() {
    this.setState({ isSupportModal: false });
  }

  /**
   * On Submit Support Page
   */
  onSubmitSupport() {
    this.setState({ isSupportModal: false });
    NotificationManager.success("Message has been sent successfully!");
  }

  render() {
    return (
      <div className="top-sidebar">
        <div className="sidebar-user-block">
          <Dropdown
            isOpen={this.state.userDropdownMenu}
            toggle={() => this.toggleUserDropdownMenu()}
            className="rct-dropdown"
          >
            <DropdownToggle tag="div" className="d-flex align-items-center">
              <div className="">
                {/* <img
                  src={require("assets/img/appLogo.png")}
                  alt="user profile"
                  className="img-fluid"
                  width="50"
                  height="90"
                /> */}
              </div>
              <div className="user-info p-1">
                <i className="zmdi zmdi-settings"></i>
                <span className="user-name ml-3">
                  <IntlMessages id="options" />
                </span>
                <i className="zmdi zmdi-chevron-down dropdown-icon mx-4"></i>
              </div>
            </DropdownToggle>
            <DropdownMenu>
              <ul className="list-unstyled mb-0">
                <Logout />
              </ul>
            </DropdownMenu>
          </Dropdown>
        </div>
        <SupportPage
          isOpen={this.state.isSupportModal}
          onCloseSupportPage={() => this.onCloseSupportPage()}
          onSubmit={() => this.onSubmitSupport()}
        />
      </div>
    );
  }
}
function Logout() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [logoutDashboard] = useMutation(LogoutMutation);
  const { user } = useSelector((state) => state.authUser);

  const logoutUser = () => {
    logoutDashboard({ variables: { clientMutationId: user.token } })
      .then(() => {
        localStorage.clear();
        history.push("/signin");
      })
      .catch(() => history.push("/signin"))
      .finally(() => {
        dispatch(logoutUserFromDashboard());
        localStorage.clear();
        history.push("/signin");
      });
  };

  return (
    <li className="border-top" onClick={() => logoutUser()}>
      <a href="#">
        <i className="zmdi zmdi-power text-danger mr-3"></i>
        <span>
          <IntlMessages id="widgets.logOut" />
        </span>
      </a>
    </li>
  );
}

UserBlock.propTypes = {
  logoutUserFromFirebase: PropTypes.func,
};

// map state to props
const mapStateToProps = ({ settings }) => settings;

export default connect(mapStateToProps, {
  logoutUserFromFirebase,
})(UserBlock);
