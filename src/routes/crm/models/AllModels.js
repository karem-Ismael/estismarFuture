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
import IntlMessages from "util/IntlMessages";

import { CarModels } from "gql/queries/AllModels.gql";
import { userCan, getPageFromHash } from "functions";

import ModelList from "./ModelList";
export default function AllModels() {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const { data: allmodels, refetch, loading } = useQuery(CarModels, {
    variables: { limit, page },
  });
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.models" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.models" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("cars.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("models/add")}
              >
                <IntlMessages id="create.new.something" values={{ something: messages?.model }} />
              </Button>
            )}
          </>
        }
      />
      <ModelList
        refetch={refetch}
        loading={loading}
        setPage={setPage}
        setLimit={setLimit}
        limit={limit}
        allmodels={allmodels}
      />
    </div>
  );
}
