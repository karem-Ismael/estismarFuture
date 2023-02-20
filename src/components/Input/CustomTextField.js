/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
import React, { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import { classNameWithCondition } from "functions";

function CustomTextField({
  errormsg,
  type,
  onchange,
  onblur,
  value,
  error,
  name,
  placeholder,
  label,
  step,
  max,
  min,
  noLabel,
  ...props
}) {
  const { formatMessage } = useIntl();
  const CutomFieldRef = useRef();

  return (
    <>
      <TextField
        inputProps={{ type, step, min, max }}
        ref={CutomFieldRef}
        label={!noLabel ? label || formatMessage({ id: `${name}.label` }) : null}
        className="custom-textfield"
        fullWidth={false}
        variant="outlined"
        error={error}
        id={name}
        placeholder={
          placeholder !== ""
            ? placeholder
              ? placeholder
              : formatMessage({ id: `${name}.placeholder` })
            : null
        }
        value={value}
        onChange={onchange}
        onBlur={onblur}
        {...props}
      />
      <p
        className={classNameWithCondition(
          errormsg,
          "visible",
          "invisible",
          "text-danger mt-1 text-left",
        )}
      >
        {errormsg ? <FormattedMessage id={errormsg} /> : ""}
      </p>
    </>
  );
}

CustomTextField.propTypes = {
  errormsg: PropTypes.string,
  type: PropTypes.string,
  labelId: PropTypes.string,
  onchange: PropTypes.func,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  lbl: PropTypes.string,
  placeholder: PropTypes.string,
  step: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
};

export default CustomTextField;
