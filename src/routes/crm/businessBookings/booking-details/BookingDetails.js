/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FormattedMessage, useIntl } from "react-intl";
import { EditBooking } from "gql/mutations/Rental.mutations.gql";
import IntlMessages, { FormatDate } from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { GetRentalDetailsQuery } from "gql/queries/Rental.queries.gql";
import { GetCustomerDetailsQuery } from "gql/queries/Users.queries.gql";
import { GetAllyCompanyQuery } from "gql/queries/Ally.queries.gql";
import { GetCarProfile } from "gql/queries/Cars.queries.gql";
import { useMutation, useQuery } from "@apollo/client";
import InfoCard from "components/shared/InfoCard";
import GoogleMapComponent from "routes/maps/google-map";
import DotsLoader from "components/shared/DotsLoader";
import { CustomerDataDisplay } from "components/CustomerDataDisplay";
import moment from "moment";
import { daysDifference } from "functions";
import { DateTimePickerCustom } from "components/DateTimePickerCustom";
import { NotificationManager } from "react-notifications";
import Button from "@material-ui/core/Button";
import ChangeStatus from "../ChangeStatus";

/**
 * @name BookingDetails
 * @description Booking Details Or Rental Details.This function takes bookingIf from params
 *              and graps booking data Then takes carId, userId & allyCompanyId to get each
 *              details and display needed data inside InfoCards
 * @export
 * @return {JSX}
 */
export default function BookingDetails() {
  const location = useLocation();
  const history = useHistory();
  const { locale, formatMessage } = useIntl();
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState([]);
  const [carDetails, setCarDetails] = useState([]);
  const [allyDetails, setAllyDetails] = useState([]);
  const [latLng, setLatLng] = useState(null);
  const [newDropOffDate, setNewDropOffDate] = useState();
  const [changed, setChanged] = useState(false);
  const [branch, setBranch] = useState();
  const [EditBookingMutation, { loading: editingRental }] = useMutation(EditBooking);

  // Rental Details Request
  const { data: rentalDetails, loading, refetch } = useQuery(GetRentalDetailsQuery, {
    variables: { id: bookingId },
  });

  // Ally Data Request
  const { data: allyDetailsRes } = useQuery(GetAllyCompanyQuery, {
    skip: !rentalDetails?.rentalDetails,
    variables: { id: rentalDetails?.rentalDetails?.allyCompanyId },
  });

  // Customer Data Request
  const { data: customerDetailsRes } = useQuery(GetCustomerDetailsQuery, {
    skip: !rentalDetails?.rentalDetails,
    variables: { id: rentalDetails?.rentalDetails?.userId },
  });

  // Car Details Request
  const { data: carDetailsRes } = useQuery(GetCarProfile, {
    skip: !rentalDetails?.rentalDetails,
    variables: { id: rentalDetails?.rentalDetails?.carId },
  });

  useEffect(() => {
    // if (rentalDetails?.rentalDetails) {
    const rentInfo = rentalDetails?.rentalDetails;
    const pickupBranchId = +rentInfo?.branchId;
    const branch = allyDetailsRes?.allyCompany?.branches?.find(
      (branch) => +branch?.id === +pickupBranchId,
    );

    const branchName = branch?.[`${locale}Name`];

    if (branch) {
      setLatLng([branch?.lat, branch?.lng]);
      setBranch(branch);
    }

    const bookingType = () => {
      const { deliverLng, pickUpDate, dropOffDate } = rentInfo;
      switch (true) {
        case !!deliverLng:
          return "delivery";
        case Math.abs(moment(pickUpDate).diff(moment(dropOffDate), "days")) >= 25:
          return "monthly";
        default:
          return "daily";
      }
    };

    if (rentInfo?.id) {
      const bookingDetails = [
        { msgId: "rental.bookingNumber", value: rentInfo.id },
        { msgId: "bookingNo.placeholder", value: rentInfo.bookingNo },
        { msgId: "rental.pickupLocation", value: rentInfo[`${locale}PickUpCityName`] },
        { msgId: "rental.pickupBranchName", value: branchName || "" },
        { msgId: "rental.returnLocation", value: rentInfo[`${locale}DropOffCityName`] },
        { msgId: "rental.returnBranchName", value: branchName || "" },
        rentInfo.isIntegratedRental && {
          msgId: "rental.IntegrationStatus",
          value: rentInfo.rentalIntegrationStatus || "",
        },
        rentInfo.isIntegratedRental && {
          msgId: "rental.cancelReason",
          value: rentInfo.rentalIntegrationErrorMessage || "",
        },

        {
          msgId: "rental.pickupDateAndTime",
          value: (
            <>
              <FormatDate value={rentInfo.pickUpDate} /> | {rentInfo.pickUpTime}
            </>
          ),
        },
        {
          msgId: "rental.returnDateAndTime",
          value: (
            <>
              <FormatDate value={rentInfo.dropOffDate} /> | {rentInfo.dropOffTime}
            </>
          ),
        },
        { msgId: "rental.priceDay", value: rentInfo.pricePerDay },
        { msgId: "rental.bookingType", value: <IntlMessages id={bookingType()} /> },
        { msgId: "rental.totalRentalDays", value: rentInfo.numberOfDays },
        {
          msgId: "rental.bookingStatus",
          value: <IntlMessages id={rentInfo.status.toUpperCase()} />,
        },
        {
          msgId: "paymentstatus",
          value: rentInfo.isPaid ? (
            <FormattedMessage id="payed" />
          ) : (
            <FormattedMessage id="notpayed" />
          ),
        },
        { msgId: "rental.paymentType", value: rentInfo.paymentMethod },
        rentInfo.refundedAt && {
          msgId: "rental.refundamount",
          value: rentInfo.refundedAmount ? rentInfo.refundedAmount : 0,
        },
        rentInfo.refundedAt && {
          msgId: "rental.refundedAt",
          value: moment.utc(rentInfo.refundedAt).local().format("DD/MM/YYYY HH:mm:ss"),
        },
        {
          msgId: "booking.invociedAt",
          value:
            rentInfo?.invoicedAt &&
            moment.utc(rentInfo?.invoicedAt).local().format("DD/MM/YYYY HH:mm:ss"),
        },
        { msgId: "rental.totalInsuranceAmount", value: rentInfo.totalInsurancePrice },
        { msgId: "rental.priceBeforeTax", value: rentInfo.priceBeforeTax },
        { msgId: "widgets.tax", value: rentInfo.taxValue },
        { msgId: "rental.totalBookingAmount", value: rentInfo.totalBookingPrice },
        rentInfo.isPaid &&
          rentInfo.paymentMethod == "ONLINE" && {
            msgId: "rental.paymentBrand",
            value: <FormattedMessage id={rentInfo.paymentBrand} />,
          },
        { msgId: "note", value: rentInfo.note },
      ];
      if (rentInfo?.rentalExtraServices) {
        for (const item of rentInfo.rentalExtraServices) {
          bookingDetails.push({
            msgId: item.title,
            value: item.subtitle,
          });
        }
      }
      setBookingDetails(bookingDetails);
    }
  }, [rentalDetails, allyDetailsRes, carDetailsRes]);

  useEffect(() => {
    if (carDetailsRes?.carProfile) {
      const carData = carDetailsRes?.carProfile;
      const rentInfo = rentalDetails?.rentalDetails;
      if (rentalDetails?.rentalDetails?.allyCompanyId === null) {
        console.error(`rentalDetails?.rentalDetails?.allyCompanyId is NULL`);
      }
      const carName = `${carData?.carMakeName} ${carData?.carModelName} ${carData?.carVersionName}`;
      const insurance = carData?.carInsurances.find(
        (insurance) => +insurance?.id === +rentalDetails?.rentalDetails?.insuranceId,
      );

      const carDetails = [
        { msgId: "carName", value: carName },
        { msgId: "rental.distanceByDay", value: carData?.distanceByDay },
        { msgId: "rental.distanceBetweenCarUser", value: carData?.distanceBetweenCarUser },
        { msgId: "insuranceType", value: insurance?.insuranceName },
        {
          msgId: "rental.insuranceCostPerDay",
          value: (rentInfo?.totalInsurancePrice / rentInfo?.numberOfDays).toFixed(2),
        },
        {
          msgId: "status",
          value: <FormattedMessage id={carData?.availabilityStatus ? "active" : "inactive"} />,
        },
        { msgId: "rental.carListingIdOrNumber", value: rentInfo?.carId },
        { msgId: "rental.rentPerDay", value: rentInfo?.pricePerDay },
        { msgId: "rental.monthlyPrice", value: carData?.monthlyPrice },
        { msgId: "rental.weeklyPrice", value: carData?.weeklyPrice },
      ];
      setCarDetails(carDetails);
    }
  }, [carDetailsRes]);

  useEffect(() => {
    if (allyDetailsRes?.allyCompany) {
      const allyInfo = allyDetailsRes?.allyCompany;
      const { email, officeNumber, phoneNumber, commisionRate } = allyInfo;
      const allyDetails = [
        { msgId: "rental.allyName", value: allyInfo[`${locale}Name`] },
        { msgId: "rental.allyEmailAddress", value: email },
        { msgId: "rental.allyPhoneNumber", value: <div dir="ltr">{phoneNumber}</div> },
        { msgId: "rental.allyOfficeNumber", value: <div dir="ltr">{officeNumber}</div> },
      ];

      setAllyDetails(allyDetails);

      setBookingDetails((oldBookingDetails) => [
        ...oldBookingDetails,
        {
          msgId: "rental.carwahCommission",
          value: commisionRate,
        },
      ]);
    }
  }, [allyDetailsRes]);

  const { status, pickUpDate, dropOffDate } = rentalDetails?.rentalDetails || {};
  return (
    <div className="ecom-dashboard-wrapper">
      
      <Helmet>
        <title>Booking Details</title>
        <meta name="description" content="Carwah Booking Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.rentalDetails" />}
        enableBreadCrumb
        match={location}
        lastElement={rentalDetails?.rentalDetails?.bookingNo || <DotsLoader />}
        extraButtons={
          <>
            <Button
              variant="contained"
              color="primary"
              className="mx-sm-15 btn btn-success"
              onClick={() => history.push(`/cw/dashboard/bookings/${bookingId}/edit`)}
            >
              <FormattedMessage id="Edit" />
            </Button>
          </>
        }
      />
      {location?.pathname?.includes("extend") && !loading && (
        <>
          {bookingId && status === "car_received" ? (
            <div className="d-flex justify-content-end align-items-center">
              <DateTimePickerCustom
                autoOk
                disablePast={!bookingId}
                value={newDropOffDate}
                label={formatMessage({ id: "rental.dropoffDateTime" })}
                onChange={(val) => {
                  setChanged(true);
                  setTimeout(() => {
                    setNewDropOffDate(val);
                  }, 100);
                }}
                minDate={bookingDetails.dropOffDate}
                minDateMessage={formatMessage({ id: "validation.fromMustBeLessThanTo" })}
              />
              <button
                type="button"
                className="btn btn-primary"
                disabled={!changed || editingRental}
                onClick={() => {
                  EditBookingMutation({
                    variables: {
                      ...rentalDetails.rentalDetails,
                      pickUpDate: moment(rentalDetails.rentalDetails.pickUpDate).format(
                        "DD/MM/YYYY",
                      ),
                      dropOffDate: moment(newDropOffDate).format("DD/MM/YYYY"),
                      dropOffTime: `${moment(newDropOffDate).format("HH:mm")}:00`,
                      rentalId: +bookingId,
                      dropOffBranchId: rentalDetails?.rentalDetails?.branchId,
                    },
                  })
                    .then(() => {
                      NotificationManager.success(formatMessage({ id: "success.edit.rental" }));
                      refetch();
                      // .then(() => {
                      //   setTimeout(() => {
                      //     history.push("/cw/dashboard/bookings");
                      //   }, 1500);
                      // });
                    })
                    .catch((err) => {
                      NotificationManager.error(err.message);
                    });
                }}
              >
                <FormattedMessage id="extend" />
              </button>
            </div>
          ) : (
            <h2 className="badge badge-info" onClick={() => history.goBack()}>
              <FormattedMessage id="this.booking.can't.be.extended" />
            </h2>
          )}
        </>
      )}
      <div className="row">
        <div className="w-50">
          <CustomerDataDisplay customerDetailsRes={customerDetailsRes} />
          <InfoCard fullwidth data={bookingDetails} titleId="rental.bookingDetails" />
        </div>
        <div className="w-50">
          {latLng?.length === 2 && (
            <GoogleMapComponent
              heading={formatMessage({ id: "branch.location" })}
              lat={latLng[0]}
              lng={latLng[1]}
              branch={branch}
            />
          )}
          <InfoCard fullwidth data={allyDetails} titleId="rental.allyDetails" />
          <InfoCard fullwidth data={carDetails} titleId="rental.carDetails" />
          {rentalDetails?.rentalDetails?.deliverLng && (
            <GoogleMapComponent
              heading={formatMessage({ id: "deliveryLocation" })}
              lat={rentalDetails?.rentalDetails?.deliverLat}
              lng={rentalDetails?.rentalDetails?.deliverLng}
            />
          )}
        </div>
      </div>
      {rentalDetails?.rentalDetails?.id && (
        <div className="d-flex flex-row-reverse m-4">
          {daysDifference(pickUpDate, dropOffDate, status) !== "STOP_EDIT" &&
            status !== "car_received" && (
              <button
                type="button"
                className="btn btn-primary mr-1 ml-1"
                onClick={() =>
                  history.push(`/cw/dashboard/bookings/${rentalDetails?.rentalDetails?.id}/edit`)
                }
              >
                <FormattedMessage id="common.editSomething" values={{ something: "booking" }} />
              </button>
            )}
          {daysDifference(pickUpDate, dropOffDate, status) !== "STOP_EDIT" && (
            <button
              type="button"
              className="btn btn-primary mr-1 ml-1"
              onClick={() =>
                history.push(`/cw/dashboard/changeStatus/${rentalDetails?.rentalDetails?.id}`)
              }
            >
              <FormattedMessage id="changeStatus" />
            </button>
          )}
          {/* {status === "car_received" && (
            <button
              type="button"
              className="btn btn-primary mr-1 ml-1"
              onClick={() => {
                history.push(`/cw/dashboard/bookings/${rentalDetails?.rentalDetails?.id}/extend`);
              }}
            >
              <FormattedMessage id="extend" />
            </button>
          )} */}
        </div>
      )}
    </div>
  );
}
