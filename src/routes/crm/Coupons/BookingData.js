import React from "react";
import { Link } from "react-router-dom";
import { dataTypes } from "constants/constants";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";
import { statusColor } from "functions/colors";

const { TEXT, FUNC } = dataTypes;

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

function DisplayDateCityTime(record, locale, location, utcDate, utcTime) {
  // convert to local timezone
  let utcDateTime = `${record[utcDate]} ${record[utcTime]} `;
  let toLocalDateTime = new Date(utcDateTime);
  const timerep = new Date(toLocalDateTime).toLocaleTimeString();
  return (
    <div style={{ minWidth: "max-content", fontSize: "small" }}>
      <FormattedDate value={record[utcDate]} day="numeric" month="long" year="numeric" />
      <br />
      <div style={{ maxWidth: "100px" }}>{record[`${locale}${location}`]}</div>
      <FormattedTime value={`${record[utcDate]} ${timerep}`} />
      {/* {tConvert(record[utcTime])} */}
    </div>
  );
}

export const BookingData = [
  { headerId: "bookingId.placeholder", dataType: TEXT, dataRef: "id" },
  {
    headerId: "bookings.list.customerName",
    dataRef: "customerName",
    dataType: FUNC,
    func: (record) => (
      <Link to={`/cw/dashboard/customers/${record.userId}`}>{record.customerName}</Link>
    ),
  },

  {
    headerId: "bookings.list.pickup",
    dataRef: "pickUpDate",
    dataType: FUNC,
    func: (record, locale) =>
      DisplayDateCityTime(record, locale, "PickUpCityName", "pickUpDate", "pickUpTime"),
  },
  {
    headerId: "discountValue.label",
    dataRef: "couponDiscount",

    dataType: TEXT,
  },

  {
    headerId: "bookings.list.bookingStatus",
    dataRef: "status",
    dataType: FUNC,
    func: (record) => (
      <div className="d-flex">
        {record.isIntegratedRental && <div className="badge badge-info mr-2">Api</div>}
        <div
          className={`badge badge-${statusColor(record.status)}`}
          style={{ backgroundColor: statusColor(record.status), maxWidth: "fit-content" }}
        >
          <p className="m-0 p-0 font-weight-light" style={{ fontSize: "small" }}>
            {record.status && <FormattedMessage id={record.status.toUpperCase()} />}
          </p>
          <p className="m-0 p-0 font-weight-light" style={{ fontSize: "small" }}>
            {record?.subStatus && <FormattedMessage id={record?.subStatus?.toUpperCase()} />}
          </p>
        </div>
      </div>
    ),
  },
];
