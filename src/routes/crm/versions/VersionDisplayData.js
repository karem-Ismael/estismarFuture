import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import PropTypes from "prop-types";

export function VersionDisplayData({ versionprofile }) {
  const [versionDetails, setVersionDetails] = useState();
  const [features,setFeatures]=useState()
  const { locale } = useIntl();

  useEffect(() => {
    if (versionprofile) {
      // const { make, id, name } = modelprofile.carModel;
      const { transmissionName, id, year, carModel,vehicleType,features } = versionprofile.carVersion;
      
      const versionprofileDetails = [
        { msgId: "version.id", value: id },
        { msgId: "car.model", value: carModel[`${locale}Name`] },
        { msgId: "car.make", value: carModel.make[`${locale}Name`] },
        {msgId:"vehicle.type",value:vehicleType[`${locale}Name`]},
        { msgId: "car.year", value: year },
      ];
      setFeatures(features)
      setVersionDetails(versionprofileDetails);
    }
  }, [versionprofile, locale]);

  return <InfoCard fullwidth data={versionDetails} features={features} titleId="version.details" />;
}
VersionDisplayData.propTypes = {
  versionprofile: PropTypes.object,
};
