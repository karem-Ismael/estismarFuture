import React from "react";
import { dataTypes } from "constants/constants";
import { FormattedMessage } from "react-intl";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const ExtraSerivceData = [
  {
    headerId: "serviceid",
    dataRef: "id",
    dataType: TEXT,
  },
  {
    headerId: "arTitle",
    dataRef: "arTitle",
    dataType: TEXT,
  },
  {
    headerId: "enTitle",
    dataRef: "enTitle",
    dataType: TEXT,
  },
  {
    headerId: "arDescription",

    dataType: FUNC,
    func: (record) => (
      <p style={{ marginRight: "-6px" }}>{`${record.arDescription.substring(0, 45)}...`} </p>
    ),
  },
  {
    headerId: "enDescription",

    dataType: FUNC,
    func: (record) => `${record.enDescription.substring(0, 45)}...`,
  },
  {
    headerId: "status",
    dataType: FUNC,

    func: (record) => <FormattedMessage id={record?.isActive ? "active" : "inactive"} />,
  },
  { headerId: "common.actions", dataType: ACTIONS },
];
