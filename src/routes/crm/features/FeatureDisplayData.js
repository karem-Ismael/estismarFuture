import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import PropTypes from "prop-types";

export function FeatureDisplayData({ featureprofile }) {
  const [featureDetails, setFeatureDetails] = useState();
  const { locale } = useIntl();

  useEffect(() => {
    if (featureprofile) {
      const { category, displayOrder, icon,id,isActive } = featureprofile.feature;

      const featureprofileDetails = [
        { msgId: "FeaturesID", value: id },
        { msgId: "featureArName", value:  featureprofile.feature?.[`nameAr`] },
        { msgId: "featureEnName", value:  featureprofile.feature?.[`nameEn`] },

        
        { msgId: "displayOrder", value: displayOrder },
        { msgId: "components.category.feature", value:category },
        {
          msgId: "status",
          value: isActive ? (
            <FormattedMessage id="active" />
          ) : (
            <FormattedMessage id="inactive" />
          ),
        },
      ];
      setFeatureDetails(featureprofileDetails);
    }
  }, [featureprofile, locale]);

  return <InfoCard fullwidth data={featureDetails} titleId="feature.details" />;
}
FeatureDisplayData.propTypes = {
  modelprofile: PropTypes.object,
};
