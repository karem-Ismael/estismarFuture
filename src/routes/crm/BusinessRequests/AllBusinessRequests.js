/* eslint-disable prettier/prettier */
/**  Models page Pag  */
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/client";
// page title bar
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
// intl messages
import { FiltersAndSearches } from "components/FiltersAndSearches";
import { RctCard, RctCardContent } from "Components/RctCard";
import IntlMessages from "util/IntlMessages";
import { BusinessRequests } from "gql/queries/BusinessRequests.gql";
import { userCan, getPageFromHash } from "functions";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import { Collapse } from "@material-ui/core";
import BusinessRequestList from "./BusinessRequestList";
export default function GetAllBusinessRequests() {
  const location = useLocation();
  const history = useHistory();
  const [query, setQuery] = useState();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const { data: BusinessRequestsRes, refetch, loading } = useQuery(BusinessRequests, {
    variables: {
      limit,
      page,
      ...query,
    },
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.businessrequests" })}</title>
      </Helmet>
      <PageTitleBar
        title={formatMessage({ id: "sidebar.businessrequests" })}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("business_requests.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("businessRequests/add")}
              >
                <IntlMessages
                  id="create.new.something"
                  values={{ something: messages?.businessrequest }}
                />
              </Button>
            )}
          </>
        }
      />
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
                    refetch={refetch}
                    query={query}
                    setQuery={setQuery}
                    setPage={setPage}
                    submitbtnid="search.filter"
                    fields={[
                      {
                        type: "search",
                        name: "id",
                        placeholder: formatMessage({ id: "Request ID.placeholder" }),
                      },
                      {
                        type: "search",
                        name: "customerName",
                        placeholder: formatMessage({ id: "customerName.placeholder" }),
                      },
                    ]}
                    filters={["makeId", "pickUpCityId"]}
                  />
                </div>
              </RctCardContent>
            </RctCard>
          </Collapse>
        </div>
        <BusinessRequestList
          refetch={refetch}
          loading={loading}
          setPage={setPage}
          setLimit={setLimit}
          limit={limit}
          businessRequests={BusinessRequestsRes}
        />
      </>
    </div>
  );
}
