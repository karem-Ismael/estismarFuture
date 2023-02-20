import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { BookingStatus } from "constants/constants";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";

export default function BookingStatusDropDown({
  loading,
  setSelectedBookingStatus,
  selectedBookingStatus,
  error,
  valueAttribute,
}) {
  const { formatMessage } = useIntl();
  const currentList = BookingStatus;

  const options =
    currentList?.map((x) => ({
      value: x.value,
      label: formatMessage({ id: x.label }),
    })) || [];
  React.useEffect(() => {
    if (!selectedBookingStatus) {
      onClear();
    }
  }, [selectedBookingStatus]);

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
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedBookingStatus}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedBookingStatus}`)}
      placeholder={formatMessage({ id: "rental.bookingStatus" })}
      onChange={(selection) => {
        setSelectedBookingStatus(selection?.value);
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
BookingStatusDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedBookingStatus: PropTypes.string,
  setSelectedBookingStatus: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
