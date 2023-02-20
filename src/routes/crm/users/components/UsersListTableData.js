import React from "react";
import { dataTypes } from "constants/constants";
import { FormattedDate, FormattedMessage } from "react-intl";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const usersTableData = [
  { headerId: "customers.list.customerId", dataType: TEXT, dataRef: "id" },
  { headerId: "customers.list.customerName", dataType: TEXT, dataRef: "name" },
  { headerId: "customers.list.customerPhoneNumber", dataType: TEXT, dataRef: "mobile" },
  { headerId: "customers.list.customerEmail", dataType: TEXT, dataRef: "email" },
  {
    headerId: "customers.list.createdDate",
    dataType: FUNC,
    dataRef: "createdAt",
    func: (record) =>
      record?.createdAt ? (
        <FormattedDate
          value={new Date(record?.createdAt?.split(" ")?.[0])}
          day="numeric"
          month="long"
          year="numeric"
        />
      ) : (
        "Missing Date"
      ),
  },
  {
    headerId: "customers.list.customerStatus",
    dataType: FUNC,
    dataRef: "status",
    func: (record) => (
      <span className={`badge badge-${record?.isActive ? "success" : "danger"}`}>
        <FormattedMessage id={record?.isActive ? "active" : "inactive"} />
      </span>
    ),
  },
  { headerId: "common.actions", dataType: ACTIONS },
];
