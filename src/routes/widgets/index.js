/**
 * Pages Routes
 */
import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { Redirect, Route, Switch } from "react-router-dom";

// async components
import {
  AsyncUserWidgetComponent,
  AsyncUserChartsComponent,
  AsyncGeneralWidgetsComponent,
  AsyncPromoWidgetsComponent,
} from "components/AsyncComponent/AsyncComponent";

const Pages = ({ match }) => (
  <div className="content-wrapper">
    <Helmet>
      <title>Carwah</title>
      <meta name="description" content="Carwah Dashboard" />
    </Helmet>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/user`} />
      <Route path={`${match.url}/user`} component={AsyncUserWidgetComponent} />
      <Route path={`${match.url}/charts`} component={AsyncUserChartsComponent} />
      <Route path={`${match.url}/general`} component={AsyncGeneralWidgetsComponent} />
      <Route path={`${match.url}/promo`} component={AsyncPromoWidgetsComponent} />
    </Switch>
  </div>
);

Pages.propTypes = {
  match: PropTypes.object,
};

export default Pages;
