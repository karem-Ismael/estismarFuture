import React from "react";
import { AllAreas } from "gql/queries/Areas.queries.gql";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";

export default function AreasDropDown({
  loading,
  setSelectedCity,
  selectedCity,
  valueAttribute,
  multiple,
  error,
  ...props
}) {
  const { data: AreasRes, loading: gettingAreas } = useQuery(AllAreas);
  const { locale, formatMessage } = useIntl();
  const options =
    AreasRes?.areas?.map((x) => ({
      value: x?.[valueAttribute],
      label: x?.[`${locale}Name`],
    })) || [];

  React.useEffect(() => {
    if (!selectedCity) {
      onClear();
    }
  }, [selectedCity]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };

  return (
    options && (
      <Select
        className={`dropdown-select ${error ? "selection-error" : ""}`}
        options={options}
        ref={selectInputRef}
        isMulti={multiple}
        defaultValue={options.find((optn) => `${optn.value}` === `${selectedCity}`)}
        value={options.find((optn) => `${optn.value}` === `${selectedCity}`)}
        loadOptions={gettingAreas || loading}
        placeholder={formatMessage({ id: "components.city" })}
        onChange={(selection) => {
          const areaids = [];
          selection?.map((onselectoion) => areaids.push(+onselectoion.value));
          setSelectedCity(areaids);
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

AreasDropDown.propTypes = {
  valueAttribute: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  selectedCity: PropTypes.any,
  setSelectedCity: PropTypes.func,
  multiple: PropTypes.bool,
};
