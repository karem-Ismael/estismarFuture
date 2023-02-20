/* eslint-disable prettier/prettier */
import React, { useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { BusinessRentalDetails } from "gql/queries/BusinessRentalDetails.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";

import { useIntl } from "react-intl";
import { userCan } from "functions";
import { RequestDisplayData } from "./DisplayData";
import ChangeStatus from "../ChangeStatus";

export default function BusinessBookingDetails() {
  const location = useLocation();
  const { businessBookingId } = useParams();
  const { formatMessage, locale } = useIntl();

  const { data: requestRes, refetch } = useQuery(BusinessRentalDetails, {
    skip: !businessBookingId,
    variables: { id: +businessBookingId },
  });

  useEffect(() => {
    refetch();
  }, [locale]);
  return (
    <div className="ecom-dashboard-wrapper">
      {(userCan("business_rentals.update") || userCan("business_rentals.close")) && (
        <div id="change-status">
          <ChangeStatus />
        </div>
      )}
      <Helmet>
        <title>{formatMessage({ id: "businessRental.details" })}</title>
        <meta name="description" content="Carwah Model Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="businessRental.details" />}
        enableBreadCrumb
        match={location}
        lastElement={businessBookingId || <DotsLoader />}
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
