/* eslint-disable prettier/prettier */
import React from "react";
import { Link } from "react-router-dom";
import { dataTypes } from "constants/constants";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";
import { statusColor } from "functions/colors";
import moment from "moment";
import store from "../../../../store";
import Refund from "./Refund";
const { TEXT, PRICE, BILINGUAL, ACTIONS, FUNC, ASSIGNBOOKING, REFUNDBOOKING } = dataTypes;

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
// function tConvert(time) {
//   // Check correct time format and split into components
//   time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

//   if (time.length > 1) {
//     // If time format correct
//     time = time.slice(1); // Remove full string match value
//     time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
//     time[0] = +time[0] % 12 || 12; // Adjust hours
//   }
//   return time.join(""); // return adjusted time or original string
// }
function DisplayDateCityTime(record, locale, location, dateTime) {
  return (
    <div style={{ minWidth: "max-content", fontSize: "small" }}>
      {moment(record[dateTime]).locale(locale).format("LL")}
      <br />
      <div style={{ maxWidth: "100px" }}>{record[`${locale}${location}`]}</div>
      {moment(record[dateTime]).locale(locale).format("hh:mm A")}
    </div>
  );
}
const { ally_id } = store.getState()?.authUser.user;

export const bookingTableData = [
  {
    headerId: "bookingId.placeholder",
    dataType: TEXT,
    dataRef: "id",
    orderBy: "id",
    issortable: true,
  },
  { headerId: "bookingNo.placeholder", dataType: TEXT, dataRef: "bookingNo" },
  {
    headerId: "bookings.list.customerName",
    dataRef: "customerName",
    dataType: FUNC,
    func: (record) => (
      <Link to={`/cw/dashboard/customers/${record.userId}`}>{record.customerName}</Link>
    ),
  },
  {
    headerId: "bookings.list.allyName",
    dataType: FUNC,
    func: (record, locale) => (
      <Link to={`/cw/dashboard/companies/${record?.acceptedOffer?.allyCompanyId}`}>
        {record?.acceptedOffer?.allyCompanyName}
      </Link>
    ),
  },
  { headerId: "rental.insuranceType", dataRef: "insuranceName", dataType: TEXT },
  { headerId: "bookings.list.pickupCity", dataRef: "pickUpCityName", dataType: TEXT },

  {
    headerId: "car",
    bilingual: { ar: "arMakeName", en: "enMakeName" },
    dataType: FUNC,
    func: (record, locale) =>
      `${record[`${locale}MakeName`]} - ${record[`${locale}ModelName`]} - ${record.year}`,
  },
  {
    headerId: "Duration in months",
    dataRef: "numberOfMonths",
    dataType: TEXT,
    orderBy: "number_of_months",
    issortable: true,
  },
  { headerId: "numberOfCars", dataRef: "numberOfCars", dataType: TEXT },
  {
    headerId: "bookings.list.pickup",
    dataRef: "pickUpDatetime",
    dataType: FUNC,
    func: (record, locale) =>
      DisplayDateCityTime(record, locale, "PickUpCityName", "pickUpDateTime"),
    orderBy: "pick_up_datetime",
    issortable: true,
  },
  {
    headerId: "bookings.list.delivery",
    dataRef: "dropOffDatetime",
    dataType: FUNC,
    func: (record, locale) =>
      DisplayDateCityTime(record, locale, "DropOffCityName", "dropOffDateTime"),
    orderBy: "drop_off_datetime",
    issortable: true,
  },
  {
    headerId: "bookings.list.header.billingAmountMonth",
    dataRef: "pricePerMonth",
    dataType: TEXT,
    orderBy: "price_per_month",
    issortable: true,
  },
  {
    headerId: "bookings.list.header.billingAmount",
    dataRef: "totalBookingPrice",
    dataType: TEXT,
    orderBy: "total_booking_price",
    issortable: true,
  },
  {
    headerId: "bookings.list.paidAmount",
    func: (record) =>
      `${
        record?.acceptedOffer?.carInsuranceFull * record?.numberOfMonths ||
        record?.acceptedOffer?.carInsuranceStandard * record?.numberOfMonths
      }`,
    dataType: FUNC,
  },
  // {
  //   headerId: "businessBookings.list.dropoff_date_time",
  //   dataRef: "dropOffDatetime",
  //   dataType: FUNC,
  //   func: (record) => {
  //     const date = moment.utc(record.dropOffDatetime);
  //     return date.local().format("DD/MM/YYYY HH:mm:ss");
  //   },
  // },
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
  {
    headerId: "createdAt",
    dataRef: "createdAt",
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
    orderBy: "created_at",
    issortable: true,
  },
  !ally_id ? { headerId: "Assign", dataType: ASSIGNBOOKING } : null,
  { headerId: "common.actions", dataType: ACTIONS },
];
