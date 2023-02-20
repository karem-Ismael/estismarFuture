import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import PropTypes from "prop-types";

export function ExtraServiceDisplayData({ extraservice }) {
  const [extraService, setExtraService] = useState();
  const { locale } = useIntl();

  useEffect(() => {
    if (extraservice) {
      const {
        serviceValue,
        payType,
        id,
        isActive,
        enDescription,
        arDescription,
        isDisplayed,
      } = extraservice.extraService;

      const services = [
        { msgId: "serviceid", value: id },
        { msgId: "arDescription", value: arDescription },
        { msgId: "enDescription", value: enDescription },

        { msgId: "paytype", value: payType },
        { msgId: "serviceValue", value: serviceValue },

        {
          msgId: "status",
          value: isActive ? <FormattedMessage id="active" /> : <FormattedMessage id="inactive" />,
        },
        {
          msgId: "isDisplayed",
          value: isDisplayed ? (
            <FormattedMessage id="active" />
          ) : (
            <FormattedMessage id="inactive" />
          ),
        },
      ];
      setExtraService(services);
    }
  }, [extraservice, locale]);

  return <InfoCard fullwidth data={extraService} titleId="feature.details" />;
}
ExtraServiceDisplayData.propTypes = {
  extraservice: PropTypes.object,
};
