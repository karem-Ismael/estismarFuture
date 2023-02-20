/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from "react";
import { AllAreas } from "gql/queries/Areas.queries.gql";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";

export function CitiesDropDown({
  loading,
  setSelectedCity,
  selectedCity,
  valueAttribute,
  multiple,
  error,
  required,
  setList,
  ...props
}) {
  const { data: AreasRes, loading: gettingAreas } = useQuery(AllAreas);
  const { locale, formatMessage } = useIntl();
  const options =
    AreasRes?.areas?.map((x) => ({
      value: x?.[valueAttribute],
      label: x?.[`${locale}Name`],
      id: x.id,
    })) || [];

  React.useEffect(() => {
    if (!selectedCity) {
      onClear();
    }
  }, [selectedCity]);

  React.useEffect(() => {
    if (AreasRes && setList) {
      setList(AreasRes?.areas?.length);
    }
  }, [AreasRes]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };

  return (
    options && (
      <Select
        className={`dropdown-select ${multiple ? "multiple" : ""}  ${required ? "required" : ""} ${
          error ? "selection-error" : ""
        }`}
        options={[{ value: "all", label: formatMessage({ id: "widgets.all" }) }, ...options]}
        ref={selectInputRef}
        isMulti={multiple}
        defaultValue={options.find((optn) => `${optn.value}` === `${selectedCity}`)}
        value={
          multiple
            ? options?.filter((optn, index) => selectedCity.includes(+optn.value))
            : options.find((optn) => `${optn.value}` === `${selectedCity}`)
        }
        loadOptions={gettingAreas || loading}
        placeholder={formatMessage({ id: "components.city" })}
        onChange={(selection) => {
          if (!selection && multiple) {
            setSelectedCity([]);
            return;
          }
          if (multiple) {
            if (selection[0].value == "all" || selection[selection.length - 1].value == "all") {
              const city = options.filter((onselectoion) => onselectoion.value != "all");

              setSelectedCity(city);
              return;
            }
          }
          setSelectedCity(selection);
        }}
        noOptionsMessage={() => {
          if (gettingAreas) {
            return <CircularProgress />;
          }
          if (!options?.length) return "no data found";
        }}
        {...props}
      />
    )
  );
}

CitiesDropDown.propTypes = {
  valueAttribute: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  selectedCity: PropTypes.any,
  setSelectedCity: PropTypes.func,
  multiple: PropTypes.bool,
};
