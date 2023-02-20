import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { Features } from "gql/queries/getParent.gql";
import { persist } from "constants/constants";
import { set } from "react-hook-form";

export default function FeatureOarentDropDown({
  loading,
  setSelectedParent,
  selectedParent,
  error,
  valueAttribute,
  ...props
}) {
  const { data: allfeatures, loading: gettingModels } = useQuery(Features, {
    variables: { isParent: true, isActive: true },
  });
  const { locale, formatMessage } = useIntl();
  const options =
    allfeatures?.features?.collection?.map((x) => ({
      value: x[valueAttribute || "nameEn"],
      label: x[`name${locale.charAt(0).toUpperCase() + locale.charAt(1)}`],
    })) || [];
  if (options.length) {
    options.push({ value: "all", label: <FormattedMessage id="ALL" /> });
  }
  React.useEffect(() => {
    if (!selectedParent) {
      onClear();
    }
  }, [selectedParent]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };
  return (
    <Select
      className={`dropdown-select ${error ? "selection-error" : ""}`}
      options={options}
      ref={selectInputRef}
      loadOptions={gettingModels || loading}
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedParent}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedParent}`)}
      placeholder={formatMessage({ id: "featureparents" })}
      onChange={(selection) => {
        if (selection?.label?.props?.id == "ALL") {
          setSelectedParent("all")
          return;
        }
        setSelectedParent(+selection?.value);
      }}
      noOptionsMessage={() => {
        if (gettingModels) {
          return <CircularProgress />;
        }
        if (!options?.length) return "no data found";
      }}
      {...props}
    />
  );
}
FeatureOarentDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedParent: PropTypes.string,
  setSelectedParent: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
