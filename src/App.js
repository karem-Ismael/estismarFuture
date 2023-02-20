/* eslint-disable prettier/prettier */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/** Main App */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Provider, useDispatch } from "react-redux";
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import Rememberer, { useRemember } from "react-remember";
import { PersistGate } from "redux-persist/integration/react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  withRouter,
  useLocation,
} from "react-router-dom";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { signUserIn } from "Actions/AuthActions";
import { rtlLayoutAction, setLanguage } from "actions";
// css
import "./lib/reactifyCss";
import "react-intl-tel-input/dist/main.css";
// app component
import App from "./container/App";
import "./assets/scss/override.scss";

import store, { persistor } from "./store";
import { SnackbarProvider } from "notistack";

const MainApp = () => (
  <Remember>
    <ApolloProApp />
  </Remember>
);

function Remember({ children }) {
  const defaults = JSON.parse(localStorage.getItem("state"));
  return (
    <Provider store={store}>
      <Rememberer
        defaults={{
          rememberMe: defaults?.remember || false,
          user: defaults?.remember || {},
          "persist:root": defaults ? ["persist:root"] : "",
          locale: "ar",
        }}
      >
        {children}
      </Rememberer>
    </Provider>
  );
}
const ApolloProApp = () => {
  const [the, remember] = useRemember();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (the.rememberMe === true && the["persist:root"] === "") {
      remember({ "persist:root": sessionStorage.getItem("persist:root") });
    }

    if (
      the.rememberMe === false &&
      window.location.pathname !== "/signin" &&
      !sessionStorage.getItem("persist:root")
    ) {
      localStorage.clear();
      window.location = `${window.location.origin}/signin?from=${window.location.pathname}`;
      // window.location.pathname = "/signin";
    }

    if (the.rememberMe === true && the["persist:root"] && !sessionStorage.getItem("persist:root")) {
      sessionStorage.setItem("persist:root", the["persist:root"]);
      if (JSON.parse(localStorage.getItem("locale"))) {
        dispatch(setLanguage(JSON.parse(localStorage.getItem("locale"))));
        rtlLayoutHanlder(JSON.parse(localStorage.getItem("locale"))?.locale === "ar");
      }
      dispatch(signUserIn({ token: { ...the.user }, history }));
    }
  }, [the]);

  useEffect(() => {
    // set Arabic as default
    if (!JSON.parse(localStorage.getItem("locale"))) {
      const locale = JSON.stringify({
        languageId: "saudi-arabia",
        locale: "ar",
        name: "Arabic",
        icon: "ar",
      });
      dispatch(setLanguage(JSON.parse(locale)));
      rtlLayoutHanlder(JSON.parse(locale)?.locale === "ar");
      localStorage.setItem("locale", locale);
    }
  }, []);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("locale"))?.locale === "ar") {
      rtlLayoutHanlder(true);
    }
  }, [localStorage]);

  const rtlLayoutHanlder = (isTrue) => {
    const root = document.getElementsByTagName("html")[0];
    dispatch(rtlLayoutAction(isTrue));
    if (isTrue) {
      root.setAttribute("dir", "rtl");
      document.body.classList.add("rtl");
    } else {
      root.setAttribute("dir", "ltr");
      document.body.classList.remove("rtl");
    }
  };

  const token = () => JSON.parse(localStorage.getItem("user_data"))?.token;
  const client = new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: token() ? `Bearer ${token()}` : "",
        "accept-language": the.locale,
        "access-allow-origin": "*",
      },
    }),
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    // Redirect user after signin to previous route
    if (
      window &&
      !token() &&
      window.location.pathname !== "/signin" &&
      !window.location.href.includes("?from=")
    ) {
      window.location = `${window.location.origin}/signin?from=${window.location.pathname}`;
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <PersistGate loading={null} persistor={persistor}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
            <Router>
              <ScrollToTop />
              <Switch>
                <Route path="/" component={App} />
              </Switch>
            </Router>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </PersistGate>
    </ApolloProvider>
  );
};

Remember.propTypes = {
  children: PropTypes.any,
};

export default MainApp;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
