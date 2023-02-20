import React from "react";
import { dataTypes } from "constants/constants";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const ModelData = [
  {
    headerId: "ModelID",
    dataRef: "id",
    dataType: TEXT,
  },
  {
    headerId: "ModelName",
    dataRef: "enName",
    dataType: TEXT,
  },
  {
    headerId: "make",
    dataType: FUNC,

    func: (record, locale) => (record.make ? record.make[`${locale && locale}Name`] : null),
  },
  { headerId: "common.actions", dataType: ACTIONS },
];
