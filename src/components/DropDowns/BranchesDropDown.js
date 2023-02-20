/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { Branches } from "gql/queries/AllBranches.gql";
import { persist } from "constants/constants";

export default function BranchesDropDown({
  loading,
  setSelectedBranch,
  selectedBranch,
  error,
  valueAttribute,
  allyId,
  multiple,
  required,
  isAlly,
  manageradd,
  areaIds,
  noSkip,
  isDisabled,
  coupon,
  setList,
  ...props
}) {
  const { data: allbranches, loading: gettingModels } = useQuery(Branches, {
    skip: !allyId?.length && coupon,
    variables: {
      limit: persist.higherUnlimited,
      allyCompanyId: allyId || isAlly,
      allyCompanyIds: allyId || isAlly,
      isActive: coupon ? true : undefined,
    },
  });
  const { locale, formatMessage } = useIntl();
  const [options, setOptions] = useState();
  useEffect(() => {
    const AllOptions =
      allbranches?.branches?.collection?.map((x) => ({
        value: x[valueAttribute || "enName"],
        label: x[`${locale}Name`],
      })) || [];
    if (!allbranches?.branches?.collection?.length) {
      setOptions([]);
      return;
    }
    if (AllOptions.length) {
      setOptions([{ value: "all", label: formatMessage({ id: "widgets.all" }) }, ...AllOptions]);
      const branches = AllOptions?.filter((optn, index) =>
        multiple ? selectedBranch?.includes(+optn.value) : +selectedBranch == +optn.value,
      ).map((branch) => +branch.value);
      if (branches?.length != selectedBranch?.length) {
        setSelectedBranch(branches);
      }
      if (setList) {
        setList(allbranches?.branches?.collection?.length);
      }
    }
  }, [allbranches?.branches?.collection]);

  React.useEffect(() => {
    if (!selectedBranch) {
      onClear();
    }
    
  }, [selectedBranch]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };
  useEffect(() => {
    if (!allyId?.length) setSelectedBranch([]);
  }, [allbranches]);
  useEffect(() => {
    if (isDisabled) {
      const branchesid = allbranches?.branches?.collection.map((branch) => +branch.id);
      setSelectedBranch(branchesid);
    } else {
      setSelectedBranch([]);
    }
  }, [isDisabled]);

  return (
    <Select
      isMulti={multiple}
      isDisabled={isDisabled}
      className={`dropdown-select ${multiple ? "multiple" : ""}  ${required ? "required" : ""} ${
        error ? "selection-error" : ""
      }`}
      options={options}
      ref={selectInputRef}
      loadOptions={gettingModels || loading}
      defaultValue={options?.find((optn) => `${optn.value}` === `${selectedBranch}`)}
      value={
        multiple
          ? options?.filter((optn, index) => selectedBranch?.includes(+optn.value))
          : options?.find((optn) => `${optn.value}` === `${selectedBranch}`)
      }
      placeholder={
        coupon ? formatMessage({ id: "ally.branches" }) : formatMessage({ id: "branches" })
      }
      onChange={(selection) => {
        if (multiple) {
          const branchesids = [];
          if (selection == null) {
            setSelectedBranch([]);
            return;
          }
          if (selection[0].value == "all" || selection[selection.length - 1].value == "all") {
            options.map(
              (onselectoion) =>
                onselectoion.value != "all" && branchesids.push(+onselectoion.value),
            );
          }
          selection?.map((onselectoion) => branchesids.push(+onselectoion.value));
          if (branchesids.length) {
            const branches = branchesids.filter((id) => !isNaN(id));
            setSelectedBranch([...branches]);
          } else {
            setSelectedBranch([]);
          }
        } else {
          if (selection?.value == "all") {
            setSelectedBranch("null");
            return;
          }
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
BranchesDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedBranch: PropTypes.string,
  setSelectedBranch: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
