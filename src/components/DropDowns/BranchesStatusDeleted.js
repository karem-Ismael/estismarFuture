/* eslint-disable prettier/prettier */
import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import Select from "react-select";

export function BranchesStatusDeleted({
  loading,
  setSelecteStatus,
  selectedStatus,
  error,
  setIsDeltedFilterSelected,
}) {
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
  const options = [
    { value: "-1", label: formatMessage({ id: "components.all" }) },
    { value: "1", label: formatMessage({ id: "active" }) },
    { value: "0", label: formatMessage({ id: "inactive" }) },
    { value: "isDeleted", label: formatMessage({ id: "deleted" }) },
  ];

  return (
    <Select
      key={selectedStatus}
      value={options.find((i) => i.value === selectedStatus)}
      className={`dropdown-select ${error ? "selection-error" : ""}`}
      options={options}
      ref={selectInputRef}
      loadOptions={loading}
      placeholder={formatMessage({ id: "status" })}
      onChange={(selection) => {
        setSelecteStatus(selection?.value);
        console.log(selection?.value, "selection?.value");
        if (selection?.value === "isDeleted") {
          setIsDeltedFilterSelected(true);
        } else {
          setIsDeltedFilterSelected(false);
        }
      }}
    />
  );
}
BranchesStatusDeleted.propTypes = {
  loading: PropTypes.bool,
  selectedStatus: PropTypes.string,
  setSelecteStatus: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
