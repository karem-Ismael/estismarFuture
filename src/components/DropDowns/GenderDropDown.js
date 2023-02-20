import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { Gender } from "constants/constants";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";

export default function GenderDropDown({ selectedGender, setSelecteGender, loading, error }) {
  const { formatMessage } = useIntl();

  const options =
    Gender(formatMessage)?.map((x) => ({
      value: x.value,
      label: x.label,
    })) || [];

  React.useEffect(() => {
    if (!selectedGender) {
      onClear();
    }
  }, [selectedGender]);

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
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedGender}`)}
      value={options.find((optn) => `${optn.value}` == `${selectedGender}`)}
      placeholder={formatMessage({ id: "rental.gender" })}
      onChange={(selection) => {
        setSelecteGender(selection?.value);
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
GenderDropDown.propTypes = {
  loading: PropTypes.bool,
  selectedGender: PropTypes.string,
  setSelecteGender: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
