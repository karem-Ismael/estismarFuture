/** Cars Page */
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/client";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import IntlMessages from "util/IntlMessages";
import { CarVersions } from "gql/queries/getAllCarVersions.gql";
import { userCan, getPageFromHash } from "functions";
import { RctCard, RctCardContent } from "Components/RctCard";
import { FiltersAndSearches } from "components/FiltersAndSearches";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import { Collapse } from "@material-ui/core";
import VersionList from "./VersionList";

export default function allVersions() {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: allVersions, refetch, loading } = useQuery(CarVersions, {
    variables: { limit, page, ...query },
  });
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.versions" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.versions" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("car_versions.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("versions/add")}
              >
                <IntlMessages id="create.new.something" values={{ something: messages?.version }} />
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
                <div className="row w-100">
                  <FiltersAndSearches
                    refetch={refetch}
                    query={query}
                    setQuery={setQuery}
                    setPage={setPage}
                    submitbtnid="search.filter"
                    // fields={[{ type: "search", name: "allyName" }]}
                    filters={["makesId", "model", "year", "vehicle"]}
                  />
                </div>
              </RctCardContent>
            </RctCard>
          </Collapse>
        </div>
        <VersionList
          refetch={refetch}
          loading={loading}
          setPage={setPage}
          setLimit={setLimit}
          limit={limit}
          allVersions={allVersions}
        />
      </>
    </div>
  );
}
