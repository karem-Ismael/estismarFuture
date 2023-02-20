import React from "react";
import PropTypes from "prop-types";
import { FormControl, FormLabel } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

function FormControlLabelContainer({ children, labelId }) {
  return (
    <FormControl component="fieldset" className="m-2">
      <FormLabel component="legend">
        <FormattedMessage id={labelId || "missing.message"} />
      </FormLabel>
      {children}
    </FormControl>
  );
}

FormControlLabelContainer.propTypes = {
  children: PropTypes.any,
  labelId: PropTypes.string,
};

export default FormControlLabelContainer;
