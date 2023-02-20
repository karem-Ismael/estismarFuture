import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { Branches } from "gql/queries/BranchCityWithArea.gql";
import { persist } from "constants/constants";

export default function BranchesDropDownWithPicupLocation({
  loading,
  setSelectedBranch,
  selectedBranch,
  pickupHandoverBranch,
  valueAttribute,
  disabled,
  required,
  error,
  ...props
}) {
  const { data: allbranches, loading: gettingModels } = useQuery(Branches, {
    skip: !pickupHandoverBranch,
    variables: { limit: persist.higherUnlimited, pickupHandoverBranchId: pickupHandoverBranch },
  });
  const { locale, formatMessage } = useIntl();
  const options =
    allbranches?.branches?.collection?.map((x) => ({
      value: x[valueAttribute || "enName"],
      label:
        x?.area[`${locale}Name`] +
        "-" +
        (x[`districtName${locale.charAt(0).toUpperCase() + locale.charAt(1)}`] || ""),
    })) || [];

  React.useEffect(() => {
    if (!selectedBranch) {
      onClear();
    }
  }, [selectedBranch]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };
  return (
    <Select
      isDisabled={disabled}
      className={`dropdown-select  ${pickupHandoverBranch ? "required" : ""} ${
        error ? "selection-error" : ""
      }`}
      options={options}
      ref={selectInputRef}
      loadOptions={gettingModels || loading}
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedBranch}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedBranch}`)}
      placeholder={formatMessage({ id: "branches" })}
      onChange={(selection) => {
        setSelectedBranch(+selection?.value);
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
BranchesDropDownWithPicupLocation.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedBranch: PropTypes.string,
  setSelectedBranch: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
