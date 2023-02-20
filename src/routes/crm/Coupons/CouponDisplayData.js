import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import PropTypes from "prop-types";
import moment from "moment";
export function CouponDisplayData({ couponDetails }) {
  const [Coupon, setCoupon] = useState();
  const { locale } = useIntl();

  useEffect(() => {
    if (couponDetails) {
      const {
       
        code,
       
        startAt,
        expireAt,
        numOfUsages,
        discountType,
        numOfUsagesPerUser,
      } = couponDetails.couponDetails;

      const coupon = [
        { msgId: "code.label", value: code },
        { msgId: "numOfUsages.label", value: numOfUsages },

        { msgId: "numOfUsagesPerUser.label", value: numOfUsagesPerUser },
        { msgId: "type", value: discountType },
        {
          msgId: "start.date",
          value:
            locale == "en"
              ? moment(new Date(startAt).toUTCString()).utc().locale(locale).format("DD/MM/YYYY HH:mm:ss")
              : moment(startAt).utc().locale(locale).format("YYYY/MM/DD ss:mm:HH"),
        },
        {
          msgId: "end.date",
          value: expireAt
            ? locale == "en"
              ? moment(expireAt).utc().locale(locale).format("DD/MM/YYYY HH:mm:ss")
              : moment(expireAt).utc().locale(locale).format("YYYY/MM/DD ss:mm:HH")
            : "",
        },
      ];
      setCoupon(coupon);
    }
  }, [couponDetails, locale]);

  return (
    <InfoCard
      fullwidth
      data={Coupon}
      titleId="coupon.details"
      areas={couponDetails?.couponDetails?.areas}
      allyCompanies={couponDetails?.couponDetails?.allyCompanies}
    />
  );
}
CouponDisplayData.propTypes = {
  couponDetails: PropTypes.object,
};
