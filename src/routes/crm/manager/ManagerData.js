import React from "react";
import { dataTypes } from "constants/constants";
import { FormattedMessage } from "react-intl";
import moment from "moment";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const ManagerData = [
  {
    headerId: "managerId",
    dataRef: "id",
    dataType: TEXT,
  },
  {
    headerId: "manager.name",
    // dataRef: "name",
    dataType: FUNC,
    func: (record) => record.name,
  },
  {
    headerId: "email",
    dataType: FUNC,

    func: (record) => record.email,
  },
  {
    headerId: "components.mobileNumber",
    dataType: FUNC,
    func: (record) => record.user.mobile,
  },
  {
    headerId: "status",
    dataType: FUNC,

    func: (record, locale) => (
      <FormattedMessage id={record.user.isActive ? "active" : "inactive"} />
    ),
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
