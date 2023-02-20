import React from "react";
import PropTypes from "prop-types";
import { classNameWithCondition } from "functions";
import { FormattedMessage } from "react-intl";

export function ErrorMessage({ condition, errorMsg,locale }) {
  return (
    <p
      className={classNameWithCondition(
        condition,
        "visible",
        "invisible",
        `text-danger mt-1 ${locale == "en" ?   'text-left' : ""} `,
      )}
    >
      {condition ? <FormattedMessage id={errorMsg || ""} /> : ""}
    </p>
  );
}

ErrorMessage.propTypes = {
  condition: PropTypes.bool,
  errorMsg: PropTypes.string,
};
