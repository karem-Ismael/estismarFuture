/* eslint-disable prettier/prettier */
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { AllyCompany } from "gql/queries/GetCompanyDetails.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { useIntl } from "react-intl";
import GoogleMapComponent from "routes/maps/google-map";
import { CompanyDisplayData } from "./CompanyDisplayData";
/**
 * @name CompanyDetails
 * @export
 * @return {JSX}
 */
export default function CompanyDetails() {
  const location = useLocation();
  const { CompanyId } = useParams();
  const { formatMessage, locale } = useIntl();
  const { data: allyCompany, refetch } = useQuery(AllyCompany, {
    variables: { id: +CompanyId },
  });
  useEffect(() => {
    refetch();
  }, [locale]);
  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "company.details" })}</title>
        <meta name="description" content="Carwah Model Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="company.details" />}
        enableBreadCrumb
        match={location}
        lastElement={CompanyId || <DotsLoader />}
      />
      <div className="row">
        {allyCompany && (
          <div className="w-50">
            <CompanyDisplayData allyCompany={allyCompany} withimages={false} />
          </div>
        )}
        <div className="w-50">
          <>
            <GoogleMapComponent
              heading={formatMessage({ id: "ally.location" })}
              lat={allyCompany?.allyCompany.lat ? allyCompany.allyCompany.lat : 24.7136}
              lng={allyCompany?.allyCompany.lng ? allyCompany.allyCompany.lng : 46.6753}
            />
          </>
        </div>
      </div>
    </div>
  );
}
