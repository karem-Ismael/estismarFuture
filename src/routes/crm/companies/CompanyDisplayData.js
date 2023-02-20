/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import PropTypes from "prop-types";

export function CompanyDisplayData({ allyCompany }) {
  const [companyDetails, setCompanyDetails] = useState();
  const { locale } = useIntl();

  useEffect(() => {
    if (allyCompany) {
      const {
        isActive,
        licenceImage,
        id,
        logo,
        managerName,
        commercialRegistrationImage,
        phoneNumber,
        rate,
        allyClass,
        commercialRegestration,
        email,
        address,
        officeNumber,
        allyRate
      } = allyCompany.allyCompany;

      const companyprofileDetails = [
        { msgId: "ally.id", value: id },
        { msgId: "rental.allyName", value: allyCompany.allyCompany[`${locale}Name`] },
        { msgId: "rental.allyEmailAddress", value: email },
        { msgId: "ally.CommercialRegistration", value: commercialRegestration },
        { msgId: "ally.phonenumber", value: phoneNumber },
        { msgId: "ally.class", value: allyClass },
        { msgId: "ally.managerName", value: managerName },
        { msgId: "ally.rating", value: allyRate?.name },
        {
          msgId: "ally.status",
          value: isActive ? <FormattedMessage id="active" /> : <FormattedMessage id="inactive" />,
        },
        { msgId: "ally.address", value: address },
        { msgId: "ally.officeNumber", value: officeNumber },

      ];
      if (logo) {
        companyprofileDetails.push({
          id: "ally.logo",
          image: logo,
          imageDetails: { className: "w-75" },
        });
      }
      if (commercialRegistrationImage) {
        companyprofileDetails.push({
          id: "ally.commercialRegistrationImage",
          image: commercialRegistrationImage,
          imageDetails: { className: "w-75" },
        });
      }
      if (licenceImage) {
        companyprofileDetails.push({
          id: "ally.licenceImage",
          image: licenceImage,
          imageDetails: { className: "w-75" },
        });
      }

      setCompanyDetails(companyprofileDetails);
    }
  }, [allyCompany, locale]);

  return <InfoCard fullwidth data={companyDetails} titleId="company.details" />;
}
CompanyDisplayData.propTypes = {
  allyCompany: PropTypes.object,
};
