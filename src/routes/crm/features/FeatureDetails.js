import React, { useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { Feature } from "gql/queries/FeatureDetails.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { useIntl } from "react-intl";
import { FeatureDisplayData } from "./FeatureDisplayData";

/**
 * @name FeatureDetails
 * @export
 * @return {JSX}
 */
export default function FeatureDetails() {
  const location = useLocation();
  const history = useHistory();
  const { featureId } = useParams();
  const { formatMessage, locale } = useIntl();
  const { data: feature, refetch } = useQuery(Feature, {
    variables: { id: +featureId },
  });
  useEffect(() => {
    // refetch();
  }, [locale]);

  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "feature.details" })}</title>
        <meta name="description" content="Carwah Feature Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="feature.details" />}
        enableBreadCrumb
        match={location}
        lastElement={featureId || <DotsLoader />}
      />
      <div className="row">
        {feature && (
          <div className="w-50">
            <FeatureDisplayData featureprofile={feature} withimages={false} />
          </div>
        )}
        <div className="w-50">
          <>
            <p>{formatMessage({ id: "feature.icon" })}</p>
            {feature && (
              <img
                style={{
                  verticalAlign: "middle",
                  borderRadius: "50%",
                }}
                className="w-75 mb-4 avatar"
                src={feature?.feature.icon}
                alt={formatMessage({ id: "feature.icon" })}
              />
            )}
          </>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="row justify-content-end">
            <div className="col-md-2 mt-2">
              <button
                type="button"
                onClick={() => history.push(`/cw/dashboard/features/${featureId}/edit`)}
                className="btn btn-primary text-center text-white"
              >
                {formatMessage({ id: "Edit" })}
              </button>{" "}
            </div>
            <div className="col-md-2 mt-2">
              <button
                onClick={() => history.push("/cw/dashboard/features")}
                type="button"
                className="btn btn-danger text-white text-center"
              >
                {formatMessage({ id: "button.back" })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
