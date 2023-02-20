/**  Models page Pag  */
import React, { useState, useRef, useEffect } from "react";
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
import { ExtraServices } from "gql/queries/ExtraService.gql";
import { userCan, getPageFromHash } from "functions";
import ExtraServiceList from "./ExtraServiceList";
export default function AllExService() {
  const location = useLocation();

  const history = useHistory();
  const [query, setQuery] = useState();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(500);
  const { data: allservice, refetch, loading } = useQuery(ExtraServices, {
    variables: {
      limit,
      page,
      ...query,
      isActive: +query?.isActive > -1 ? !!+query.isActive : null,
    },
  });
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.extraservice" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.extraservice" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("cars.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("extraservice/add")}
              >
                <IntlMessages
                  id="create.new.something"
                  values={{ something: messages?.extraservice }}
                />
              </Button>
            )}
          </>
        }
      />
      <>
        <ExtraServiceList
          refetch={refetch}
          loading={loading}
          setPage={setPage}
          setLimit={setLimit}
          limit={limit}
          allservice={allservice}
        />
      </>
    </div>
  );
}
