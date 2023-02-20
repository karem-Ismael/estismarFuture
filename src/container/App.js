/* eslint-disable prettier/prettier */
/**
 * App.js Layout Start Here
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
// rct theme provider
import {
  AsyncSessionLockScreenComponent,
  AsyncSessionForgotPasswordComponent,
  AsyncSessionPage404Component,
  AsyncSessionPage500Component,
  AsyncTermsConditionComponent,
} from "Components/AsyncComponent/AsyncComponent";
import RctThemeProvider from "./RctThemeProvider";
import RctDefaultLayout from "./DefaultLayout";
import CRMLayout from "./CRMLayout";
import SignIn from "./SignIn";

const InitialPath = ({ component: Component, authUser, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authUser ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

InitialPath.propTypes = {
  component: PropTypes.any,
  authUser: PropTypes.object,
  location: PropTypes.object,
};

class App extends Component {
  render() {
    const { location, match, user } = this.props;
    if (location.pathname === "/") {
      if (user === null) {
        if (window.location.href.includes("?from=")) {
          return <Redirect to={`/signin?from=${window.location.pathname}`} />;
        }
        return <Redirect to="/signin" />;
      }
      return <Redirect to="/cw" />;
    }
    return (
      <RctThemeProvider>
        <NotificationContainer />
        <InitialPath path={`${match.url}app`} authUser={user} component={RctDefaultLayout} />
        {/* AppSignIn is Original signin */}
        <Route path="/signin" component={SignIn} />
        {user ? (
          <Route path="/es" component={CRMLayout} />
        ) : (
          <Route path="/cw" component={SignIn} />
        )}

        {/* <Route path="/horizontal" component={HorizontalLayout} />
        <Route path="/agency" component={AgencyLayout} />
        <Route path="/boxed" component={RctBoxedLayout} />
        <Route path="/session/login" component={AsyncSessionLoginComponent} />
        <Route path="/session/register" component={AsyncSessionRegisterComponent} /> */}
        <Route path="/session/lock-screen" component={AsyncSessionLockScreenComponent} />
        <Route path="/session/forgot-password" component={AsyncSessionForgotPasswordComponent} />
        <Route path="/session/404" component={AsyncSessionPage404Component} />
        <Route path="/session/500" component={AsyncSessionPage500Component} />
        <Route path="/terms-condition" component={AsyncTermsConditionComponent} />
        {/* <Router path="*" component={AsyncSessionPage404Component} /> */}
      </RctThemeProvider>
    );
  }
}

App.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  user: PropTypes.object,
};

// map state to props
const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(mapStateToProps)(App);
