/* eslint-disable prettier/prettier */
/**
 * Horizontal App
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, withRouter, Redirect } from "react-router-dom";

// app default layout
import RctCRMLayout from "../components/RctCRMLayout";

// router service
import routerService from "../services/_routerService";

class CRMLayout extends Component {
  render() {
    const { match, location } = this.props;
    if (location.pathname === "/es") {
      return <Redirect to="/es/dashboard" />;
    }
    if (location.pathname === "/es/dashboard") {
      return <Redirect to="/es/dashboard/bookings" />;
    }
    return (
      <RctCRMLayout>
        {routerService &&
          routerService.map((route, key) => (
            <Route
              key={JSON.stringify(key)}
              path={`${match.url}/${route.path}`}
              component={route.component}
            />
          ))}
      </RctCRMLayout>
    );
  }
}

CRMLayout.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
};

export default withRouter(CRMLayout);
