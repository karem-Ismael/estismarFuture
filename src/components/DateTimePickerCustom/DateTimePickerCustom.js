import React from "react";
import PropTypes from "prop-types";
import { DateTimePicker } from "@material-ui/pickers";
import { NavigateNext, NavigateBefore, Event } from "@material-ui/icons";
import { IconButton, InputAdornment } from "@material-ui/core";

/**
 * @name DateTimePickerCustom
 * @description Material ui custom date picker to prevent repeated code
 * for more details visit https://material-ui-pickers.dev/api/DateTimePicker
 * @export
 * @param {*} { value, onChange, ...props }
 * @return {JSX}
 */
export default function DateTimePickerCustom({ ...props }) {
  return (
    <div className="mt-2 mb-2">
      <DateTimePicker
        ampm={false}
        allowKeyboardControl={false}
        minutesStep={30}
        hideTabs
        strictCompareDates
        leftArrowIcon={<NavigateBefore />}
        leftArrowButtonProps={{ "aria-label": "Prev month" }}
        rightArrowButtonProps={{ "aria-label": "Next month" }}
        rightArrowIcon={<NavigateNext />}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <Event />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </div>
  );
}

DateTimePickerCustom.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};
