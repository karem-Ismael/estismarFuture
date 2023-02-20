import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import { persist } from "constants/constants";
import { CarVersions } from "gql/queries/GetCarVersions.gql";

export function CarVersionsDropDown({
  loading,
  setSelectedVersion,
  selectVersion,
  error,
  valueAttribute,
  multiple,
  setCarVersionList,
  branchIds,
  ...props
}) {
  const { data: carVersions, loading: gettingVersions } = useQuery(CarVersions, {
    variables: { limit: 1000, branchIds: branchIds?.length ? branchIds : undefined },
  });
  const { locale, formatMessage } = useIntl();
  const [options, setOptions] = React.useState();

  React.useEffect(() => {
    const alloptions =
      carVersions?.carVersions.collection?.map((x) => ({
        value: x[valueAttribute || "enName"],
        label: `${x.carModel.make[`${locale}Name`]} ${x.carModel[`${locale}Name`]} ${
          x[`${locale}Name`]
        } ${x.year}`,
      })) || [];
    if (alloptions.length) {
      setOptions([{ value: "all", label: formatMessage({ id: "widgets.all" }) }, ...alloptions]);
      setCarVersionList(carVersions?.carVersions.collection?.length);
    }
  }, [carVersions]);

  React.useEffect(() => {
    if (!selectVersion) {
      onClear();
    }
    if (!selectVersion) {
      setSelectedVersion(undefined);
      return;
    }
    if (selectVersion?.length == 0 && options?.length && selectVersion) {
      setSelectedVersion(options.filter((option) => option.value != "all"));
    }
  }, [selectVersion]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };

  return (
    <Select
      isMulti={multiple}
      className={`dropdown-select ${multiple ? "multiple" : ""} ${error ? "selection-error" : ""}`}
      options={options}
      ref={selectInputRef}
      loadOptions={gettingVersions || loading}
      defaultValue={options?.find((optn) => `${optn.value}` === `${selectVersion}`)}
      value={
        multiple
          ? options?.filter((optn, index) => selectVersion?.includes(+optn.value))
          : options?.find((optn) => `${optn.value}` === `${selectVersion}`)
      }
      placeholder={formatMessage({ id: "car.version" })}
      onChange={(selection) => {
        if (!selection && multiple) {
          setSelectedVersion(undefined);
          return;
        }

        if (multiple) {
          if (selection[0].value == "all" || selection[selection.length - 1].value == "all") {
            const version = options.filter((onselectoion) => onselectoion.value != "all");

            setSelectedVersion(version);
            return;
          }
          setSelectedVersion(selection);
          return;
        }

        setSelectedVersion(selection?.value);
      }}
      noOptionsMessage={() => {
        if (gettingVersions) {
          return <CircularProgress />;
        }
        if (!options?.length) return "no data found";
      }}
      {...props}
    />
  );
}
CarVersionsDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectVersion: PropTypes.string,
  setSelectedVersion: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
