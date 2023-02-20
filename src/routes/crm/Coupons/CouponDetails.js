import React, { useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { CouponDetails } from "gql/queries/CouponDetails.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { useIntl } from "react-intl";
import { CouponDisplayData } from "./CouponDisplayData";

/**
 * @name FeatureDetails
 * @export
 * @return {JSX}
 */
export default function CouponDetailsComponent() {
  const location = useLocation();
  const history = useHistory();
  const { id } = useParams();
  const { formatMessage, locale } = useIntl();
  const { data: couponDetails, refetch } = useQuery(CouponDetails, {
    variables: { id: +id },
  });
  useEffect(() => {
    // refetch();
  }, [locale]);

  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "coupon.details" })}</title>
        <meta name="description" content="Carwah Coupon Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="coupon.details" />}
        enableBreadCrumb
        match={location}
        lastElement={id || <DotsLoader />}
      />
      <div className="row">
        {couponDetails && (
          <div className="w-50">
            <CouponDisplayData couponDetails={couponDetails} withimages={false} />
          </div>
        )}
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="row justify-content-end">
            <div className="col-md-2 mt-2">
              <button
                type="button"
                onClick={() => history.push(`/cw/dashboard/coupons/${id}/edit`)}
                className="btn btn-primary text-center text-white"
              >
                {formatMessage({ id: "Edit" })}
              </button>{" "}
            </div>
            <div className="col-md-2 mt-2">
              <button
                onClick={() => history.push("/cw/dashboard/coupons")}
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
