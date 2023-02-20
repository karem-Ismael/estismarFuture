/* eslint-disable no-restricted-globals */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prettier/prettier */
/**  Models page Pag  */
import React, { useState } from "react";
import { useIntl } from "react-intl";
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
import { Rates } from "gql/queries/AlliesRates.gql";
import { userCan, getPageFromHash } from "functions";
import List from "./List";
export default function Index() {
  const location = useLocation();
  const history = useHistory();
  const [query, setQuery] = useState();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const { data, refetch, loading } = useQuery(Rates, {
    variables: {
      page,
      isActive: null,
      limit,
      ...query,
    },
  });
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "Rates" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="Rates" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("cars.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("allies-rates/add")}
              >
                <IntlMessages id="create.new.something" values={{ something: messages?.rate }} />
              </Button>
            )}
          </>
        }
      />
      <>
        <List
          refetch={refetch}
          loading={loading}
          setPage={setPage}
          setLimit={setLimit}
          limit={limit}
          data={data}
        />
      </>
    </div>
  );
}
