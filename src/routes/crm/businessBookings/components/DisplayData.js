/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from "react";
import { FormattedDate, useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import PropTypes from "prop-types";
import { CustomerDataDisplay } from "components/CustomerDataDisplay";
import { useQuery } from "@apollo/client";
import { GetCustomerDetailsQuery } from "gql/queries/Users.queries.gql";
import moment from "moment";

export function RequestDisplayData({ requestRes }) {
  const [requestDetails, setRequestDetails] = useState();
  const [offersDetails, setOffersDetails] = useState([]);
  const { formatMessage, locale } = useIntl();
  const { data: customerDetailsRes } = useQuery(GetCustomerDetailsQuery, {
    skip: !requestRes?.businessRentalDetails?.userId,
    variables: { id: requestRes?.businessRentalDetails?.userId },
  });

  useEffect(() => {
    if (requestRes?.businessRentalDetails) {
      const {
        id,
        makeName,
        modelName,
        year,
        numberOfCars,
        pickUpCityName,
        numberOfMonths,
        pickUpDatetime,
        insuranceName,
        additionalNotes,
      } = requestRes.businessRentalDetails;

      const requestDataDetails = [
        { msgId: "Request ID", value: id },
        { msgId: "car.make", value: makeName },
        { msgId: "car.model", value: modelName },
        { msgId: "car.year", value: year },
        { msgId: "Car numbers", value: numberOfCars },
        { msgId: "City", value: pickUpCityName },
        { msgId: "Duration in months", value: numberOfMonths },
        {
          msgId: "Expected pick up date",
          value: (
            <FormattedDate value={pickUpDatetime} day="numeric" month="short" year="numeric" />
          ),
        },
        { msgId: "Insurance type", value: insuranceName },
        { msgId: "Additional notes", value: additionalNotes },
      ];
      setRequestDetails(requestDataDetails);

      if (requestRes?.businessRentalDetails?.acceptedOffer) {
        const offerDataDetails = [
          { msgId: "Offer ID", value: requestRes?.businessRentalDetails?.acceptedOffer?.id },
          { msgId: "Offer Price", value: requestRes?.businessRentalDetails?.acceptedOffer?.offerPrice },
          {
            msgId: "Car Insurance",
            value: requestRes?.businessRentalDetails?.acceptedOffer?.carInsuranceStandard
              ? formatMessage({ id: "Standard" })
              : formatMessage({ id: "Full" }),
          },
          {
            msgId: "Insurance value",
            value: requestRes?.businessRentalDetails?.acceptedOffer?.carInsuranceStandard,
          },
          {
            msgId: "Monthly Insurance value",
            value: requestRes?.businessRentalDetails?.acceptedOffer?.carInsuranceFull,
          },
          {
            msgId: "Kilometer allowed per month",
            value: requestRes?.businessRentalDetails?.acceptedOffer?.kilometerPerMonth,
          },
          {
            msgId: "Additional distance cost",
            value: requestRes?.businessRentalDetails?.acceptedOffer?.additionalKilometer,
          },
          {
            msgId: "Offer date",
            value: moment(requestRes?.businessRentalDetails?.acceptedOffer?.createdAt).format("DD/MM/YYYY"),
          },
        ];
        setOffersDetails(offerDataDetails);
      }
    }
  }, [requestRes, locale]);

  return (
    <div className="row">
      <div className="row col-md-6 flex-row">
        <div className="w-100">
          <CustomerDataDisplay customerDetailsRes={customerDetailsRes} withimages={false} />
        </div>
      </div>
      <div className="col-md-6">
        <InfoCard fullwidth data={requestDetails} titleId="businessRental.details" />
      </div>
      <div className="col-md-6">
        <InfoCard fullwidth data={offersDetails} titleId="offer.details" />
      </div>
    </div>
  );
}
RequestDisplayData.propTypes = {
  requestRes: PropTypes.object,
};
