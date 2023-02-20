/* eslint-disable prettier/prettier */
import React from "react";
import { FormattedMessage } from "react-intl";
import { dataTypes } from "constants/constants";

const { TEXT, ACTIONS, FUNC, DATE } = dataTypes;

export const BusinessRequestsData = [
  {
    headerId: "Request ID",
    dataRef: "id",
    dataType: TEXT,
  },
  {
    headerId: "Customer",
    dataType: FUNC,
    htmlElement: "link",
    userId: (record) => record.userId,
    func: (record) => record.customerName
  },
  {
    headerId: "Make",
    dataRef: "makeName",
    dataType: TEXT,
  },
  {
    headerId: "Model",
    dataRef: "modelName",
    dataType: TEXT,
  },
  {
    headerId: "Year",
    dataRef: "year",
    dataType: TEXT,
  },
  {
    headerId: "Car numbers",
    dataRef: "numberOfCars",
    dataType: TEXT,
  },
  {
    headerId: "City",
    dataRef: "pickUpCityName",
    dataType: TEXT,
  },
  {
    headerId: "Duration in months",
    dataRef: "numberOfMonths",
    dataType: TEXT,
  },
  {
    headerId: "Expected pick up date",
    dataRef: "pickUpDatetime",
    dataType: DATE,
  },
  {
    headerId: "Insurance type",
    dataRef: "insuranceName",
    dataType: TEXT,
  },
  {
    headerId: "Additional notes",
    dataRef: "additionalNotes",
    dataType: TEXT, 
  },
  { headerId: "common.actions", dataType: ACTIONS },
];
