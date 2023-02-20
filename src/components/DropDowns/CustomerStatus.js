import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import Select from "react-select";

export default function CustomerStatus({ loading, setSelecteStatus, selectedStatus, error }) {
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
        { value: "active", label: formatMessage({ id: "active" }) },
        { value: "inactive", label: formatMessage({ id: "inactive" }) },
      ]}
      ref={selectInputRef}
      loadOptions={loading}
      value={[
        { value: "active", label: formatMessage({ id: "active" }) },
        { value: "inactive", label: formatMessage({ id: "inactive" }) },
      ].find((optn) => `${optn.value}` == `${selectedStatus}`)}
      placeholder={formatMessage({ id: "customerStatus" })}
      onChange={(selection) => {
        setSelecteStatus(selection?.value);
      }}
    />
  );
}
CustomerStatus.propTypes = {
  loading: PropTypes.bool,
  selectedStatus: PropTypes.string,
  setSelecteStatus: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
