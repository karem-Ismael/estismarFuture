import React from "react";
import PropTypes from "prop-types";
import { TextField, CircularProgress } from "@material-ui/core";
import { useIntl } from "react-intl";

function AsyncLoader({ loading, labelId, params, error }) {
  const { formatMessage } = useIntl();
  return (
    <TextField
      {...params}
      error={error}
      className="custom-textfield"
      label={formatMessage({ id: labelId })}
      variant="outlined"
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  );
}
AsyncLoader.propTypes = {
  loading: PropTypes.bool,
  labelId: PropTypes.string,
  params: PropTypes.object,
  error: PropTypes.bool,
};

export default AsyncLoader;
