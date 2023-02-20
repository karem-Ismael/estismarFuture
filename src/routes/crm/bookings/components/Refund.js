/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { NotificationManager } from "react-notifications";

import swal from "sweetalert";
import { useMutation } from "@apollo/client";
import { RefundRental } from "gql/mutations/RefundRental.gql";
import { BankTransferRefund } from "gql/mutations/BankTransfer.gql";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import TextField from "@material-ui/core/TextField";

const Refund = ({ rentalid, is24Passed, refetch, bookingDetails }) => {
  const [refundRental] = useMutation(RefundRental);
  const [bankTransferRefund] = useMutation(BankTransferRefund);

  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState();
  const [refundopen, setRefundOpen] = useState(false);
  const [errors, setErrors] = useState(false);
  const [disabledval, setDisabledVal] = useState(false);
  const [banktransfer, setBankTransfer] = useState(false);

  const handelRefund = () => {
    swal({
      title: formatMessage({ id: "are.u.sure.?" }),
      text: formatMessage({ id: `u.want.to.refund.this.Booking.to.u` }),
      icon: "warning",

      buttons: {
        defeate: {
          text: formatMessage({ id: "refundwithdeduction" }),
          value: "cancel",
          className: "btn btn-danger",
        },
        catch: {
          text: formatMessage({ id: "fullrefund" }),
          value: "catch",
          className: "btn btn-info",
        },
        kk: {
          text: formatMessage({ id: "ref" }),
          value: "catch",
          className: "btn btn-info",
        },
      },
    }).then((result) => {
      if (result == "catch") {

        refundRental({
          variables: {
            rentalId: +rentalid,
            withDayDeduction: false,
          },
        })
          .then(() => {
            NotificationManager.success(<FormattedMessage id="refund.done" />);
            refetch();
          })
          .catch((err) => NotificationManager.error(err?.message));
      } else if (result == "cancel") {
        refundRental({
          variables: {
            rentalId: +rentalid,
            withDayDeduction: true,
          },
        })
          .then(() => {
            NotificationManager.success(<FormattedMessage id="refund.done.after.deduction" />);
            refetch();
          })
          .catch((err) => NotificationManager.error(err?.message));
      }
    });
  };
  const toggle = () => setOpen(!open);
  const fullRefund = () => {
    swal({
      title: formatMessage({ id:  "Wallet Refund"  }),
      text: formatMessage({ id: `Do you refund to the customer's wallet?` }),
      icon: "warning",

      buttons: {
       
        catch: {
          text: formatMessage({ id: "yes" }),
          value: "catch",
          className: "btn btn-info",
        },
        kk: {
          text: formatMessage({ id: "no" }),
          value: "no",
          className: "btn btn-danger",
        },
      },
    }).then((result)=>{
      if(result == "catch"){
     refundRental({
      variables: {
        rentalId: +rentalid,
        withDayDeduction: false,
        toWallet:true
      },
    })
      .then(() => {
        NotificationManager.success(<FormattedMessage id="refund.done" />);
        refetch();
      })
      .catch((err) => NotificationManager.error(err?.message));
      }else if (result =="no"){
           refundRental({
      variables: {
        rentalId: +rentalid,
        withDayDeduction: false,
      },
    })
      .then(() => {
        NotificationManager.success(<FormattedMessage id="refund.done" />);
        refetch();
      })
      .catch((err) => NotificationManager.error(err?.message));
      }
    })
    // refundRental({
    //   variables: {
    //     rentalId: +rentalid,
    //     withDayDeduction: false,
    //   },
    // })
    //   .then(() => {
    //     NotificationManager.success(<FormattedMessage id="refund.done" />);
    //     refetch();
    //   })
    //   .catch((err) => NotificationManager.error(err?.message));
  };
  const refundwithdeduction = () => {
    swal({
      title: formatMessage({ id: "Wallet Refund"}),
      text: formatMessage({ id: `Do you refund to the customer's wallet?` }),
      icon: "warning",

      buttons: {
        kk: {
          text: formatMessage({ id: "no" }),
          value: "no",
          className: "btn btn-danger",
        },
        catch: {
          text: formatMessage({ id: "yes" }),
          value: "catch",
          className: "btn btn-info",
        },
      },
    }).then((result)=>{
      if(result == "catch"){
           refundRental({
      variables: {
        rentalId: +rentalid,
        withDayDeduction: true,
        toWallet:true
      },
    })
      .then(() => {
        NotificationManager.success(<FormattedMessage id="refund.done.after.deduction" />);
        refetch();
      })
      .catch((err) => NotificationManager.error(err?.message));
      }else if(result=="no"){
           refundRental({
      variables: {
        rentalId: +rentalid,
        withDayDeduction: true,
      },
    })
      .then(() => {
        NotificationManager.success(<FormattedMessage id="refund.done.after.deduction" />);
        refetch();
      })
      .catch((err) => NotificationManager.error(err?.message));
      }
    })
   
  };
  const PartialRefund = () => {
    setRefundOpen(!refundopen);
  };
  const BankTransfer = () => {
    setRefundOpen(!refundopen);
    setBankTransfer(true);
  };
  const BookingRefundPartial = () => {
    if (!amount || !amount.toString().length) {
      setErrors("thisfieldisrequired");
      return;
    }
    if (parseFloat(amount) > parseFloat(bookingDetails.totalBookingPrice)) {
      setErrors("max.is");
      return;
    }
    setDisabledVal(true);
    swal({
      title: formatMessage({ id: "Wallet Refund" }),
      text: formatMessage({ id: `Do you refund to the customer's wallet?` }),
      icon: "warning",

      buttons: {
        kk: {
          text: formatMessage({ id: "no" }),
          value: "no",
          className: "btn btn-danger",
        },
        catch: {
          text: formatMessage({ id: "yes" }),
          value: "catch",
          className: "btn btn-info",
        },
      },
    }).then((result)=>{
      if(result == "catch"){
        refundRental({
          variables: {
            rentalId: +rentalid,
            amount,
            toWallet:true
          },
        })
          .then(() => {
            NotificationManager.success(<FormattedMessage id="refund.done.after.deduction" />);
            refetch();
            setDisabledVal(false);
          })
          .catch((err) => NotificationManager.error(err?.message));
      }else if(result == "no"){
        refundRental({
          variables: {
            rentalId: +rentalid,
            amount,
          },
        })
          .then(() => {
            NotificationManager.success(<FormattedMessage id="refund.done.after.deduction" />);
            refetch();
            setDisabledVal(false);
          })
          .catch((err) => NotificationManager.error(err?.message));
      }else{
        setDisabledVal(false);

      }
    })

   
  };
  const toggleRefund = () => {
    setRefundOpen(!refundopen);
    setBankTransfer(false);
  };
  const BookingBankTransfer = () => {
    if (!amount || !amount.toString().length) {
      setErrors("thisfieldisrequired");
      return;
    }
    if (parseFloat(amount) > parseFloat(bookingDetails.totalBookingPrice)) {
      setErrors("max.is");
      return;
    }
    setDisabledVal(true);
    bankTransferRefund({
      variables: {
        rentalId: +rentalid,
        amount,
      },
    }).then(() => {
      NotificationManager.success(<FormattedMessage id="refund.done.after.deduction" />);
      refetch();
      setBankTransfer(false);
      setDisabledVal(false);
    });
  };

  return (
    <>
      <div>
        <button onClick={() => toggle()} className="btn btn-link">
          <FormattedMessage id="refund" />
        </button>

        <Modal isOpen={open} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            <FormattedMessage id="refund" />
          </ModalHeader>
          <ModalBody>
            <div className="text-center">
              <p>{formatMessage({ id: "are.u.sure.?" })}</p>
              <p>{formatMessage({ id: `u.want.to.refund.this.Booking.to.u` })}</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={refundwithdeduction}>
              {formatMessage({ id: "refundwithdeduction" })}
            </Button>
            <Button color="info" onClick={fullRefund}>
              {formatMessage({ id: "fullrefund" })}
            </Button>
            <Button color="secondary" onClick={PartialRefund}>
              {formatMessage({ id: "Partial.Refund" })}
            </Button>
            <Button color="secondary" onClick={BankTransfer}>
              {formatMessage({ id: "Bank.Transfer.Refund" })}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div>
        <Modal isOpen={refundopen} toggle={toggleRefund}>
          <ModalHeader toggle={toggleRefund}>
            {banktransfer ? (
              formatMessage({ id: "Bank.Transfer.Refund" })
            ) : (
              <FormattedMessage id="Partial.Refund" />
            )}
          </ModalHeader>
          <ModalBody>
            <div>
              <TextField
                error={!!errors}
                id="outlined-error-helper-text"
                label={formatMessage({ id: "value" })}
                helperText={
                  errors && parseFloat(amount) > parseFloat(bookingDetails.totalBookingPrice)
                    ? `${formatMessage({ id: errors })} ${parseFloat(
                        bookingDetails.totalBookingPrice,
                      )}`
                    : errors
                    ? formatMessage({ id: errors })
                    : null
                }
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9\b,.]/g, "");
                }}
                type="text"
                variant="outlined"
                onChange={(e) => {
                  setAmount(parseFloat(e.target.value));

                  // e.target.value = e.target.value
                  //   setAmount(parseFloat(e.target.value));
                  setErrors(null);
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={disabledval}
              color="secondary"
              onClick={banktransfer ? BookingBankTransfer : BookingRefundPartial}
            >
              {formatMessage({ id: "common.confirm" })}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};
export default Refund;
