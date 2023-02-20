import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import  VehicleTypes from "gql/queries/GetAllVehicleType.gql";

export default function VehicleTypeDropDown({
  loading,
  selectedVehicle,
  setSelectedVehicle,
  error,
  valueAttribute,
  ...props
}) {
  const { locale, formatMessage } = useIntl();

  const { data: vehicleRes, loading: gettingvehicles } = useQuery(VehicleTypes, {
    variables:{orderBy:`${locale}_name`,sortBy:'asc'}
  });

  const options =
  vehicleRes?.vehicleTypes?.map((x) => ({
      value: x[valueAttribute || "enName"],
      label: x[`${locale}Name`],
    })) || [];

  React.useEffect(() => {
    if (!selectedVehicle) {
      onClear();
    }
  }, [selectedVehicle]);

  const selectInputRef = React.useRef();

  const onClear = () => {
    selectInputRef.current.select.clearValue();
  };

  return (
    <Select
      className={`dropdown-select ${error ? "selection-error" : ""}`}
      options={options}
      ref={selectInputRef}
      loadOptions={gettingvehicles || loading}
      defaultValue={options.find((optn) => `${optn.value}` === `${selectedVehicle}`)}
      value={options.find((optn) => `${optn.value}` === `${selectedVehicle}`)}
      placeholder={formatMessage({ id: "vehicle.type" })}
      onChange={(selection) => {
        setSelectedVehicle(+selection?.value)
      }}
      noOptionsMessage={() => {
        if (gettingvehicles) {
          return <CircularProgress />;
        }
        if (!options?.length) return "no data found";
      }}
      {...props}
    />
  );
}
VehicleTypeDropDown.propTypes = {
  valueAttribute: PropTypes.string,
  loading: PropTypes.bool,
  selectedVehicle: PropTypes.string,
  setSelectedVehicle: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
