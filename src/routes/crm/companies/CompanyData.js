/* eslint-disable prettier/prettier */
import React from "react";
import { dataTypes } from "constants/constants";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const CompanyData = [
  {
    headerId: "Ally.ID",
    dataRef: "id",
    dataType: TEXT,
  },
  {
    headerId: "company.logo",
    dataRef: "logo",
    dataType: FUNC,
    func: (record) => <img src={record.logo} alt="Logo" width="50px" />,
  },
  {
    headerId: "company.managerName",
    dataRef: "managerName",
    dataType: TEXT,
  },
  {
    headerId: "phoneNumber",
    dataRef: "phoneNumber",
    dataType: TEXT,
  },
  {
    headerId: "status",
    dataType: FUNC,
    func: (record) => (record.isActive ? "Active" : "inActive"),
  },
  {
    headerId: "company.Class",
    dataRef: "allyClass",
    dataType: TEXT,
  },
  {
    headerId: "email",
    dataRef: "email",
    dataType: TEXT,
  },

  { headerId: "common.actions", dataType: ACTIONS },
];
