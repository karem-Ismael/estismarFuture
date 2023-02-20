import React, { useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { CarModel } from "gql/queries/getModelProfile.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { ModelDisplayData } from "./ModelDisplayData";
import { useIntl } from "react-intl";

/**
 * @name DisplayModelProfile
 * @export
 * @return {JSX}
 */
export default function DisplayModelProfile() {
  const location = useLocation();
  const { modelId } = useParams();
  const { formatMessage, locale } = useIntl();
  const { data: modelprofile, refetch } = useQuery(CarModel, {
    variables: { id: +modelId },
  });
  useEffect(() => {
    refetch();
  }, [locale]);
  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "model.details" })}</title>
        <meta name="description" content="Carwah Model Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="model.details" />}
        enableBreadCrumb
        match={location}
        lastElement={modelprofile?.carModel?.id || <DotsLoader />}
      />
      <div className="row">
        {modelprofile && (
          <div className="w-50">
            <ModelDisplayData modelprofile={modelprofile} withimages={false} />
          </div>
        )}
        {/* <div className="w-50">
          <>
            <p>{formatMessage({ id: "carImage" })}</p>
            {carprofile && (
              <img
                style={{
                  verticalAlign: "middle",
                  borderRadius: "50%",
                }}
                className="w-75 mb-4 avatar"
                src={carprofile?.carProfile.make.logo}
                alt={formatMessage({ id: "carImage" })}
              />
            )}
          </>
        </div> */}
      </div>
    </div>
  );
}
