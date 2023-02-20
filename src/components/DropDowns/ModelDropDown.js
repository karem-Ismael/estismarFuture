import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage,useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { CarModels } from "gql/queries/AllModels.gql";
import { persist } from "constants/constants";

export default function ModelDropDown({
  loading,
  setSelectedModel,
  selectedModel,
  error,
  valueAttribute,
  makeId,
  ...props
}) {
  
  const { locale, formatMessage } = useIntl();
  const { data: allmodels, loading: gettingModels } = useQuery(CarModels, {
    skip:!makeId,
    variables: { limit: persist.higherUnlimited ,make:makeId,orderBy:`${locale}_name`,sortBy:'asc'},
  });

  const options =
    allmodels?.carModels?.collection?.map((x) => ({
      value: x[valueAttribute || "enName"],
      label: x[`${locale}Name`],
    })) || [];

  React.useEffect(() => {
    if (!selectedModel) {
      onClear();
    }
  }, [selectedModel]);

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
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedModel}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedModel}`)}
      placeholder={formatMessage({ id: "models" })}
      onChange={(selection) => {
        setSelectedModel(+selection?.value);
      }}
      noOptionsMessage={() => {
        if (gettingModels) {
          return <CircularProgress />;
        }
        if (!options?.length) return <FormattedMessage id="No data found" />;
      }}
      {...props}
    />
  );
}
ModelDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedModel: PropTypes.string,
  setSelectedModel: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
