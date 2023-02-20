/* eslint-disable prettier/prettier */
import React from 'react';
import { dataTypes } from "constants/constants";
import { FormattedMessage } from "react-intl";

const { TEXT, FUNC, ACTIONS } = dataTypes;

export const TableData = [
  {
    headerId: "displayOrder",
    dataRef: "displayOrder",
    dataType: TEXT,
  },
  {
    headerId: "rate",
    dataRef: "name",
    dataType: TEXT,
  },
  {
    headerId: "status",
    dataType: FUNC,

    func: (record) => <FormattedMessage id={record?.isActive ? "active" : "inactive"} />,
  },
  { headerId: "common.actions", dataType: ACTIONS },
];
