import React from "react";
import { dataTypes } from "constants/constants";
import { FormattedMessage } from "react-intl";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const FeatureData = [
  {
    headerId: "FeaturesID",
    dataRef: "id",
    dataType: TEXT,
  },
  {
    headerId: "displayOrder",
    dataRef: "displayOrder",
    dataType: TEXT,
  },
  
  {
    headerId: "featureicon",
    dataType: FUNC,

    func: (record) => <img src={record.icon} alt="Logo" width="50px" />,
  },
  {
    headerId:"components.parent.feature",
    dataType: FUNC,

    func: (record, locale) => record.parent?.[`name${locale.charAt(0).toUpperCase() + locale.charAt(1)}`],

  },
  {
    headerId: "featureEnName",
    dataRef: "nameEn",
    dataType: TEXT,
  },
  {
    headerId: "featureArName",
    dataRef: "nameAr",
    dataType: TEXT,
  },
  {
    headerId: "status",
    dataType: FUNC,

    func: (record) => <FormattedMessage id={record?.isActive ? "active" : "inactive"} />,
  },
  { headerId: "common.actions", dataType: ACTIONS },
];
