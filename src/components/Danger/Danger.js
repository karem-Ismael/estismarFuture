import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

export function DangerFormattedMessage({ msgId }) {
  return (
    <p className="text-danger mt-2">
      <FormattedMessage id={msgId} />
    </p>
  );
}

DangerFormattedMessage.propTypes = {
  msgId: PropTypes.string,
};
