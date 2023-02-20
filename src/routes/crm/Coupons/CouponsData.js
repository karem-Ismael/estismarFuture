import React from "react";
import { dataTypes } from "constants/constants";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import "moment/locale/ar-sa";
import "moment/locale/en-au";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const CouponsData = [
  {
    headerId: "Coupon",
    dataRef: "code",
    dataType: TEXT,
  },
  {
    headerId: "CouponType",
    dataRef: "discountType",

    dataType: TEXT,
  },
  {
    headerId: "Startdate",
    dataType: FUNC,
    func: (record, locale) => {
      const date = moment.utc(record.startAt);
      return locale == "en"
        ? date.locale(locale).format("DD/MM/YYYY")
        : date.locale(locale).format("YYYY/MM/DD");
    },
  },
  {
    headerId: "Enddate",
    dataType: FUNC,
    func: (record, locale) => {
      const date = moment.utc(record.expireAt);
      return record.expireAt
        ? locale == "en"
          ? date.locale(locale).format("DD/MM/YYYY")
          : date.locale(locale).format("YYYY/MM/DD")
        : null;
    },
  },
  { headerId: "common.actions", dataType: ACTIONS },
];
