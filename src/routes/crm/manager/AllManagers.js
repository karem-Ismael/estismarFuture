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
import { AllyManagers } from "gql/queries/AllyManagers.gql";
import { userCan, getPageFromHash } from "functions";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import { Collapse } from "@material-ui/core";
import ManagerList from "./ManagerList";
export default function GetAllManagers() {
  const location = useLocation();
  const history = useHistory();
  const [query, setQuery] = useState();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: allManagers, refetch, loading } = useQuery(AllyManagers, {
    variables: {
      limit,
      page,
      ...query,
      isActive: +query?.isActive > -1 &&+query?.isActive != 2 ? !!+query.isActive : undefined,
      isDeleted: +query?.isActive == 2 ? true : false
    },
  });
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.managers" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.managers" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("ally_companies.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("managers/add")}
              >
                <IntlMessages id="create.new.something" values={{ something: messages?.manager }} />
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
                    make="make"
                    refetch={refetch}
                    query={query}
                    setQuery={setQuery}
                    setPage={setPage}
                    submitbtnid="search.filter"
                    fields={[
                      { type: "search", name: "firstName" },
                      { type: "search", name: "email" },
                    ]}
                    filters={["branch", "ally"]}
                    is_active="isActive"
                    // multi={true}
                    branchmanager
                    mobile
                    manager
                    mobileRef="mobile"
                  />
                </div>
              </RctCardContent>
            </RctCard>
          </Collapse>
        </div>
        <ManagerList
          refetch={refetch}
          loading={loading}
          setPage={setPage}
          setLimit={setLimit}
          limit={limit}
          allManagers={allManagers}
        />
      </>
    </div>
  );
}
