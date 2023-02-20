/** Customers Page */
import React, { useState, useEffect, useLayoutEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { GetUsersList } from "gql/queries/Users.queries.gql";
import { useQuery } from "@apollo/client";
import { Button, CircularProgress, Collapse } from "@material-ui/core";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { RctCard, RctCardContent } from "Components/RctCard";
import IntlMessages from "util/IntlMessages";
import { FiltersAndSearches } from "components/FiltersAndSearches";
import { NotificationManager } from "react-notifications";
import { persist } from "constants/constants";
import { userCan, getPageFromHash } from "functions";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import CustomersList from "./components/CustomersList";

export default function Customers() {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const [query, setQuery] = useState({});
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(persist.initLimit);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: customersRes, refetch, loading, error } = useQuery(GetUsersList, {
    variables: {
      type: "customers",
      ...query,
      page,
      limit,
      name: query.customerName,
      isActive: +query.isActive > -1 && +query.isActive !=2  ? !!+query.isActive : null,
    },
  });

  useEffect(() => {
    if (error?.message) NotificationManager.error(error.message);
  }, [error]);

  useLayoutEffect(() => {
    refetch();
  }, []);

  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.customers" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.customers" />}
        enableBreadCrumb
        match={location}
        extraButtons={
          <>
            {userCan("users.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("customers/add")}
              >
                <IntlMessages id="add.something" values={{ something: messages?.customer }} />
              </Button>
            )}
          </>
        }
      />
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
                        { type: "search", name: "customerName" },
                        { type: "search", name: "email" },
                        { type: "search", name: "nid" },
                      ]}
                      filters={["cutomer_status"]}
                      is_active="isActive"
                      mobile
                      mobileRef="mobile"
                    />
                  </div>
                </RctCardContent>
              </RctCard>
            </Collapse>
          </div>
          {!loading ? (
            <CustomersList
              refetch={refetch}
              loading={loading}
              setPage={setPage}
              setLimit={setLimit}
              limit={limit}
              customersRes={customersRes}
            />
          ) : (
            <div className="text-center">
              <CircularProgress />
            </div>
          )}
        </>
      )}
    </div>
  );
}
