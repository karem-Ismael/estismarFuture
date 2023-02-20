/* eslint-disable prettier/prettier */
import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { persist } from "constants/constants";
import { GetMakesQueryForSelect } from "gql/queries/Cars.queries.gql";

export default function MakesIdDropDown({
  loading,
  setSelectedMake,
  selectedMake,
  error,
  valueAttribute,
  onMakeChange,
  ...props
}) {
  const { locale, formatMessage } = useIntl();

  const { data: makesRes, loading: gettingMakes } = useQuery(GetMakesQueryForSelect, {
    variables: { limit: persist.unlimitedLimit, orderBy: `${locale}_name`, sortBy: "asc" },
  });

  const options =
    makesRes?.makes?.collection?.map((x) => ({
      value: x[valueAttribute || "enName"],
      label: x[`${locale}Name`],
    })) || [];

  React.useEffect(() => {
    if (!selectedMake) {
      onClear();
    }
  }, [selectedMake]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };

  return (
    <Select
      className={`dropdown-select ${error ? "selection-error" : ""}`}
      options={options}
      ref={selectInputRef}
      loadOptions={gettingMakes || loading}
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedMake}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedMake}`)}
      placeholder={formatMessage({ id: "car.make" })}
      onChange={(selection) => {
        setSelectedMake(selection), onMakeChange(+selection?.value);
      }}
      noOptionsMessage={() => {
        if (gettingMakes) {
          return <CircularProgress />;
        }
        if (!options?.length) return "no data found";
      }}
      {...props}
    />
  );
}
MakesIdDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedMake: PropTypes.string,
  setSelectedMake: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
