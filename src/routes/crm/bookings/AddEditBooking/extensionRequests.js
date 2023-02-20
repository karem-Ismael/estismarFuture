/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AddIcon from "@material-ui/icons/Add";
import {
  MuiPickersUtilsProvider,
  DateTimePicker as MaterialDateTimePicker,
} from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { Button, ClickAwayListener, TextField } from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/client";
import { RentalExtensionRequestPrice } from "gql/queries/Rental.queries.gql";
import { ConfirmRentalDateExtensionRequest } from "gql/mutations/ConfirmExtension.gql";
import {ResendRentalExtensionIntegration} from "gql/mutations/ResendExtensionToAlly.gql"
import {
  CreateRentalDateExtensionRequest,
  UpdateRentalDateExtensionRequest,
  RejectRentalDateExtensionRequest,
} from "gql/mutations/Rental.mutations.gql";
import { Cancel, Check, Close, Edit } from "@material-ui/icons";
import SendIcon from '@material-ui/icons/Send';
import { NotificationManager } from "react-notifications";
import RefundExtensionComponent from "./refundExtension";
export default function ExtenstionRequests({
  extensionModalOpen,
  setIsExtensionModalOpen,
  rentalDateExtensionRequests,
  hasPendingExtensionRequests,
  rentalDetails,
  refetchBooking,
}) {
  const { formatMessage, locale } = useIntl();
  const [requests, setRequests] = useState(rentalDateExtensionRequests || []);
  const [newDropOffDate, setNewDropOffDate] = useState(null);
  const [newDropOffTime, setNewDropOffTime] = useState(null);
  const [showAddBtn, setShowAddBtn] = useState(true);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [confrimExtension] = useMutation(ConfirmRentalDateExtensionRequest);

  const { data: rentalExtensionRequestPriceData, error: rentalExtensionRequestPriceErr } = useQuery(
    RentalExtensionRequestPrice,
    {
      skip: !rentalDetails?.id || !newDropOffDate || !newDropOffTime,
      variables: {
        rentalId: rentalDetails?.id,
        dropOffDate: moment(newDropOffDate).locale("en-US").format("DD/MM/YYYY") || undefined,
        dropOffTime:
          moment(newDropOffTime, "hh:mm:ss A").locale("en-US").format("HH:mm:ss") || undefined,
      },
      errorPolicy: "all",
      onError(error) {
        NotificationManager.error(error.message);
      },
    },
  );

  const errorExtesntionRentalPriceMemo = useMemo(() => rentalExtensionRequestPriceErr, [
    rentalExtensionRequestPriceErr?.message,
  ]);

  const [createRentalDateExtensionRequest] = useMutation(CreateRentalDateExtensionRequest);
  const [updateRentalDateExtensionRequest] = useMutation(UpdateRentalDateExtensionRequest);
  const [rejectRentalDateExtensionRequest] = useMutation(RejectRentalDateExtensionRequest);
const [resendRentalExtensionIntegration]=useMutation(ResendRentalExtensionIntegration)
  useMemo(() => {
    setRequests(rentalDateExtensionRequests);
  }, [rentalDateExtensionRequests]);
const ConfirmExtension=(id)=>{
  confrimExtension({
    variables: {
  
      rentalExtensionId: id,
    },
  })
    .then(() => {
      NotificationManager.success(
        <FormattedMessage id="Extension request  is confirmed successfully" />,
      );
    })
    .catch((err) => {
      NotificationManager.error(err.message);
    });
}
  useEffect(() => {
    refetchBooking();
  }, []);

  useEffect(() => {
    moment.locale(locale === "ar" ? "ar" : "en-au");
  }, [locale]);

  useEffect(() => {
    // if (errorExtesntionRentalPriceMemo) {
    //   NotificationManager.error(errorExtesntionRentalPriceMemo.message);
    // }
  }, [errorExtesntionRentalPriceMemo]);

  useEffect(() => {
    document.querySelector("body").addEventListener("click", (e) => {
      if (e.target.classList[0] === "modal") {
        setIsExtensionModalOpen(false);
      }
    });
    document.onkeydown = (e) => {
      if (e.key == "Escape") {
        setIsExtensionModalOpen(false);
      }
    };
  }, []);

  function addBtnHanlder() {
    setShowAddBtn(!showAddBtn);
    setRequests([{}, ...requests]);
  }

  function dropOffDateTimeHandler(date, id) {
    const filteredItem = { ...requests.find((i) => i.id === id) };
    const requestWithoutFilterItem = requests.filter((i) => i.id !== id);
    filteredItem.dropOffDate = moment(date).locale("en-US").format("YYYY-MM-DD");
    filteredItem.dropOffTime = moment(date).locale("en-US").format("HH:mm:ss");
    setNewDropOffDate(filteredItem.dropOffDate);
    setNewDropOffTime(filteredItem.dropOffTime);
    setCurrentRequestId(filteredItem.id);
    setRequests([filteredItem, ...requestWithoutFilterItem]);
  }

  function addNewRequestHandler() {
    const data = {
      rentalId: rentalDetails?.id,
      dropOffDate: moment(newDropOffDate).locale("en-US").format("DD/MM/YYYY"),
      dropOffTime: moment(newDropOffTime, "hh:mm:ss A").locale("en-US").format("HH:mm:ss"),
      paymentMethod: rentalDetails?.paymentMethod,
    };
    async function mutation() {
      try {
        const res = await createRentalDateExtensionRequest({ variables: data });
        if (res.data && res.data.createRentalDateExtensionRequest.status === "success") {
          NotificationManager.success(formatMessage({ id: "success.create.extensionRequest" }));
          refetchBooking();
          // setIsExtensionModalOpen(false);
        }
      } catch (e) {
        NotificationManager.error(e.message);
      }
    }
    if (data && Object.keys(data).length === 4) {
      mutation();
    }
  }
  function updateRequestHandler() {
    const data = {
      id: currentRequestId,
      dropOffDate: moment(newDropOffDate).locale("en-US").format("DD/MM/YYYY"),
      dropOffTime: moment(newDropOffTime, "hh:mm:ss A").locale("en-US").format("HH:mm:ss"),
    };
    async function mutation() {
      try {
        const res = await updateRentalDateExtensionRequest({ variables: data });
        if (res.data && res.data.updateRentalDateExtensionRequest.status === "success") {
          NotificationManager.success(formatMessage({ id: "success.update.extensionRequest" }));
          refetchBooking();
          setCurrentRequestId(null);
        }
      } catch (e) {
        NotificationManager.error(e.message);
      }
    }
    if (data && Object.keys(data).length === 3) {
      mutation();
    }
  }

  function rejectRequestHandler(id) {
    rejectRentalDateExtensionRequest({ variables: { rentalExtensionId: id } })
      .then((res) => {
        if (res.data.rejectRentalDateExtensionRequest.status === "success") {
          NotificationManager.success(
            <FormattedMessage id="Extension request is rejected successfully" />,
          );
          refetchBooking();
        } else {
          NotificationManager.error(<FormattedMessage id=" Error " />);
        }
      })
      .catch((err) => NotificationManager.error(err.message));
  }
function sendToAlly(id){
  resendRentalExtensionIntegration({
    variables:{
      rentalExtensionId:id
    }
  }).then(()=>{
    NotificationManager.success(<FormattedMessage id="Successfully sent to the ally"/>)
    refetchBooking()
  })
  .catch(()=> NotificationManager.error(<FormattedMessage id="Unable to send request to ally" />))
}
  return (
    <Modal isOpen={extensionModalOpen} style={{ maxWidth: "fit-content" }}>
      <>
        <div className="d-flex justify-content-between align-items-center px-2">
          <Close style={{ cursor: "pointer" }} onClick={() => setIsExtensionModalOpen(false)} />
          <ModalHeader>
            <h2 style={{ fontSize: "24px" }}>
              <FormattedMessage id="Extension Requests" />
            </h2>
          </ModalHeader>
          {!hasPendingExtensionRequests && rentalDetails?.status === "car_received" ? (
            <div
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
              onClick={addBtnHanlder}
            >
              {showAddBtn && (
                <Button variant="outlined">
                  <span>
                    <FormattedMessage id="button.add" />
                  </span>
                  <AddIcon />
                </Button>
              )}
            </div>
          ) : (
            <div />
          )}
        </div>
        {requests?.length ? (
          <ModalBody>
            <table style={{ borderCollapse: "collapse" }}>
              <tr className="px-2 py-2">
                <th className="px-2 py-2 table-bordered">
                  <FormattedMessage id="Request No." />
                </th>
                <th className="px-2 py-2 table-bordered">
                  <FormattedMessage id="New_return_Time" />
                </th>
                <th className="px-2 py-2 table-bordered">
                  <FormattedMessage id="Extension Days" />
                </th>
                <th className="px-2 py-2 table-bordered">
                  <FormattedMessage id="Value" />
                </th>
                <th className="px-2 py-2 table-bordered">
                  <FormattedMessage id="paymentmethod" />
                </th>
                <th className="px-2 py-2 table-bordered">
                  <FormattedMessage id="Request status" />
                </th>
                <th className="px-2 py-2 table-bordered">
                  <FormattedMessage id="Payment status" />
                </th>
                <th className="px-2 py-2 table-bordered">
                  <FormattedMessage id="common.actions" />
                </th>
              </tr>

              {requests?.map((i, index) => (
            
                <tr key={index}>
                  <td className="px-2 py-2 table-bordered">{`${i?.requestNo || "-"}`}</td>
                  <td className="px-2 py-2 table-bordered">
                    <MuiPickersUtilsProvider
                      libInstance={moment}
                      utils={MomentUtils}
                      locale={locale}
                    >
                      <MaterialDateTimePicker
                        okLabel={formatMessage({ id: "ok" })}
                        cancelLabel={formatMessage({ id: "cancel" })}
                        clearLabel={formatMessage({ id: "clear" })}
                        clearable
                        style={{ width: "100%" }}
                        value={
                          i?.dropOffDate && i?.dropOffTime
                            ? moment(`${i?.dropOffDate} ${i.dropOffTime}`, "YYYY-MM-DD HH:mm:ss")
                            : null
                        }
                        onChange={(date) => dropOffDateTimeHandler(date, i?.id)}
                        name="dob"
                        placeholder={formatMessage({ id: "drop_off_date" })}
                        disablePast
                        renderInput={(props) => <TextField {...props} />}
                        format="DD-MM-YYYY hh:mm:ss A"
                        ampm
                        disabled={
                          rentalDetails?.status !== "car_received" ||
                          (i?.status ? i?.status !== "pending" : null)
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </td>
                  <td className="px-2 py-2 table-bordered">{`${
                    i?.id === currentRequestId
                      ? rentalExtensionRequestPriceData?.rentalExtensionRequestPrice
                          ?.extensionDays || "-"
                      : i?.extensionDays || "-"
                  } ${
                    i?.extensionDays ||
                    rentalExtensionRequestPriceData?.rentalExtensionRequestPrice?.extensionDays
                      ? formatMessage({
                          id: "day",
                        })
                      : ""
                  }`}</td>
                  <td className="px-2 py-2 table-bordered">{`${
                    i?.id === currentRequestId
                      ? rentalExtensionRequestPriceData?.rentalExtensionRequestPrice
                          ?.totalRemainingPrice || "-"
                      : i?.totalRemainingPrice || "-"
                  }`}</td>
                  <td className="px-2 py-2 table-bordered">{`${
                    formatMessage({ id: rentalDetails?.paymentMethod }) ||
                    formatMessage({ id: i?.paymentMethod })
                  }`}</td>
                  <td className="px-2 py-2 table-bordered">{`${
                    i?.statusLocalized || formatMessage({ id: "PENDING" })
                  }`}</td>
                  <td className="px-2 py-2 table-bordered">
                  {
                    i.isPaid ?

                             <FormattedMessage id= "Paid"/> :
                             <FormattedMessage id="Not Paid"/>
                          }
                  </td>
                  <td className="px-2 py-2 table-bordered">
                    {i?.requestNo ? (
                      i?.status === "pending" && rentalDetails?.status === "car_received" ? (
                        <div className="d-flex" style={{ gap: "7px" }}>
                          {i?.id === currentRequestId ? (
                            <div onClick={updateRequestHandler}>
                              <label title={formatMessage({ id: "Edit" })}>
                                <Edit style={{ cursor: "pointer" }} />
                              </label>
                            </div>
                          ) : null}
                          
                          <label title={formatMessage({ id: "common.confirm" })}>
                            <Check style={{ cursor: "pointer" }} onClick={()=>ConfirmExtension(i.id)} />
                          </label>
                          <label title={formatMessage({ id: "button.reject" })}>
                            <Cancel
                              onClick={() => rejectRequestHandler(i.id)}
                              style={{ cursor: "pointer" }}
                            />
                          </label>
                        </div>
                      ) : i.canSendExtensionToAlly ? 
                      <label title={formatMessage({ id: "Resend to ally" })}>
                            <SendIcon
                              onClick={() => sendToAlly(i.id)}
                              style={{ cursor: "pointer" }}
                            />
                          </label>
                      
                      : null
                    
                    ) : (
                      <Button
                        disabled={!newDropOffDate || !newDropOffTime}
                        variant="outlined"
                        color="primary"
                        onClick={addNewRequestHandler}
                      >
                        <FormattedMessage id="AddRequest" />
                      </Button>
                    )}
                    {
                        i.refundable ?  
                       
                        <RefundExtensionComponent rentalid={i.id} extensionDetails={i} refetch={refetchBooking}/> 
                      : null
                    }
                  </td>
                </tr>
              ))}
            </table>
          </ModalBody>
        ) : (
          <p className="text-center my-4">
            <FormattedMessage id="No data found" />
          </p>
        )}
       
      </>
    </Modal>
  );
}
