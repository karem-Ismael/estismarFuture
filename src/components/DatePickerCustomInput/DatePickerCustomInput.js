import { TextField } from "@material-ui/core";
import React, { forwardRef } from "react";
import { useIntl } from "react-intl";

import PropTypes from "prop-types";

/**
 *
 * @name formatDateObject
 * @description returns a string from the date object
 *    example: formatDateObject({ day: 22, month: 2, year: 2019})
 *    returns: `22/2/2019`
 * @param {object} date
 */
const formatDateObject = (date) => `${date.day}/${date.month}/${date.year}`;

/** @name DatePickerCustomInputSingle
 *  @exports
 *  @description An input to meke date picker looks like Material Ui inputs
 *  forwardRef is the right way to pass ref to another component
 */
export const DatePickerCustomInputSingle = forwardRef(({ labelId, date, ...props }, ref) => {
  const { formatMessage } = useIntl();

  return (
    <TextField
      className="datepicker-custom-field fit-available"
      label={formatMessage({ id: labelId || "missing" })}
      fullWidth={false}
      variant="outlined"
      ref={ref}
      value={date ? formatDateObject(date) : ""}
      {...props}
    />
  );
});

DatePickerCustomInputSingle.propTypes = {
  labelId: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
