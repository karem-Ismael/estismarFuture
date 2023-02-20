import React from "react";
import PropTypes from "prop-types";
import { RadioGroup } from "@material-ui/core";

function RadioGroupContainer({ value, poisiton, children }) {
  return (
    <RadioGroup
      row
      aria-label="position"
      name="position"
      defaultValue={poisiton || "top"}
      value={value}
    >
      {children}
    </RadioGroup>
  );
}

RadioGroupContainer.propTypes = {
  value: PropTypes.any,
  children: PropTypes.any,
  poisiton: PropTypes.oneOf(["top", "bottom", "right", "left"]),
};

export default RadioGroupContainer;
