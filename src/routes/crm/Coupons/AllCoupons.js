/* eslint-disable prettier/prettier */
/* eslint-disable no-undefined */
/* eslint-disable react/jsx-boolean-value */
/** coupons Page */
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

import { Coupons } from "gql/queries/AllCoupons.gql";
import { userCan, getPageFromHash } from "functions";
import { RctCard, RctCardContent } from "Components/RctCard";
import { FiltersAndSearches } from "components/FiltersAndSearches";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import { Collapse } from "@material-ui/core";

import CouponList from "./CouponList";
export default function AllCoupons() {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: coupons, refetch, loading } = useQuery(Coupons, {
    variables: {
      page,
      limit,
      ...query,
      allyCompanyId: query.allyCompanyIds,
      cityId: query.cityId ? query.cityId : undefined,
    },
  });
  useEffect(() => {
    refetch();
  }, []);
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.coupons" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.coupons" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("coupons.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("coupons/add")}
              >
                <IntlMessages id="create.new.something" values={{ something: messages?.Coupon }} />
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
                    fields={[{ type: "search", name: "code" }]}
                    setQuery={setQuery}
                    setPage={setPage}
                    submitbtnid="search.filter"
                    filters={["cities", "ally"]}
                    model="model"
                    multi={true}
                    coupoun={true}
                    withdaterangepicker
                    branch={true}
                  />
                </div>
              </RctCardContent>
            </RctCard>
          </Collapse>
        </div>
      </>
      <CouponList
        refetch={refetch}
        loading={loading}
        setPage={setPage}
        setLimit={setLimit}
        limit={limit}
        allcoupons={coupons}
      />
    </div>
  );
}
