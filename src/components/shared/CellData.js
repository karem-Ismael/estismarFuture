/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/**
 * Cell Data
 */

import React from "react";
import { FormattedDate, FormattedMessage } from "react-intl";
import { dataTypes, Alert } from "constants/constants";

/**
 * @name CellData
 * @description It takes data and row details to return each cell output
 * @param {any} data
 * @param {any} record
 * @param {any} locale
 * @returns {JSX | string} Cell Content in a table
 */
import { Link } from "react-router-dom";
import store from "../../store";

const {
  TEXT,
  PRICE,
  DATE,
  FUNC,
  DATETIME,
  TIME,
  BILINGUAL,
  TRANSLATE,
  ACTIONS,
  ASSIGNBOOKING,
  REFUNDBOOKING,
} = dataTypes;

function CellData({ data, record, locale, actions, actionsArgs, AssignBooking, RefundBooking }) {
  const dataValue = record[data?.dataRef];
  const { ally_id } = store.getState()?.authUser.user;

  switch (true) {
    case data?.dataType === ASSIGNBOOKING && !ally_id:
      return AssignBooking(record);
    case data?.dataType === REFUNDBOOKING:
      return RefundBooking(record);
    case data?.dataType === ACTIONS:
      return actionsArgs?.length
        ? actions(Object.assign(...actionsArgs?.map((key) => ({ [key]: record[key] }), {})))
        : "";

    case data?.dataType === TRANSLATE:
      return <FormattedMessage id={dataValue} />;

    case data?.dataType === BILINGUAL && (!data?.bilingual?.ar || !data?.bilingual?.en):
      return Alert("Missing Locale In Bilingual");

    case data?.dataType === BILINGUAL:
      return record[data.bilingual[locale]];

    case data?.dataType === FUNC && !data.func:
      return Alert("Missing Function to handle data");

    case data?.dataType === FUNC:
      return data?.htmlElement === "link" ? (
        <Link to={`/cw/dashboard/customers/${data?.userId(record)}`}>
          {data.func(record, locale)}
        </Link>
      ) : (
        data.func(record, locale)
      );
    case data?.dataType === TEXT:
      return data?.dataRef === "additionalNotes" && data?.dataRef?.length > 10
        ? dataValue.substring(0, 10)
        : dataValue;
    case data?.dataType === TIME:
      return <FormattedDate value={dataValue} hour="numeric" minute="numeric" />;

    case data?.dataType === PRICE:
      return <FormattedMessage id="amount.sar" values={{ amount: dataValue }} />;

    case data?.dataType === DATE && data?.dataRef?.length === 0:
      return Alert("Missing data can give false value of today");

    case data?.dataType === DATE:
      return <FormattedDate value={dataValue} day="numeric" month="short" year="numeric" />;

    case data?.dataType === DATETIME:
      return (
        <FormattedDate
          value={dataValue}
          day="numeric"
          month="long"
          year="numeric"
          hour="numeric"
          minute="numeric"
        />
      );

    default:
      break;
  }
}

export default CellData;
