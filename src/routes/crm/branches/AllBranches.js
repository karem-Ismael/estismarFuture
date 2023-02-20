/** Branches Page */
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/client";
// page title bar
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "util/IntlMessages";

import { Branches } from "gql/queries/AllBranches.gql";
import { userCan, getPageFromHash } from "functions";
import { RctCard, RctCardContent } from "Components/RctCard";
import { FiltersAndSearches } from "components/FiltersAndSearches";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import { Collapse } from "@material-ui/core";
import BranchList from "./BranchList";
export default function AllBranches() {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState({});
  const [isDeltedFilterSelected, setIsDeltedFilterSelected] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // overrides isDeleted from Boolean to isDeleted string to manipulate query
    if (query?.isDeleted === "isDeleted") {
      setQuery({ ...query, isDeleted: true });
    }
  }, [query]);
  const { data: branches, refetch, loading } = useQuery(Branches, {
    variables: {
      page,
      limit,
      ...query,
      branchId:
        query.branchId == "null"
          ? null
          : Array.isArray(query.branchId)
          ? undefined
          : query.branchId,
      isActive: +query.isActive > -1 ? !!+query.isActive : null,
      skip: query.isDeleted !== "isDeleted",
    },
  });
  useEffect(() => {
    refetch();
  }, []);
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.branches" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.branches" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("branches.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("branches/add")}
              >
                <IntlMessages id="create.new.something" values={{ something: messages?.branch }} />
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
                    filters={["areas", "branch", "ally"]}
                    model="model"
                    branchesDeletedFilter
                    multi
                    branch
                    isDeltedFilterSelected={isDeltedFilterSelected}
                    setIsDeltedFilterSelected={setIsDeltedFilterSelected}
                  />
                </div>
              </RctCardContent>
            </RctCard>
          </Collapse>
        </div>
      </>
      <BranchList
        refetch={refetch}
        loading={loading}
        setPage={setPage}
        setLimit={setLimit}
        limit={limit}
        allbranches={branches}
        isDeltedFilterSelected={isDeltedFilterSelected}
      />
    </div>
  );
}
