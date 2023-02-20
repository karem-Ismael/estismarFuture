import React from "react";
import { dataTypes } from "constants/constants";
import { FormattedMessage } from "react-intl";
import moment from "moment";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const BannerData = [
  {
    headerId: "bannerID",
    dataRef: "id",
    dataType: TEXT,
  },
  {
    headerId: "sortorder.label",
    dataType: TEXT,
    dataRef: "displayOrder",
  },
  {
    headerId: "ArImage",
    dataRef: "logo",
    dataType: FUNC,
    func: (record, locale) => <img src={record.imgAr} alt="Logo" width="50px" />,
  },
  {
    headerId: "EnImage",
    dataRef: "logo",
    dataType: FUNC,
    func: (record, locale) => <img src={record.imgEn} alt="Logo" width="50px" />,
  },
  {
    headerId: "status",
    dataType: FUNC,

    func: (record) => <FormattedMessage id={record.isActive ? "active" : "inactive"} />,
  },
  {
    headerId: "createdAt",
    dataType: FUNC,

    func: (record, locale) => {
      if (record?.createdAt) {
        const date = moment(record.createdAt).locale(locale);
        return (
          <>
            <span>{date.format("LL")}</span> <br /> <span>{date.format("hh:mm A")}</span>
          </>
        );
      }
      return "";
    },
  },
  { headerId: "common.actions", dataType: ACTIONS },
];
