import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { availabillityStatus } from "constants/constants";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";

export default function AvailabillityStatueDropDown({
  loading,
  setSelectedAvailabilityStatus,
  selectedAvailabilityStatus,
  error,
  valueAttribute,
}) {
  const { formatMessage } = useIntl();
  const currentList = availabillityStatus;

  const options =
    currentList?.map((x) => ({
      value: x.value,
      label: formatMessage({ id: x.label }),
    })) || [];
  React.useEffect(() => {
    if (!selectedAvailabilityStatus) {
      onClear();
    }
  }, [selectedAvailabilityStatus]);

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
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedAvailabilityStatus}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedAvailabilityStatus}`)}
      placeholder={formatMessage({ id: "car.availabilityStatus" })}
      onChange={(selection) => {
        setSelectedAvailabilityStatus(selection?.value);
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
AvailabillityStatueDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedAvailabilityStatus: PropTypes.string,
  setSelectedAvailabilityStatus: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
