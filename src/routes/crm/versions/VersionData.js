import React from "react";
import { dataTypes } from "constants/constants";
import { FormattedMessage } from "react-intl";

const { ACTIONS, FUNC } = dataTypes;

export const VersionData = [
  {
    headerId: "version.id",

    dataType: FUNC,
    func: (record) => record.id,
  },
  {
    headerId: "car.make",

    dataType: FUNC,
    func: (record, locale) => record.carModel?.make && record.carModel?.make[`${locale}Name`],
  },
  {
    headerId: "car.model",
    dataType: FUNC,
    func: (record, locale) => record.carModel[`${locale}Name`],
  },
  {
    headerId: "vehicle.type",
    dataType: FUNC,
    func: (record, locale) => record.vehicleType?.[`${locale}Name`],
  },
  {
    headerId: "car.thumbnail.image",
    dataType: FUNC,
    func: (record) => <img src={record.image} alt="Logo" width="50px" /> ,
  },
  {
    headerId: "car.year",
    dataType: FUNC,
    func: (record) => record.year,
  },

  { headerId: "common.actions", dataType: ACTIONS },
];
