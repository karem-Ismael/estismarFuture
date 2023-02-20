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
import { daysDifference, userCan } from "functions";
import { DateTimePickerCustom } from "components/DateTimePickerCustom";
import { NotificationManager } from "react-notifications";
import Button from "@material-ui/core/Button";
import { PrintRental } from "gql/mutations/PrintRental.gql";
import print from "print-js";
import { CircularProgress } from "@material-ui/core";
import { Branch } from "gql/queries/getBranchDetails.gql";
import {ResendRentalExtensionIntegration} from "gql/mutations/ResendExtensionToAlly.gql"

import { UserWallet } from "gql/queries/CustomerWalletBalance.gql";
import ExtenstionRequests from "../AddEditBooking/extensionRequests";

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
  const[branchId,setBranchID]=useState(null)
  const [progress,setProgress]=useState(false)
  const [EditBookingMutation, { loading: editingRental }] = useMutation(EditBooking);
  const [extensionModalOpen, setIsExtensionModalOpen] = useState(false);

  // Rental Details Request
  const { data: rentalDetails, loading, refetch } = useQuery(GetRentalDetailsQuery, {
    variables: { id: bookingId },
  });
  const { data: branchDetails } = useQuery(Branch, {
    skip:!branchId,
    variables: {
      id:branchId,
    },
  });

const [resendRentalExtensionIntegration]=useMutation(ResendRentalExtensionIntegration)


  // Ally Data Request
  const { data: allyDetailsRes } = useQuery(GetAllyCompanyQuery, {
    skip: !rentalDetails?.rentalDetails?.allyCompanyId,
    variables: { id: rentalDetails?.rentalDetails?.allyCompanyId },
  });
  const [printrental] = useMutation(PrintRental);
  // Customer Data Request
  const { data: customerDetailsRes } = useQuery(GetCustomerDetailsQuery, {
    skip: !rentalDetails?.rentalDetails,
    variables: { id: rentalDetails?.rentalDetails?.userId },
  });
  const { data: walletBalance } = useQuery(UserWallet, {
    skip: !rentalDetails?.rentalDetails,
    variables: { userId: +rentalDetails?.rentalDetails?.userId },
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
    setBranchID(rentInfo?.branchId)
    // if (branch) {
    //   setLatLng([branch?.lat, branch?.lng]);
    //   setBranch(branch);
    // }

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
        rentInfo.isUnlimited && {
          msgId: "Unlimited.KM",
          value: rentInfo.unlimitedFeePerDay,
        },
        {
          msgId: "code.label",
          value: rentInfo.couponCode,
          // couponDiscount
        },
        {
          msgId: "couponDiscount",
          value: <FormattedMessage id="price.sr" values={{ price: rentInfo.couponDiscount }} />,

          // couponDiscount
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
      rentInfo?.walletTransactions ?  {
        
        msgId:"wallet",
          value:   rentInfo.walletTransactions.amount ,
        } : null,
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
  useEffect(()=>{
    if(branchDetails){
      setLatLng([branchDetails.branch?.lat, branchDetails.branch?.lng]);
      setBranch(branchDetails.branch);
    }
  },[branchDetails])
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
const Print=()=>{
  setProgress(true)
  printrental({
    variables: {
      rentalId: bookingId,
    },
  }).then((data) => {
    print({ printable: data.data.printRental.fileBase64, type: "pdf", base64: true });
    setProgress(false)

  });
}
  const { status, pickUpDate, dropOffDate } = rentalDetails?.rentalDetails || {};
  function sendToAlly(id){
    resendRentalExtensionIntegration({
      variables:{
        rentalExtensionId:id
      }
    }).then(()=>{
      NotificationManager.success(<FormattedMessage id="Successfully sent to the ally"/>)
      refetch()
    })
    .catch(()=> {
      NotificationManager.error(<FormattedMessage id="Unable to send request to ally" />)
    })
  }
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
            {
               userCan("rentals.print") && 
               <Button
               style={{color:"#fff"}}
               className="mx-sm-15 btn btn-danger"
               disabled={progress}
               onClick={()=>Print()}
             >
               <FormattedMessage id="print" />
             </Button>
            }
             {
                userCan("rentals.extend") &&
                rentalDetails?.rentalDetails?.status &&
                rentalDetails.rentalDetails.status !== "pending" &&
                rentalDetails.rentalDetails.status !== "confirmed" && (
                  
                    <Button
                      variant="contained"
                      className="mx-sm-15"
                      color="primary"
                      onClick={() => setIsExtensionModalOpen(true)}
                    >
                      <FormattedMessage id= "Extension Requests"  />
                    </Button>
                  
                )}
          
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
          <CustomerDataDisplay customerDetailsRes={customerDetailsRes}
          walletBalance={walletBalance}
           />
          <InfoCard fullwidth data={bookingDetails} titleId="rental.bookingDetails" />
        </div>
        <div className="w-50">
          {latLng?.length === 2 && (
            <GoogleMapComponent
              heading={formatMessage({ id: "branch.details" })}
              lat={latLng[0]}
              lng={latLng[1]}
              branch={branch}
            />
          )}
          <InfoCard fullwidth data={allyDetails} titleId="rental.allyDetails" inbookingDetails />
          {
            rentalDetails?.rentalDetails?.rentalRejectedBaskets.length ? rentalDetails?.rentalDetails?.rentalRejectedBaskets.map((basket)=>(
          <InfoCard fullwidth rejectReasones={basket.rejectedReasons} data={[
            { msgId: "rental.allyName", value: basket[`${locale}AllyName`] }
          ]}  titleId= "Ally.Decline.reason" inbookingDetails />
             
            )) 
            :null
          }
          
          <InfoCard fullwidth data={carDetails} titleId="rental.carDetails" inbookingDetails />
          {rentalDetails?.rentalDetails?.deliverLng && (
            <GoogleMapComponent
              heading={formatMessage({ id: "deliveryLocation" })}
              lat={rentalDetails?.rentalDetails?.deliverLat}
              lng={rentalDetails?.rentalDetails?.deliverLng}
            />
          )}
        </div>
      </div>
      {rentalDetails?.rentalDetails?.rentalDateExtensionRequests?.length ? (
        <div className="row">
          <div className="w-50">
            {rentalDetails.rentalDetails.rentalDateExtensionRequests.map((i) => (
              <InfoCard
                fullwidth
                data={[
                  { msgId: "Request status", value: i?.status },
                  { msgId: "Request No.", value: i?.requestNo },
                  {
                    msgId: "New_return_Time",
                    value:
                      i?.dropOffDate && i?.dropOffTime
                        ? `${i?.dropOffDate} ${i.dropOffTime}`
                        : null,
                  },
                  {
                    msgId: "Extension duration",
                    value: `${i?.extensionDays} ${formatMessage({
                      id: "day",
                    })}`,
                  },
                  {
                    msgId: "paymentmethod",
                    value: formatMessage({
                      id: i?.paymentMethod,
                    }),
                  },
                  {msgId:"paymentstatus",value: i.isPaid ? (<FormattedMessage id="payed" />
                  ) : (
                    <FormattedMessage id="notpayed" />
                  )},
                  { msgId: "Grand Total +VAT", value: i?.totalRemainingPrice },
                 
                ]}
                titleId="Extension Request"
                ExtensionCard={true}
                canSendToAlly={i.canSendExtensionToAlly}
                ExtensionId={i.id}
                sendToAlly={sendToAlly}
              />
            ))}
          </div>
        </div>
      ) : null}

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
      { progress && 
        <div className="d-flex justify-content-center align-items-center" style={{zIndex:"999",position:"fixed",top:0,width:"calc(100vw - 140px)",height:"100vh",left:locale =="ar" ? 0 : "",right:locale =="ar"? "":0 }}>
         <CircularProgress />

        </div>
      }
      {extensionModalOpen && (
        <ExtenstionRequests
          extensionModalOpen={extensionModalOpen}
          setIsExtensionModalOpen={setIsExtensionModalOpen}
          rentalDetails={rentalDetails?.rentalDetails}
          rentalDateExtensionRequests={rentalDetails?.rentalDetails?.rentalDateExtensionRequests}
          hasPendingExtensionRequests={rentalDetails?.rentalDetails?.hasPendingExtensionRequests}
          refetchBooking={refetch}
        />
      )}
    </div>
  );
}
