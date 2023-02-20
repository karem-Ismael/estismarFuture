/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { FormControl, Input, InputAdornment, IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import { classNameWithCondition } from "functions";

function CustomMuiInput(props) {
  const { handleChange, iconClassName, className, errormsg, icon } = props;
  const [toggle, setToggle] = useState("");
  return (
    <FormControl fullWidth className="has-wrapper">
      <Input
        type={toggle || props.type}
        className={className || "has-input input-lg"}
        onChange={(event) => handleChange(event)}
        endAdornment={
          icon && (
            <InputAdornment position="end">
              <IconButton>{icon}</IconButton>
            </InputAdornment>
          )
        }
        {...props}
      />
      {iconClassName && (
        <span
          onClick={() => {
            setToggle(props.type === "password" ? "text" : "");
          }}
          className="has-icon"
        >
          <i className={iconClassName} />
        </span>
      )}
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
    </FormControl>
  );
}

CustomMuiInput.propTypes = {
  handleChange: PropTypes.func,
  iconClassName: PropTypes.string,
  errormsg: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.element,
};

export default CustomMuiInput;
