import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { FormControlLabel, Switch, Tooltip } from "@material-ui/core";

function ToggleButton({ isActive, handleOpenDialog, id, isLoading }) {
  return (
    <Tooltip id="tooltip-top" title={<FormattedMessage id="toggle.title" />} placement="top">
      <FormControlLabel
        className="ml-1 mt-1"
        control={
          <Switch
            size="medium"
            color="primary"
            disabled={isLoading}
            checked={!!isActive}
            onChange={handleOpenDialog}
            id={id}
          />
        }
      />
    </Tooltip>
  );
}

ToggleButton.propTypes = {
  isActive: PropTypes.bool,
  handleOpenDialog: PropTypes.func,
  id: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default ToggleButton;
