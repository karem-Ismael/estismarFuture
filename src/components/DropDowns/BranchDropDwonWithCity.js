import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { Areas } from "gql/queries/AreasForCompany.gql";
import { persist } from "constants/constants";

export default function BranchesDropDownWithArea({
  loading,
  setSelectedBranch,
  selectedBranch,
  error,
  valueAttribute,
  allyId,
  multiple,
  required,
  isAlly,
  choosenID,
  disabled,
  ...props
}) {
  const { data: allareas, loading: gettingModels } = useQuery(Areas, {
    skip: !allyId && !isAlly,
    variables: { allyCompanyId: allyId || isAlly },
  });
  const { locale, formatMessage } = useIntl();

  const options =
    allareas?.areas
      ?.filter((x) => x.id != choosenID)
      .map((x) => ({
        value: x[valueAttribute || "enName"],
        label: x?.[`${locale}Name`],
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
      isMulti={multiple}
      isDisabled={disabled}
      className={`dropdown-select  ${required ? "required" : ""} ${error ? "selection-error" : ""}`}
      options={options}
      ref={selectInputRef}
      loadOptions={gettingModels || loading}
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedBranch}`)}
      value={
        multiple
          ? options.filter((optn, index) => selectedBranch?.includes(+optn.value))
          : options.find((optn) => `${optn.value}` === `${selectedBranch}`)
      }
      placeholder={formatMessage({ id: "components.city" })}
      onChange={(selection) => {
        if (multiple) {
          const branchesids = [];
          selection?.map((onselectoion) => branchesids.push(+onselectoion.value));
          if (branchesids.length) {
            setSelectedBranch([...branchesids]);
          } else {
            setSelectedBranch([]);
          }
        } else {
          setSelectedBranch(+selection?.value);
        }
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
BranchesDropDownWithArea.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedBranch: PropTypes.string,
  setSelectedBranch: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
