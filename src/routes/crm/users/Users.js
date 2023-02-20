/** Users Page */
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { GetCustomerCareUsersList } from "gql/queries/Users.queries.gql";
import { useQuery } from "@apollo/client";
import { Button, Collapse } from "@material-ui/core";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import IntlMessages from "util/IntlMessages";
import { NotificationManager } from "react-notifications";
import { persist } from "constants/constants";
import { FiltersAndSearches } from "components/FiltersAndSearches";
import { RctCard, RctCardContent } from "Components/RctCard";
import { userCan, getPageFromHash } from "functions";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import UsersList from "./components/UsersList";

export default function Users() {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const [query, setQuery] = useState({});
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(persist.initLimit);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: usersRes, refetch, loading, error } = useQuery(GetCustomerCareUsersList, {
    variables: {
      ...query,
      page,
      limit,
      name: query.customerName,
      isActive: +query.isActive > -1 ? !!+query.isActive : null,
      type: "customer_care",
    },
  });

  useEffect(() => {
    if (error?.message) NotificationManager.error(error.message);
  }, [error]);

  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.users" })}</title>
      </Helmet>
      {/* title and breadcrumb */}
      <PageTitleBar
        title={<IntlMessages id="sidebar.users" />}
        enableBreadCrumb
        match={location}
        extraButtons={
          <>
            {userCan("users.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("users/add")}
              >
                <IntlMessages id="add.something" values={{ something: messages?.user }} />
              </Button>
            )}
          </>
        }
      />
      {/* Searches and filters */}
      {userCan("users.list") && (
        <>
          <div className="search-bar-wrap">
            <div className="d-flex justify-content-end">
              <Button
                className="d-flex justify-content-end mb-2 align-items-center"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <FilterListIcon />
                <span>
                  <FormattedMessage id="Filter" />
                </span>
                {!isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </Button>
            </div>
            <Collapse in={isCollapsed} timeout="auto">
              <RctCard>
                <RctCardContent>
                  <div className="row">
                    <FiltersAndSearches
                      setPage={setPage}
                      refetch={refetch}
                      query={query}
                      setQuery={setQuery}
                      submitbtnid="search.filter"
                      fields={[
                        { type: "search", name: "userName" },
                        { type: "search", name: "email" },
                      ]}
                    />
                  </div>
                </RctCardContent>
              </RctCard>
            </Collapse>
          </div>
          {/* Table */}
          <UsersList
            query={query}
            setQuery={setQuery}
            refetch={refetch}
            loading={loading}
            setPage={setPage}
            page={page}
            setLimit={setLimit}
            limit={limit}
            usersRes={usersRes}
          />
        </>
      )}
    </div>
  );
}
