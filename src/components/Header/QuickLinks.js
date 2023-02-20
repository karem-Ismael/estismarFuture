/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/**
 * Quick Links
 */
import React from "react";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, Badge, Dropdown } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { Link, withRouter, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";

import { connect, useDispatch, useSelector } from "react-redux";

import { NotificationManager } from "react-notifications";
// redux action
import { logoutUserFromFirebase, logoutUserFromDashboard } from "actions";

// intl messages
import IntlMessages from "util/IntlMessages";
import { LogoutMutation } from "gql/mutations/Authentication.mutations.gql";
import Tooltip from "@material-ui/core/Tooltip";

// helpers
import { getAppLayout } from "Helpers/helpers";
import { useIntl } from "react-intl";
import { width } from "@amcharts/amcharts4/.internal/core/utils/Utils";

// intl messages

const QuickLinks = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { locale, formatMessage } = useIntl();
  const [logoutDashboard] = useMutation(LogoutMutation);
  const { user } = useSelector((state) => state.authUser);
  const localeStorage = localStorage.getItem("locale");

  const logoutUser = () => {
    logoutDashboard({ variables: { clientMutationId: user.token } })
      .then(() => {
        localStorage.clear();
        localStorage.setItem("locale", localeStorage);
        history.push("/signin");
      })
      .catch(() => history.push("/signin"))
      .finally(() => {
        dispatch(logoutUserFromDashboard());
        localStorage.clear();
        localStorage.setItem("locale", localeStorage);
        window.location.reload();
        history.push("/signin");
      });
  };
  return (
    <UncontrolledDropdown nav className="list-inline-item quciklink-dropdown tour-step-1">
      <DropdownToggle nav className="header-icon p-0">
        <Tooltip title={formatMessage({ id: "options" })} placement="bottom">
          <i className="zmdi zmdi-apps"></i>
        </Tooltip>
      </DropdownToggle>
      <DropdownMenu style={{ width: "fit-content", overflow: "hidden" }}>
        <div>
          <div className="dropdown-content p-1">
            {/* <div className="dropdown-top d-flex justify-content-between rounded-top bg-primary"> */}
            {/* <span className="text-white font-weight-bold">Quick Links</span> */}
            {/* <Badge color="warning">1 NEW</Badge> */}
            {/* </div> */}
            {/* list-unstyled mb-0 dropdown-list */}
            <ul>
              <li onClick={() => logoutUser()} onKeyDown={() => logoutUser()}>
                <a href="#">
                  <i className="zmdi zmdi-power text-danger mr-3"></i>
                  <span>
                    <IntlMessages id="widgets.logOut" />
                  </span>
                </a>
              </li>
            </ul>
            {/* <ul className="">
            <li>
              <Link to={`/${getAppLayout(location)}/pages/report`}>
                <i className="ti-notepad text-primary mr-10"></i>
                <IntlMessages id="sidebar.report" />
              </Link>
            </li>
            <li>
              <Link to={`/${getAppLayout(location)}/tables/data-table`}>
                <i className="ti-layout text-danger mr-10"></i>
                <IntlMessages id="sidebar.tables" />
              </Link>
            </li>
            <li>
              <Link to={`/${getAppLayout(location)}/users/user-management`}>
                <i className="ti-user text-success mr-10"></i>
                <IntlMessages id="sidebar.userManagement" />
              </Link>
            </li>
            <li>
              <Link to={`/${getAppLayout(location)}/ecommerce/invoice`}>
                <i className="text-info ti-agenda mr-10"></i>
                <IntlMessages id="sidebar.invoice" />
              </Link>
            </li>
            <li>
              <Link to={`/${getAppLayout(location)}/mail/folder/inbox`}>
                <i className="ti-email text-danger  mr-10"></i>
                <IntlMessages id="sidebar.inbox" />
              </Link>
            </li>
            <li>
              <Link to={`/${getAppLayout(location)}/calendar/basic`}>
                <i className="text-warning ti-calendar mr-10"></i>
                <IntlMessages id="sidebar.calendar" />
              </Link>
            </li>
          </ul> */}
          </div>
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default QuickLinks;
