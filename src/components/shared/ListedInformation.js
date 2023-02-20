/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
/**
 * Booking Info Widget
 */
import React from "react";
import PropTypes from "prop-types";
import { List, ListItem } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import { FormattedMessage, useIntl } from "react-intl";
import ModalImage from "react-modal-image";
export default function ListedInformation({
  data,
  features,
  branches,
  areas,
  allyCompanies,
  rejectReasones,
}) {
  const { locale } = useIntl();
  return (
    <List className="p-0 fs-14">
      {data?.length > 0 &&
        data.map((info, index) =>
          info?.image ? (
            <React.Fragment key={JSON.stringify(index)}>
              <div className="text-center">{info?.id && <FormattedMessage id={info.id} />}</div>
              <div
                key={JSON.stringify(index)}
                className={`${info.imageDetails.containerClassName} d-flex justify-content-center mt-1 modal-img`}
                style={{ marginBottom: "20px" }}
              >
                <ModalImage
                  key={JSON.stringify(index)}
                  small={info.image}
                  large={info.image}
                  alt={info.image}
                  className={`${info.imageDetails.className} `}
                />
              </div>
            </React.Fragment>
          ) : (
            <>
              <ListItem
                key={JSON.stringify(index)}
                data-testid={`data-info-${index}`}
                className="d-flex justify-content-between align-items-center"
                style={{ padding: "7px 20px" }}
              >
                <span>
                  {info?.icon}
                  {info?.msgId && <IntlMessages id={info?.msgId} />}
                </span>
                <span>{info && info?.value}</span>
              </ListItem>
            </>
          ),
        )}
      {rejectReasones &&
        rejectReasones?.length &&
        rejectReasones.map((rejectreason, index) => (
          <ListItem
            key={JSON.stringify(index)}
            data-testid={`data-info-${index}`}
            className="d-flex justify-content-between align-items-center"
            style={{ padding: "7px 20px" }}
          >
            <span>
              <IntlMessages id="Decline.reason" />
            </span>
            <span>{rejectreason[`${locale}Body`]}</span>
          </ListItem>
        ))}
      {features && (
        <ListItem
          className="d-flex justify-content-between align-items-center"
          style={{ padding: "7px 20px" }}
        >
          <span>
            <FormattedMessage id="CarFeatures" />
          </span>
          <span>
            {features &&
              features.map((feature) => (
                <span className="badge badge-primary mr-2">
                  {feature[`name${locale.charAt(0).toUpperCase() + locale.charAt(1)}`]}
                </span>
              ))}
          </span>
        </ListItem>
      )}
      {areas && (
        <ListItem
          className="d-flex justify-content-between align-items-center"
          style={{ padding: "7px 20px" }}
        >
          <span>
            <FormattedMessage id="City" />
          </span>
          <span>
            {areas && areas.length ? (
              areas.map((area) => (
                <span className="badge badge-primary mr-2">{area[`${locale}Name`]}</span>
              ))
            ) : (
              <FormattedMessage id="all" />
            )}
          </span>
        </ListItem>
      )}
      {allyCompanies && (
        <ListItem
          className="d-flex justify-content-between align-items-center"
          style={{ padding: "7px 20px" }}
        >
          <span>
            <FormattedMessage id="Ally" />
          </span>
          <span>
            {allyCompanies && allyCompanies.length ? (
              allyCompanies.map((company) => (
                <span className="badge badge-primary mr-2">{company[`${locale}Name`]}</span>
              ))
            ) : (
              <FormattedMessage id="all" />
            )}
          </span>
        </ListItem>
      )}

      {branches?.length ? (
        <ListItem
          className="d-flex justify-content-between align-items-center "
          style={{ padding: "7px 20px" }}
        >
          <span>
            <FormattedMessage id="branches" />
          </span>
          <span>
            {branches &&
              branches?.map((branch) => (
                <span className="badge badge-danger mr-2">{branch[`${locale}Name`]}</span>
              ))}
          </span>
        </ListItem>
      ) : branches ? (
        <ListItem
          className="d-flex justify-content-between align-items-center "
          style={{ padding: "7px 20px" }}
        >
          <span>
            <FormattedMessage id="branches" />
          </span>
          <span>
            <FormattedMessage id="all" />
          </span>
        </ListItem>
      ) : null}
    </List>
  );
}

ListedInformation.propTypes = {
  data: PropTypes.any,
};
