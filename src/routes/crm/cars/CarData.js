/* eslint-disable prettier/prettier */
import React from "react";
import { dataTypes } from "constants/constants";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";
import { statusColor } from "functions/colors";
import moment from "moment";

const { TEXT, PRICE, BILINGUAL, ACTIONS, FUNC } = dataTypes;
/**
 * @name DisplayDateCityTime
 * @example of text output
 *     January 12, 2022
 *     Riyadh
 *     2:00 AM
 * @param {object} record
 * @param {string} locale
 * @param {string} location "DropOffCityName" || "PickUpCityName"
 * @param {string} date     "pickUpDate" || "dropOffDate"
 * @return {JSX}
 */
function DisplayDateCityTime(record, locale, location, date) {
  return (
    <div style={{ width: "max-content" }}>
      <div className="d-block w-100">
        <FormattedDate value={record[date]} day="numeric" month="long" year="numeric" />
      </div>
      <div className="d-block">{record[`${locale}${location}`]}</div>{" "}
      <div className="d-block">
        <FormattedTime value={record[date]} />
      </div>
    </div>
  );
}
export const CarData = [
  {
    headerId: "ally.name",

    dataType: FUNC,
    func: (record, locale) => record.branch?.allyCompany?.[`${locale}Name`],
  },
  {
    headerId: "car",

    dataType: FUNC,
    func: (record, locale) => (
      <span>
        {record.make?.[`${locale}Name`]} {record.carModel?.[`${locale}Name`]} {record.year}{" "}
        {record.carVersion?.[`${locale}Name`]}{" "}
      </span>
    ),
  },
  // {
  //   headerId: "car.model",
  //   dataType: FUNC,

  //   func: (record, locale) => record[`${locale}ModelName`],
  // },
  {
    headerId: "car.transmissionname",
    dataType: FUNC,
    func: (record, locale) => <FormattedMessage id={record.transmission} />,
  },
  {
    headerId: "cityName",
    dataType: FUNC,
    func: (record) => record.branch?.area?.name,
  },
  {
    headerId: "branchName",
    dataType: FUNC,
    func: (record, locale) => (
      <a href={`/cw/dashboard/branches/${record.branch.id}`} target="_blank">
        {record.branch?.[`${locale}Name`]}
      </a>
    ),
  },
  {
    headerId: "carcount",
    dataType: FUNC,
    func: (record, locale) => record.carsCount,
  },
  {
    headerId: "car.availabilityStatus",
    dataType: FUNC,

    func: (record, locale) => (
      <FormattedMessage id={record.availabilityStatus ? "active" : "inactive"} />
    ),
  },
  {
    headerId: "Rent.per",
    dataType: FUNC,

    func: (record, locale) => (
      <span>
        {record.dailyPrice}, {record.weeklyPrice} ,{record.monthlyPrice}{" "}
      </span>
    ),
    issortable: true,
    orderBy: "daily_price",
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
