/** Branches Page */
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

import { AllBanners } from "gql/queries/getAllBanners.gql";
import { userCan, getPageFromHash } from "functions";
import BannerList from "./BannerList";

export default function Banners() {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(10);
  const { data: banners, refetch, loading } = useQuery(AllBanners, {
    variables: { page, limit },
  });
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.banners" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.banners" />}
        match={location}
        enableBreadCrumb
        extraButtons={
          <>
            {userCan("branches.create") && (
              <Button
                variant="contained"
                color="primary"
                className="mx-sm-15 btn btn-success"
                onClick={() => history.push("banners/add")}
              >
                <IntlMessages id="create.new.something" values={{ something: messages?.banner }} />
              </Button>
            )}
          </>
        }
      />
      <BannerList
        refetch={refetch}
        loading={loading}
        setPage={setPage}
        setLimit={setLimit}
        limit={limit}
        allbanners={banners}
      />
    </div>
  );
}
