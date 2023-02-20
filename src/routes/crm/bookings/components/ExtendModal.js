import { Cancel } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import { GetRentalDetailsQuery } from "gql/queries/Rental.queries.gql";

import { DateTimePickerCustom } from "components/DateTimePickerCustom";
import CustomTextField from "components/Input/CustomTextField";
import PaymentDropDown from "components/DropDowns/PaymentDropDown";
import { FormattedMessage, useIntl } from "react-intl";

import { useFormik } from "formik";
import { AddEditExtendRentalModalValidation } from "validations/ExtendRentalModal.validation";
import { RentalExtensionRequestPrice } from "gql/queries/RentalExtensionPrice.gql";
import { ConfirmRentalDateExtensionRequest } from "gql/mutations/ConfirmExtension.gql";
import moment from "moment";
import { NotificationManager } from "react-notifications";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { RejectRentalDateExtensionRequest } from "gql/mutations/Rental.mutations.gql";
import { AddEditExtendRentalModal } from "./ExtendRentalModal";

// import "./style.css";
const ExtendModal = (props) => {
  const { className, openmodel, setOpenModel, setValue, orignalval, BookingId } = props;
  const [rejectRentalDateExtensionRequest] = useMutation(RejectRentalDateExtensionRequest);
  const [note, setNote] = useState("");
  const { data: bookingRes, refetch, loading, error } = useQuery(GetRentalDetailsQuery, {
    skip: !BookingId,
    variables: { id: BookingId },
  });
  const [fetchrentalExtensionPrice, { data: rentalExtensionRequestPrice }] = useLazyQuery(
    RentalExtensionRequestPrice,
    {
      errorPolicy: "all",
      onError(error) {
        NotificationManager.error(error.message);
      },
    },
  );
  const [confrimExtension] = useMutation(ConfirmRentalDateExtensionRequest);

  const { locale, formatMessage } = useIntl();
  const [reason, setReason] = useState("");
  const [disabledConfirm, setDisabledConfirm] = useState(false);
  const toggle = () => setOpenModel(!openmodel);
  function rejectRequestHandler() {
    rejectRentalDateExtensionRequest({
      variables: { rentalExtensionId: bookingRes?.rentalDetails.pendingExtensionRequest.id },
    })
      .then((res) => {
        if (res.data.rejectRentalDateExtensionRequest.status === "success") {
          NotificationManager.success(
            <FormattedMessage id="Extension request is rejected successfully" />,
          );
          props.refetch();
          toggle();
        } else {
          NotificationManager.error(<FormattedMessage id=" Error " />);
        }
      })
      .catch((err) => NotificationManager.error(err.message));
  }
  const formik = useFormik({
    initialValues: AddEditExtendRentalModal,
    validationSchema: AddEditExtendRentalModalValidation,
    onSubmit: async (values) => {
      const variables = { ...values };
    },
  });

  const { values, setFieldValue, submitCount, handleChange: handleFormikChange, errors } = formik;
  // const {
  //   dropOffDate,
  //   dropOffTime,
  //   extensionDays,
  //   paymentMethod,
  //   requestNo,
  //   statusLocalized,

  //   totalRemainingPrice,
  // } = bookingRes?.rentalDetails?.pendingExtensionRequest;
  const ConfirmExtension = () => {
    setDisabledConfirm(true);
    confrimExtension({
      variables: {
        dropOffDate: moment(values.dropOffDate).locale("en").format("DD/MM/YYYY"),
        dropOffTime: moment(values.dropOffDate).locale("en").format("HH:mm:ss"),
        rentalExtensionId: bookingRes?.rentalDetails.pendingExtensionRequest.id,
      },
    })
      .then(() => {
        refetch();

        toggle();
        setDisabledConfirm(false);
        NotificationManager.success(
          <FormattedMessage id="Extension request  is confirmed successfully" />,
        );
      })
      .catch((err) => {
        NotificationManager.error(err.message);
        setDisabledConfirm(false);
      });
  };
  useEffect(() => {
    if (bookingRes?.rentalDetails.lastRentalDateExtensionRequest) {
      setFieldValue("dropOffDate", moment(`${bookingRes?.rentalDetails.lastRentalDateExtensionRequest.dropOffDate} ${bookingRes?.rentalDetails.lastRentalDateExtensionRequest.dropOffTime}`));

      setFieldValue(
        "paymentMethod",
        bookingRes?.rentalDetails.lastRentalDateExtensionRequest.paymentMethod,
      );
      setFieldValue("isPaid", bookingRes?.rentalDetails.lastRentalDateExtensionRequest?.isPaid);

      setFieldValue(
        "extensionDays",
        bookingRes?.rentalDetails.lastRentalDateExtensionRequest.extensionDays,
      );
      setFieldValue("requestNo", bookingRes?.rentalDetails.lastRentalDateExtensionRequest.requestNo);
      setFieldValue(
        "totalRemainingPrice",
        bookingRes?.rentalDetails.lastRentalDateExtensionRequest.totalRemainingPrice,
      );
    }
 
  }, [bookingRes]);
  useEffect(() => {
    if (rentalExtensionRequestPrice) {
      setFieldValue(
        "extensionDays",
        rentalExtensionRequestPrice.rentalExtensionRequestPrice.extensionDays,
      );
      setFieldValue(
        "totalRemainingPrice",
        rentalExtensionRequestPrice.rentalExtensionRequestPrice.totalRemainingPrice,
      );
    }
  }, [rentalExtensionRequestPrice]);
  console.log(bookingRes?.rentalDetails,"bookingRes?.rentalDetails")
  return (
    <div>
      <Modal isOpen={openmodel} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>
          <FormattedMessage id="Extension request" />{" "}
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6 mt-3 mb-3">
              <FormattedMessage id="Request.status" /> :
              {bookingRes?.rentalDetails?.lastRentalDateExtensionRequest?.statusLocalized}
            </div>
            <div className="col-md-6 mt-3 mb-3">
              <FormattedMessage id="Request.No" />:{values.requestNo}
            </div>
            <div className="col-md-6 mt-3 mb-3">
              <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
                <DateTimePicker
                  okLabel={formatMessage({ id: "ok" })}
                  cancelLabel={formatMessage({ id: "cancel" })}
                  clearLabel={formatMessage({ id: "clear" })}
                  clearable
                  disabled={ !bookingRes?.rentalDetails.hasPendingExtensionRequests }
                  minDate={ bookingRes?.rentalDetails.hasPendingExtensionRequests && moment(`${bookingRes?.rentalDetails.dropOffDate} ${bookingRes?.rentalDetails.dropOffTime}`).add(1,"days")}
                  style={{ width: "100%" }}
                  value={values.dropOffDate}
                  onChange={(date) => {
                    fetchrentalExtensionPrice({
                      variables: {
                        rentalId: BookingId,
                        dropOffDate: date.locale("en").format("DD/MM/YYYY"),
                        dropOffTime: date.locale("en").format("HH:mm:ss"),
                      },
                    });
                    setFieldValue("dropOffDate", date);
                  }}
                  name="dob"
                  placeholder={formatMessage({ id: "drop_off_date" })}
                  disablePast={bookingRes?.rentalDetails.hasPendingExtensionRequests}
                  renderInput={(props) => <TextField {...props} />}
                  format="DD-MM-YYYY hh:mm A"
                  ampm
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="col-md-6 mt-3 mb-3">
              <CustomTextField
                fullWidth
                name="Extension.Duration"
                // value={values.numOfDays}
                disabled
                value={values.extensionDays}
                //   onChange={handleChange}
                // onInput={(e) => {
                //   e.target.value = e.target.value.replace(/[^0-9]/g, "");
                // }}
                // onChange={(e) => setFieldValue("numOfDays", e.target.value)}
                // error={touched.numOfDays && Boolean(errors.numOfDays)}
                // errormsg={touched.numOfDays && errors.numOfDays}
              />
            </div>
            <div className="col-md-6 mb-3 mt-3">
              <PaymentDropDown
                valueAttribute="id"
                selectedPayment={values.paymentMethod}
                disabled
                setSelectedPayment={(payment) => {
                  // setFieldValue("paymentMethod", payment);
                }}
              />
            </div>
            <div className="col-md-6 mb-3 mt-3">
              <FormattedMessage id="Payment status" />:{" "}
              {
              bookingRes?.rentalDetails?.lastRentalDateExtensionRequest?.isPaid ?
              <FormattedMessage id= "Paid"/> :
              <FormattedMessage id="Not Paid"/>
              
             
              }
            </div>
            <div className="col-md-6 mt-3 mb-3  ">
              <CustomTextField
                fullWidth
                name="value"
                // value={values.numOfDays}
                value={values.totalRemainingPrice}
                inputProps={{ maxLength: 6 }}
                disabled
                //   onChange={handleChange}
                // onInput={(e) => {
                //   e.target.value = e.target.value.replace(/[^0-9]/g, "");
                // }}
                // onChange={(e) => setFieldValue("numOfDays", e.target.value)}
                // error={touched.numOfDays && Boolean(errors.numOfDays)}
                // errormsg={touched.numOfDays && errors.numOfDays}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {
               bookingRes?.rentalDetails.hasPendingExtensionRequests && 
               <>
               <Button color="primary" disabled={disabledConfirm} onClick={() => ConfirmExtension()}>
               <FormattedMessage id="common.confirm" />
             </Button>
             <Button color="danger" onClick={rejectRequestHandler}>
               <FormattedMessage id="widgets.reject" />
             </Button>
             </>

          }
         
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ExtendModal;
