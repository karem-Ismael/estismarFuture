/* eslint-disable prettier/prettier */
/**
 * Bookings/Rentals Page
 */
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/client";
// page title bar
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
// rct card box

// intl messages
import IntlMessages from "util/IntlMessages";
import { userCan, getPageFromHash } from "functions";

// component
import { AllyCompanies } from "gql/queries/AllCompanies.gql";
import CompanyList from "./CompanyList";
export default function AllCompanies() {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);

  const { data: allyCompanies, refetch, loading } = useQuery(AllyCompanies, {
    variables: { page, limit },
  });
  useEffect(() => {
    refetch();
  }, []);
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.companies" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.companies" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("ally_companies.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("companies/add")}
              >
                <IntlMessages id="create.new.something" values={{ something: messages?.company }} />
              </Button>
            )}
          </>
        }
      />
      <CompanyList
        refetch={refetch}
        loading={loading}
        setPage={setPage}
        setLimit={setLimit}
        limit={limit}
        allyCompanies={allyCompanies}
      />
    </div>
  );
}
