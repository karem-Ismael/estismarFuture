import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { NotificationManager } from "react-notifications";

import swal from "sweetalert";
import { useMutation } from "@apollo/client";
import { RefundRental } from "gql/mutations/RefundRental.gql";
const Refund = ({ rentalid, is24Passed, refetch }) => {
  const [refundRental] = useMutation(RefundRental);
  const { formatMessage } = useIntl();

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
  return (
    <div>
      <button onClick={() => handelRefund()} className="btn btn-link">
        <FormattedMessage id="refund" />
      </button>
    </div>
  );
};
export default Refund;
