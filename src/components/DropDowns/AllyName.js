import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { CompaniesName } from "gql/queries/GetCompaniesName.gql";

import { persist } from "constants/constants";

export default function AllyDropDown({
  loading,
  setSelectedAlly,
  selectedAlly,
  error,
  valueAttribute,
  onAllyChange,
  required,
  multiple,
  setList,
  ...props
}) {
  const { data, loading: getCompanies } = useQuery(CompaniesName, {
    variables: { limit: 500 },
  });
  const { locale, formatMessage } = useIntl();
  const [allSelected, setAllSelected] = useState(false);

  const options =
    data?.allyCompanies?.collection?.map((x) => ({
      value: x[valueAttribute || "enName"],
      label: x[`${locale}Name`],
    })) || [];

  useEffect(() => {
    if (data && setList) {
      setList(data?.allyCompanies?.collection?.length);
    }
  }, [data]);

  React.useEffect(() => {
    if (!selectedAlly) {
      onClear();
    }
  }, [selectedAlly]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };
  return (
    <Select
      className={`dropdown-select ${multiple ? "multiple" : ""}  ${required ? "required" : ""} ${
        error ? "selection-error" : ""
      }`}
      options={[{ value: "all", label: formatMessage({ id: "widgets.all" }) }, ...options]}
      ref={selectInputRef}
      isMulti={multiple}
      loadOptions={getCompanies || loading}
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedAlly}`)}
      value={
        multiple
          ? options?.filter((optn, index) => selectedAlly.includes(+optn.value))
          : options.find((optn) => `${optn.value}` === `${selectedAlly}`)
      }
      placeholder={formatMessage({ id: "ally.name" })}
      onChange={(selection) => {
        if (!selection && multiple) {
          setSelectedAlly([]);
          return;
        }
        if (multiple) {
          if (selection[0].value == "all" || selection[selection.length - 1].value == "all") {
            const ally = options.filter((onselectoion) => onselectoion.value != "all");
            setAllSelected(true);
            setSelectedAlly(ally);
            return;
          }
          setAllSelected(false);
          setSelectedAlly(selection);
          return;
        }
        setSelectedAlly(+selection?.value);
        onAllyChange(+selection?.value);
      }}
      noOptionsMessage={() => {
        if (getCompanies) {
          return <CircularProgress />;
        }
        if (!options?.length) return "no data found";
      }}
      {...props}
    />
  );
}
AllyDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedAlly: PropTypes.string,
  setSelectedAlly: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
