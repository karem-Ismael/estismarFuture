/**
 * Dasboard Routes
 */
import React from "react";
import PropTypes from "prop-types";
import { Redirect, Route, Switch } from "react-router-dom";

// async components
import {
  AsyncEcommerceDashboardComponent,
  AsyncSaasDashboardComponent,
  AsyncAgencyDashboardComponent,
  AsyncNewsDashboardComponent,
} from "Components/AsyncComponent/AsyncComponent";

const Dashboard = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/ecommerce`} />
      <Route path={`${match.url}/ecommerce`} component={AsyncEcommerceDashboardComponent} />
      <Route path={`${match.url}/saas`} component={AsyncSaasDashboardComponent} />
      <Route path={`${match.url}/agency`} component={AsyncAgencyDashboardComponent} />
      <Route path={`${match.url}/news`} component={AsyncNewsDashboardComponent} />
    </Switch>
  </div>
);

Dashboard.propTypes = {
  match: PropTypes.object,
};

export default Dashboard;
