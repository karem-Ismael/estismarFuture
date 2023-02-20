import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { persist, PaymentStatusMethod } from "constants/constants";

export default function PaymentStatusDropDown({
  loading,
  setSelectedPaymentStatus,
  selectedPaymentStatus,
  error,
  valueAttribute,
  ...props
}) {
  const { locale, formatMessage } = useIntl();
  const options = PaymentStatusMethod(formatMessage) || [];
  React.useEffect(() => {
    if (!selectedPaymentStatus) {
      onClear();
    }
  }, [selectedPaymentStatus]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };
  return (
    <Select
      className={`dropdown-select ${error ? "selection-error" : ""}`}
      options={options}
      ref={selectInputRef}
      defaultValue={options?.find((optn) => `${optn.value}` === `${selectedPaymentStatus}`)}
      value={options?.find((optn) => `${optn.value}` == `${selectedPaymentStatus}`)}
      placeholder={formatMessage({ id: "Payment status" })}
      onChange={(selection) => {
        setSelectedPaymentStatus(selection?.value);
      }}
      noOptionsMessage={() => {
        if (loading) {
          return <CircularProgress />;
        }
        if (!options?.length) return "no data found";
      }}
      {...props}
    />
  );
}
PaymentStatusDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedPayment: PropTypes.string,
  setSelectedPayment: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
