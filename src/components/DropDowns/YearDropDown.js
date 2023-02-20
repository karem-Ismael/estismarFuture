import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { generateArrayOfYears } from "constants/constants";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";

export default function YearDropDown({
  loading,
  setSelectedYear,
  selectedYear,
  error,
  valueAttribute,
}) {
  const { formatMessage } = useIntl();
  const currentList = generateArrayOfYears();

  const options =
    currentList?.map((x) => ({
      value: x,
      label: x,
    })) || [];

  React.useEffect(() => {
    if (!selectedYear) {
      onClear();
    }
  }, [selectedYear]);

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
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedYear}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedYear}`)}
      placeholder={formatMessage({ id: "car.year" })}
      onChange={(selection) => {
        setSelectedYear(selection?.value);
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
YearDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedYear: PropTypes.string,
  setSelectedYear: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
