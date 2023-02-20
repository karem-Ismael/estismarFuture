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
import { RefundExtension } from "gql/mutations/RefundExtension.gql";
import { RefundExtensionBankTransfer } from "gql/mutations/ExtenstionBankTransfer.gql";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import TextField from "@material-ui/core/TextField";
import ReplayIcon from '@material-ui/icons/Replay';
const RefundExtensionComponent = ({ rentalid, refetch,extensionDetails }) => {
  const [refundExtension] = useMutation(RefundExtension);
  const [refundExtensionBankTransfer] = useMutation(RefundExtensionBankTransfer);

  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState();
  const [refundopen, setRefundOpen] = useState(false);
  const [errors, setErrors] = useState(false);
  const [disabledval, setDisabledVal] = useState(false);
  const [banktransfer, setBankTransfer] = useState(false);



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
    if (parseFloat(amount) > parseFloat(extensionDetails.totalRemainingPrice)) {
      setErrors("max.is");
      return;
    }
    setDisabledVal(true);
    refundExtension({
        variables: {
            rentalDateExtensionRequestId: +rentalid,
          amount,
        },
      })
        .then(() => {
          NotificationManager.success(<FormattedMessage id="refund.done.after.deduction" />);
          refetch();
          toggle()
          toggleRefund()
          setDisabledVal(false);
        })
        .catch((err) => NotificationManager.error(err?.message));

   
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
    if (parseFloat(amount) > parseFloat(extensionDetails.totalRemainingPrice)) {
      setErrors("max.is");
      return;
    }
    setDisabledVal(true);
    refundExtensionBankTransfer({
      variables: {
        rentalDateExtensionRequestId: +rentalid,
        amount,
      },
    }).then(() => {
      NotificationManager.success(<FormattedMessage id="refund.done.after.deduction" />);
      refetch();
      setBankTransfer(false);
      setDisabledVal(false);
      toggle()
      toggleRefund()
    }).catch(err=>NotificationManager.error(err.message))
  };
  const toggle = () => setOpen(!open);
  return (
    <>
      <div>
      <label title={formatMessage({ id: "refund" })}>
        <ReplayIcon onClick={() => toggle()} style={{cursor:"pointer"}}/>
        </label>

        <Modal isOpen={open} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            <FormattedMessage id="refund" />
          </ModalHeader>
          <ModalBody>
            <div className="text-center">
              <p>{formatMessage({ id: "are.u.sure.?" })}</p>
              <p>{formatMessage({ id: `u.want.to.refund.this.extension.to.u` })}</p>
            </div>
          </ModalBody>
          <ModalFooter>
           
            <Button color="secondary" onClick={PartialRefund}>
              {formatMessage({ id: "Partial.Refund" })}
            </Button>
            <Button color="danger" onClick={BankTransfer}>
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
                  errors && parseFloat(amount) > parseFloat(extensionDetails.totalRemainingPrice)
                    ? `${formatMessage({ id: errors })} ${parseFloat(
                        extensionDetails.totalRemainingPrice ,
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
export default RefundExtensionComponent;
