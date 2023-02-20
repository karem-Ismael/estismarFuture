import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import PropTypes from "prop-types";

export function BranchDisplayData({ branchprofile }) {
  const [branchDetails, setBranchDetails] = useState();
  const { locale } = useIntl();

  useEffect(() => {
    if (branchprofile) {
      const { address, isActive, area, id, officeNumber } = branchprofile.branch;
      const branchprofileDetails = [
        { msgId: "branch.address", value: address },
        { msgId: "branch.area", value: area[`${locale}Name`] },
        { msgId: "branch.id", value: id },
        // { msgId: "branch.managername", value: managerName },
        { msgId: "branch.managernumber", value: `996${officeNumber}` },
        { msgId: "branch.name", value: branchprofile.branch[`${locale}Name`] },
        {
          msgId: "status",
          value: isActive ? <FormattedMessage id="active" /> : <FormattedMessage id="inactive" />,
        },
      ];
      setBranchDetails(branchprofileDetails);
    }
  }, [branchprofile, locale]);

  return <InfoCard fullwidth data={branchDetails} titleId="branch.details" />;
}
BranchDisplayData.propTypes = {
  branchprofile: PropTypes.object,
};
