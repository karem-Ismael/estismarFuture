/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { useQuery } from "@apollo/client";
import { RentalStatuses } from "gql/queries/RentalStatus.gql";
import { RentalSubStatuses } from "gql/queries/RentalSubStatus.gql";

export function StatusDropDown({
  loading,
  type,
  setSelecteStatus,
  selectedStatus,
  error,
  isBusiness,
}) {
  const { formatMessage } = useIntl();
  const { data: Rentalstatus } = useQuery(RentalStatuses, {
    skip: type == "substatus",
  });
  const { data: rentalSubStatuses } = useQuery(RentalSubStatuses, {
    skip: type != "substatus",
  });
  const options =
    Rentalstatus?.rentalStatuses.statusHash && type !== "substatus"
      ? isBusiness
        ? Object.entries(Rentalstatus?.rentalStatuses.statusHash)
            .map(([k, v]) => ({
              value: k,
              label: formatMessage({ id: v }),
            }))
            .filter((i) => i.value !== "pending")
        : Object.entries(Rentalstatus?.rentalStatuses.statusHash).map(([k, v]) => ({
            value: k,
            label: formatMessage({ id: v }),
          }))
      : type == "substatus" && rentalSubStatuses
      ? Object.entries(rentalSubStatuses?.rentalSubStatuses.subStatusHash).map(([k, v]) => ({
          value: k,
          label: formatMessage({ id: v }),
        }))
      : [];

  React.useEffect(() => {
    if (!selectedStatus) {
      onClear();
    }
  }, [selectedStatus]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };

  return (
    <Select
      className={`dropdown-select ${error ? "selection-error" : ""}`}
      options={options}
      ref={selectInputRef}
      loadOptions={loading}
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedStatus}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedStatus}`)}
      placeholder={formatMessage({ id: type })}
      onChange={(selection) => {
        setSelecteStatus(selection?.value);
      }}
      noOptionsMessage={() => {
        if (loading) {
          return <CircularProgress />;
        }
        if (!options?.length) return "no data found";
      }}
    />
  );
}
StatusDropDown.propTypes = {
  type: PropTypes.string,
  loading: PropTypes.bool,
  selectedStatus: PropTypes.string,
  setSelecteStatus: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
