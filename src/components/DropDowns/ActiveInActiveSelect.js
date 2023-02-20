import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import Select from "react-select";

export function ActiveInActiveSelect({ loading, setSelecteStatus, selectedStatus, error }) {
  const { formatMessage } = useIntl();

  React.useEffect(() => {
    if (!selectedStatus) {
      onClear();
    }
  }, [selectedStatus]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };

  return (
    <Select
      className={`dropdown-select ${error ? "selection-error" : ""}`}
      options={[
        { value: "-1", label: formatMessage({ id: "components.all" }) },
        { value: "1", label: formatMessage({ id: "active" }) },
        { value: "0", label: formatMessage({ id: "inactive" }) },
        { value: "2", label: formatMessage({ id: "Deleted" }) },

      ]}
      ref={selectInputRef}
      loadOptions={loading}
      placeholder={formatMessage({ id: "status" })}
      onChange={(selection) => {
        setSelecteStatus(selection?.value);
      }}
    />
  );
}
ActiveInActiveSelect.propTypes = {
  loading: PropTypes.bool,
  selectedStatus: PropTypes.string,
  setSelecteStatus: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
