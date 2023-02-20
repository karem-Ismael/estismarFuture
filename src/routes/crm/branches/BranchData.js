import React from "react";
import { dataTypes } from "constants/constants";
import { FormattedMessage } from "react-intl";
import CarModal from "./CarModal.js";
import "./style.css";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const BranchData = [
  {
    headerId: "BranchID",
    dataRef: "id",
    dataType: TEXT,
  },
  {
    headerId: "allyname",
    dataType: FUNC,
    func: (record, locale) => record.allyCompany[`${locale}Name`],
  },
  {
    headerId: "BranchName",
    dataType: FUNC,
    func: (record, locale) => record[`${locale}Name`],
  },
  {
    headerId: "status",
    dataType: FUNC,

    func: (record) => <FormattedMessage id={record.isActive ? "active" : "inactive"} />,
  },
  {
    headerId: "cars",
    dataType: FUNC,

    func: (record) => <CarModal record={record} />,
  },
  {
    headerId: "components.city",
    dataType: FUNC,

    func: (record, locale) => record.area[`${locale}Name`],
  },
  {
    headerId: "email",
    dataType: FUNC,

    func: (record) => record.allyCompany.email,
  },
  { headerId: "common.actions", dataType: ACTIONS },
];
