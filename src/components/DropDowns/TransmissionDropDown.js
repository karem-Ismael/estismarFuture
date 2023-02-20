import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { transmissions } from "constants/constants";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";

export default function TransmissionDropDown({
  loading,
  setSelectedTransmission,
  selectedTransmission,
  error,
  valueAttribute,
  ...props
}) {
  const { formatMessage } = useIntl();
  const currentList = transmissions;

  const options =
    currentList?.map((x) => ({
      value: x.value,
      label: formatMessage({ id: x.label }),
    })) || [];
  React.useEffect(() => {
    if (!selectedTransmission) {
      onClear();
    }
  }, [selectedTransmission]);

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
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedTransmission}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedTransmission}`)}
      placeholder={formatMessage({ id: "car.transmissionname" })}
      onChange={(selection) => {
        setSelectedTransmission(selection?.value);
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
TransmissionDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedTransmission: PropTypes.string,
  setSelectedTransmission: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
