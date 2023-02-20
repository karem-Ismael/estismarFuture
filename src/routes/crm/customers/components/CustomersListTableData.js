import React from "react";
import { dataTypes } from "constants/constants";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const customersTableData = [
  { headerId: "customers.list.customerId", dataType: TEXT, dataRef: "id" },
  { headerId: "customers.list.customerName", dataType: TEXT, dataRef: "name" },
  { headerId: "customers.list.customerPhoneNumber", dataType: TEXT, dataRef: "mobile" },
  { headerId: "customers.list.customerEmail", dataType: TEXT, dataRef: "email" },
  {
    headerId: "customers.status",
    dataType: FUNC,

    func: (record) =>
      record.customerProfile?.blockingStatus == "blocked" ? (
        <div className="p-3 mb-2 bg-dark text-white">
          <FormattedMessage id="blocked" />
        </div>
      ) : record.customerProfile?.blockingStatus == "partially_blocked" ? (
        <div className="p-3 mb-2 bg-warning text-white">
          <FormattedMessage id="partially_blocked" />
        </div>
      ) : null,
  },

  // TODO: Add Completed trips
  // { headerId: "customers.list.numberOfCompletedTrips", dataType: TEXT, dataRef: "completedTrips" },
  {
    headerId: "bookings",
    dataType: FUNC,
    dataRef: "booking",
    func: (record) => (
      <>
        <div>
          <Link to={`bookings?{"userId":"${record.id}"}`}>
            <FormattedMessage id="bookings" />
          </Link>
        </div>
      </>
    ),
  },
  {
    headerId: "customers.list.createdDate",
    dataType: FUNC,
    dataRef: "createdAt",
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
