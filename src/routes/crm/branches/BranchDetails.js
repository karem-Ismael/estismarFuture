import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { Branch } from "gql/queries/getBranchDetails.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { useIntl, FormattedMessage } from "react-intl";
import GoogleMapComponent from "routes/maps/google-map";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  List,
  ListItem,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { workingDays, workingDaysIndeeces } from "constants/constants";
import { BranchDisplayData } from "./BranchDisplayData";
import Shifts from "./shifts";
/**
 * @name BranchDetails
 * @export
 */
export default function BranchDetails() {
  const location = useLocation();
  const { branchId } = useParams();
  const { formatMessage, locale } = useIntl();
  const { data: branchDetails, refetch } = useQuery(Branch, {
    variables: { id: +branchId },
  });
  const [expand, setExpanded] = useState([]);

  const handleChange = (index) => {
    if (expand.includes(index)) {
      const expandfiltered = expand.filter((expandindex) => +expandindex !== +index);
      setExpanded(expandfiltered);
    } else {
      setExpanded([...expand, index]);
    }
  };
  useEffect(() => {
    refetch();
  }, [locale]);

  const days =
    branchDetails?.branch.branchWorkingDays.length > 0
      ? workingDaysIndeeces.map((x) =>
          branchDetails?.branch.branchWorkingDays.filter((day) => +day.weekDay === +x),
        )
      : null;

  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "branch.details" })}</title>
        <meta name="description" content="Carwah Branch Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="branch.details" />}
        enableBreadCrumb
        match={location}
        lastElement={branchId || <DotsLoader />}
      />
      <div className="row">
        {branchDetails && (
          <div className="w-50">
            <BranchDisplayData branchprofile={branchDetails} withimages={false} />
          </div>
        )}
        {
          <div className="w-50">
            {branchDetails && (
              <GoogleMapComponent
                heading={formatMessage({ id: "branch.location" })}
                lat={branchDetails.branch.lat}
                lng={branchDetails.branch.lng}
              />
            )}
          </div>
        }
      </div>
      {branchDetails?.branch.branchWorkingDays.length ? (
        <div className="row">
          <RctCollapsibleCard
            colClasses="col-sm-6 col-md-4 col-lg-4 w-8-half-block"
            fullBlock
            customClasses="overflow-hidden"
          >
            <Typography align="center" style={{ marginTop: "10px" }} gutterBottom variant="h2">
              <FormattedMessage id="Worktimeshifts" />
            </Typography>
            <List style={{ width: "100%" }}>
              {days &&
                days.map((day, index) =>
                  day.length ? (
                    <ListItem style={{ width: "100%" }}>
                      <Accordion
                        style={{ width: "100%" }}
                        expanded={expand.includes(index)}
                        onChange={() => handleChange(index)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                          style={{ width: "100%" }}
                        >
                          <Typography>
                            <FormattedMessage id={workingDays[index]} />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>{day && <Shifts data={day} />}</AccordionDetails>
                      </Accordion>
                    </ListItem>
                  ) : null,
                )}
            </List>
          </RctCollapsibleCard>
        </div>
      ) : null}
    </div>
  );
}
