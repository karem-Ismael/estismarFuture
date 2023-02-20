import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import PropTypes from "prop-types";

export function ManagerDisplayData({ allyManager, allbranches }) {
  const [managerProfile, setManagerDetails] = useState();
  const [selectedbranches, setSelectedBranches] = useState();
  const { locale } = useIntl();

  useEffect(() => {
    if (allyManager) {
      const {
        email,
        firstName,
        lastName,
        middleName,
        gender,
        town,
        nationalId,
        passportNum,
        nationality,
        branches,
      } = allyManager?.allyManagerProfile;
      const { mobile, isActive } = allyManager?.allyManagerProfile.user;
      const selectedBranches = allbranches.branches.collection.filter(
        (branch, index) => +branch.id == +branches[index],
      );
      const ManagerProfileDetails = [
        { msgId: "components.firstName", value: firstName },
        { msgId: "components.lastName", value: lastName },
        { msgId: "middleName.label", value: middleName },
        { msgId: "rental.gender", value: gender },
        { msgId: "nationalId.label", value: nationalId },
        { msgId: "mobile.number", value: mobile },
        { msgId: "nationality", value: nationality },
        { msgId: "passportNum.label", value: passportNum },
        { msgId: "components.city", value: town },
        { msgId: "email", value: email },
        {
          msgId: "status",
          value: isActive ? <FormattedMessage id="active" /> : <FormattedMessage id="inactive" />,
        },
      ];
      setSelectedBranches(selectedBranches);
      setManagerDetails(ManagerProfileDetails);
    }
  }, [allyManager, locale]);

  return (
    <InfoCard
      fullwidth
      data={managerProfile}
      branches={selectedbranches}
      titleId="manager.details"
    />
  );
}
ManagerDisplayData.propTypes = {
  allyManager: PropTypes.object,
};
