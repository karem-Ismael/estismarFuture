import React from "react";
import moment from "moment";
import "moment/locale/ar";
import "moment/locale/en-gb";

export function toTimestamp(date) {
  return new Date(date).getTime() / 1000;
}

/**
 * @name reversedDateReshape
 * @export
 * @param {*} date that looks like "2021-12-12"
 * @returns {string} date formate "dd-mm-yyyy"
 */
export function reversedDateReshape(date) {
  if (!Array.isArray(date?.split("-"))) {
    return;
  }
  const [year, month, day] = date?.split("-");
  return `${day}-${month}-${year}`;
}

export function timeStampToLocaleString(ts, locale, format) {
  return moment(new Date(ts * 1000)).format(format || "DD/MM/YYYY");
}

export function timeStampDateTime(ts) {
  return (
    <span dir="ltr">
      {moment(new Date(ts * 1000)).format("DD/MM/YYYY")}
      <br />
      {moment(new Date(ts * 1000)).format(" HH:mm a")}
    </span>
  );
}

export const today = () => new Date();

export const tomorrow = () => {
  const day = new Date();
  day.setDate(day.getDate() + 1);
  return day;
};

export const yesterday = () => {
  const day = new Date();
  day.setDate(day.getDate() - 1);
  return day;
};

export function daysDifference(pickUpDate, dropOffDate, status) {
  const pickupDateDiff = moment(new Date()).diff(pickUpDate, "days");
  const dropOffDateDiff = moment(new Date()).diff(pickUpDate, "days");
  if (
    (pickupDateDiff >= 0 && dropOffDateDiff >= 0) ||
    ["invoiced", "closed", "cancelled"].includes(status)
  ) {
    return "STOP_EDIT";
  }
  if ((pickupDateDiff >= 0 && dropOffDateDiff >= 0) || ["pending", "confirmed"].includes(status)) {
    return "CAN_CHANGE_ONLY_STATUS";
  }
  if (status !== "car_received" && pickupDateDiff > 0 && dropOffDateDiff < 0) return "IN_BETWEEN";
  if (pickUpDate < 0 && dropOffDate < 0) {
    return "CAN_BE_EDITED";
  }
}
