/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/**
 * Info Card
 */

import React from "react";
import PropTypes from "prop-types";
import IntlMessages from "util/IntlMessages";
import RctCollapsibleCard from "components/RctCollapsibleCard/RctCollapsibleCard";
import ListedInformation from "components/shared/ListedInformation";
import { FormattedMessage } from "react-intl";

function InfoCard({
  data,
  titleId,
  fullwidth,
  features,
  branches,
  inbookingDetails,
  areas,
  allyCompanies,
  rejectReasones,
  canSendToAlly,
  ExtensionCard=false,
  ExtensionId,
  sendToAlly
}) {
  return (
    <div className={`col-sm-12 col-md-${fullwidth ? "12" : "6"} ${inbookingDetails ? "p-0" : ""}`}>
      <RctCollapsibleCard
        colClasses="col-sm-12 col-md-12 col-lg-12 w-xs-full p-0"
        heading={<IntlMessages id={titleId} />}
        collapsible
        fullBlock
        customClasses="overflow-hidden"
      >
        <ListedInformation
          data={data}
          features={features}
          branches={branches}
          areas={areas}
          allyCompanies={allyCompanies}
          rejectReasones={rejectReasones}
        />
        {
          canSendToAlly && ExtensionCard ? <button className="btn btn-primary w-100"
          onClick={()=>sendToAlly(ExtensionId)}
          >
            <FormattedMessage id="Resend to ally" />
          </button>
          : null
        }
      </RctCollapsibleCard>
    </div>
  );
}

InfoCard.propTypes = {
  fullwidth: PropTypes.bool,
  titleId: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default InfoCard;
