import { dataTypes } from "constants/constants";

const { TEXT, ACTIONS, FUNC } = dataTypes;

export const RoleData = [
  {
    headerId: "arName",
    dataRef: "arName",
    dataType: TEXT,
  },
  {
    headerId: "arDescription",
    dataType: FUNC,
    func: (record) => `${record.arDescription}`,
  },
  { headerId: "enName", dataRef: "enName", dataType: TEXT },
  {
    headerId: "enDescription",
    dataType: FUNC,
    func: (record) => `${record.enDescription}`,
  },

  { headerId: "common.actions", dataType: ACTIONS },
];
