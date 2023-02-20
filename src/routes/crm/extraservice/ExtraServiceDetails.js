import React, { useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { ExtraService } from "gql/queries/GetExtraService.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { useIntl } from "react-intl";
import { ExtraServiceDisplayData } from "./ExtraServiceDisplayData";

/**
 * @name FeatureDetails
 * @export
 * @return {JSX}
 */
export default function ExtraServiceDetails() {
  const location = useLocation();
  const history = useHistory();
  const { id } = useParams();
  const { formatMessage, locale } = useIntl();
  const { data: extraservice, refetch } = useQuery(ExtraService, {
    variables: { id: +id },
  });
  useEffect(() => {
    // refetch();
  }, [locale]);
  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "extraService.details" })}</title>
        <meta name="description" content="Carwah ExtraService Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="extraService.details" />}
        enableBreadCrumb
        match={location}
        lastElement={id || <DotsLoader />}
      />
      <div className="row">
        {extraservice && (
          <div className="w-50">
            <ExtraServiceDisplayData extraservice={extraservice} withimages={false} />
          </div>
        )}
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="row justify-content-end">
            <div className="col-md-2 mt-2">
              <button
                type="button"
                onClick={() => history.push(`/cw/dashboard/extraservice/${id}/edit`)}
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
