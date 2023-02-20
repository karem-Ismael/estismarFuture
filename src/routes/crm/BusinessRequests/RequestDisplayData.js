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
import CustomTable from "components/shared/CustomTable";
import { dataTypes } from "constants/constants";

const { TEXT } = dataTypes;

const offersTableData = [
  {
    headerId: "Offer ID",
    dataRef: "Offer ID",
    dataType: TEXT,
  },
  {
    headerId: "Offer Price",
    dataRef: "Offer Price",
    dataType: TEXT,
  },
  {
    headerId: "Car Insurance",
    dataRef: "Car Insurance",
    dataType: TEXT,
  },
  {
    headerId: "Insurance value",
    dataRef: "Insurance value",
    dataType: TEXT,
  },
  {
    headerId: "Monthly Insurance value",
    dataRef: "Monthly Insurance value",
    dataType: TEXT,
  },
  {
    headerId: "Kilometer allowed per month",
    dataRef: "Kilometer allowed per month",
    dataType: TEXT,
  },
  {
    headerId: "Additional distance cost",
    dataRef: "Additional distance cost",
    dataType: TEXT,
  },
  {
    headerId: "Offer date",
    dataRef: "Offer date",
    dataType: TEXT,
  },
  {
    headerId: "bookings.list.allyName",
    dataRef: "bookings.list.allyName",
    dataType: TEXT,
  },
  {
    headerId: "status",
    dataRef: "status",
    dataType: TEXT,
  },
];

export function RequestDisplayData({ requestRes }) {
  const [requestDetails, setRequestDetails] = useState();
  const [offersDetails, setOffersDetails] = useState([]);
  const { formatMessage, locale } = useIntl();
  const { data: customerDetailsRes } = useQuery(GetCustomerDetailsQuery, {
    skip: !requestRes?.businessRequestDetails?.userId,
    variables: { id: requestRes?.businessRequestDetails?.userId },
  });

  useEffect(() => {
    if (requestRes?.businessRequestDetails) {
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
      } = requestRes.businessRequestDetails;

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

      if (requestRes?.businessRequestDetails?.businessRentalOffers?.length) {
        let list = [];
        for (const offer of requestRes.businessRequestDetails.businessRentalOffers) {
          const offerDataDetails = {
            "Offer ID": offer?.id,
            "Offer Price": offer?.offerPrice,
            "Car Insurance": offer?.carInsuranceStandard
              ? formatMessage({ id: "Standard" })
              : formatMessage({ id: "Full" }),
            "Insurance value": offer?.carInsuranceStandard,
            "Monthly Insurance value": offer?.carInsuranceFull,
            "Kilometer allowed per month": offer?.kilometerPerMonth,
            "Additional distance cost": offer?.additionalKilometer,
            "Offer date": moment(offer?.createdAt).format("DD/MM/YYYY"),
            "bookings.list.allyName": offer?.allyCompanyName,
            status: offer?.statusLocalized,
          };
          list.push(offerDataDetails);
        }
        setOffersDetails(list);
      }
    }
  }, [requestRes, locale]);

  return (
    <div className="row">
      {console.log("offer details", offersDetails)}
      <div className="row col-md-6 flex-row">
        <div className="w-100">
          <CustomerDataDisplay customerDetailsRes={customerDetailsRes} withimages={false} />
        </div>
      </div>
      <div className="row col-md-6 flex-row">
        <InfoCard fullwidth data={requestDetails} titleId="request.details" />
      </div>
      {offersDetails?.length ? (
        <div className="col-md-12 mt-4">
          <CustomTable tableData={offersTableData} tableRecords={offersDetails} />
        </div>
      ) : null}
    </div>
  );
}
RequestDisplayData.propTypes = {
  requestRes: PropTypes.object,
};
