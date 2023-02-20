/* eslint-disable prettier/prettier */
import React from "react";
import { Link } from "react-router-dom";
import { dataTypes } from "constants/constants";
import { FormattedMessage } from "react-intl";
import { statusColor } from "functions/colors";
import moment from "moment";
import store from "../../../../store";
const { TEXT, PRICE, ACTIONS, FUNC, ASSIGNBOOKING, REFUNDBOOKING } = dataTypes;

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

function DisplayDateCityTime(record, locale, location, date, time) {
  return (
    <div style={{ minWidth: "max-content", fontSize: "small" }}>
      {moment(record[date]).locale(locale).format("LL")}
      <br />
      <div style={{ maxWidth: "100px" }}>{record[`${locale}${location}`]}</div>
      {moment(record[time], "HH:mm:ss").locale(locale).format("hh:mm A")}
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
    dataRef: "AllyName",
    dataType: FUNC,
    func: (record, locale) => (
      <Link to={`/cw/dashboard/companies/${record.allyCompanyId}`}>
        {record[`${locale}AllyName`]}
      </Link>
    ),
  },
  { headerId: "branch", dataRef: "branchName", dataType: TEXT },

  {
    headerId: "car",
    bilingual: { ar: "arMakeName", en: "enMakeName" },
    dataType: FUNC,
    func: (record, locale) =>
      `${record[`${locale}MakeName`]} - ${record[`${locale}ModelName`]} - 
      ${record[`${locale}VersionName`]} - ${record.year}`,
  },
  {
    headerId: "bookings.list.numberOfDaysToBeRented",
    dataRef: "numberOfDays",
    dataType: TEXT,
    orderBy: "number_of_days",
    issortable: true,
  },
  { headerId: "paymentMethod", dataType: REFUNDBOOKING },

  {
    headerId: "bookings.list.carRentPricePerDay",
    dataRef: "pricePerDay",
    dataType: PRICE,
    orderBy: "price_per_day",
    issortable: true,
  },
  {
    headerId: "bookings.list.header.billingAmount",
    dataRef: "totalBookingPrice",
    dataType: PRICE,
    orderBy: "total_booking_price",
    issortable: true,
  },
  { headerId: "bookings.list.paidAmount", dataRef: "totalInsurancePrice", dataType: PRICE },
  {
    headerId: "businessBookings.list.pickup_date_time",
    dataRef: "pickUpDate",
    dataType: FUNC,
    func: (record, locale) =>
      DisplayDateCityTime(record, locale, "PickUpCityName", "pickUpDate", "pickUpTime"),
    orderBy: "pick_up_datetime",
    issortable: true,
  },
  {
    headerId: "businessBookings.list.dropoff_date_time",
    dataRef: "dropOffDate",
    dataType: FUNC,
    func: (record, locale) =>
      DisplayDateCityTime(record, locale, "DropOffCityName", "dropOffDate", "dropOffTime"),
    orderBy: "drop_off_datetime",
    issortable: true,
  },
  {
    headerId: "bookings.list.bookingStatus",
    dataRef: "status",
    dataType: FUNC,
    func: (record) => (
      <>
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
        <div>{record.lastRentalDateExtensionRequest && <FormattedMessage id="extend" />}</div>
      </>
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
