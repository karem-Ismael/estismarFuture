import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import PropTypes from "prop-types";

export function ModelDisplayData({ modelprofile }) {
  const [modelDetails, setModelDetails] = useState();
  const { locale } = useIntl();

  useEffect(() => {
    if (modelprofile) {
      const { make, id, name } = modelprofile.carModel;

      const modelprofileDetails = [
        { msgId: "model.id", value: id },
        { msgId: "model.name", value: name },
        { msgId: "model.makname", value: make ? make[`${locale}Name`] : null },
        {
          msgId: "status",
          value: modelprofile.carModel.make?.status ? (
            <FormattedMessage id="active" />
          ) : (
            <FormattedMessage id="inactive" />
          ),
        },
      ];
      setModelDetails(modelprofileDetails);
    }
  }, [modelprofile, locale]);

  return <InfoCard fullwidth data={modelDetails} titleId="model.details" />;
}
ModelDisplayData.propTypes = {
  modelprofile: PropTypes.object,
};
