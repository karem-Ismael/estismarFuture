import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { persist, PaymentMethod ,PaymentMethodWithAll} from "constants/constants";

export default function PaymentDropDown({
  loading,
  setSelectedPayment,
  selectedPayment,
  error,
  disabled,
  coupon,
  valueAttribute,
  ...props
}) {
  const { locale, formatMessage } = useIntl();
  const options = coupon ? PaymentMethodWithAll(formatMessage) : PaymentMethod(formatMessage);
  React.useEffect(() => {
    if (!selectedPayment) {
      onClear();
    }
  }, [selectedPayment]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };
  return (
    <Select
      className={`dropdown-select ${error ? "selection-error" : ""}`}
      options={options}
      ref={selectInputRef}
      isDisabled={disabled}

      defaultValue={options?.find((optn) => `${optn.value}` === `${selectedPayment}`)}
      value={options?.find((optn) => `${optn.value}` == `${selectedPayment}`)}
      placeholder={formatMessage({ id: "paymentmethod" })}
      onChange={(selection) => {
        setSelectedPayment(selection?.value);
      }}
      noOptionsMessage={() => {
        if (gettingModels) {
          return <CircularProgress />;
        }
        if (!options?.length) return "no data found";
      }}
      {...props}
    />
  );
}
PaymentDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedPayment: PropTypes.string,
  setSelectedPayment: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
