import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { CustomerStatus } from "constants/constants";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";

export default function CustomerStatusDropDown({
  loading,
  setSelectedCustomerStatus,
  selectedCustomerStatus,
  error,
  valueAttribute,
}) {
  const { formatMessage } = useIntl();
  const currentList = CustomerStatus;

  const options =
    currentList?.map((x) => ({
      value: x.value,
      label: formatMessage({ id: x.label }),
    })) || [];
  React.useEffect(() => {
    if (!selectedCustomerStatus) {
      onClear();
    }
  }, [selectedCustomerStatus]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };
  return (
    <Select
      className={`dropdown-select ${error ? "selection-error" : ""}`}
      options={options}
      ref={selectInputRef}
      loadOptions={loading}
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedCustomerStatus}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedCustomerStatus}`)}
      placeholder={formatMessage({ id: "customer.status" })}
      onChange={(selection) => {
        setSelectedCustomerStatus(selection?.value);
      }}
      noOptionsMessage={() => {
        if (loading) {
          return <CircularProgress />;
        }
        if (!options?.length) return "no data found";
      }}
    />
  );
}
CustomerStatusDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedCustomerStatus: PropTypes.string,
  setSelectedCustomerStatus: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
