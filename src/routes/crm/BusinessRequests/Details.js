/* eslint-disable prettier/prettier */
import React, { useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { BusinessRequestDetails } from "gql/queries/BusinessRequestDetails.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";

import { useIntl } from "react-intl";
import { RequestDisplayData } from "./RequestDisplayData";

export default function BusinessRequestsDetails() {
  const location = useLocation();
  const { requestId } = useParams();
  const { formatMessage, locale } = useIntl();

  const { data: requestRes, refetch } = useQuery(BusinessRequestDetails, {
    skip: !requestId,
    variables: { id: +requestId },
  });

  useEffect(() => {
    refetch();
  }, [locale]);
  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "request.details" })}</title>
        <meta name="description" content="Carwah Model Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="request.details" />}
        enableBreadCrumb
        match={location}
        lastElement={requestId || <DotsLoader />}
      />
      <div className="row">
        {requestRes && (
          <div className="w-100">
            <RequestDisplayData requestRes={requestRes} withimages={false} />
          </div>
        )}
      </div>
    </div>
  );
}
