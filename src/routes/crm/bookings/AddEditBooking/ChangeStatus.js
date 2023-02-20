/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GetStatus } from "gql/queries/GetStatus.gql";
import { AcceptRent } from "gql/mutations/AcceptRental.gql";
import { CarRecieved } from "gql/mutations/RecievedCar.gql";
import { ImageUpload } from "gql/mutations/UploadImage.gql";
import { FileUploader } from "components/ImageUploader";
import { AllyReceiveCar } from "gql/mutations/ChangeToInvoice.gql";
import { NotificationManager } from "react-notifications";
import { CloseRental } from "gql/mutations/CloseRental.gql";
import RejectModal from "../RejectModal";
import CustomTextField from "components/Input/CustomTextField";
import store from "../../../../store";
import { CancelledReasons } from "gql/queries/CancelReasons.gql";
import { RejectedReasons } from "gql/queries/RejectReasons.gql";
import { RejectRental } from "gql/mutations/RejectRental.gql";
import ReasonsModal from "../ReasonsModel";
function ChangeStatus({ rentalDetails }) {
  const { bookingId } = useParams();
  const { ally_id } = store.getState()?.authUser.user;

  const [cancelledReasons, { loading, data: reasons }] = useLazyQuery(CancelledReasons);
  const [rejectedReasons, { data: rejectreasons }] = useLazyQuery(RejectedReasons);
  const [value, setValue] = React.useState(null);
  const [acceptRental] = useMutation(AcceptRent);
  const [carReceived] = useMutation(CarRecieved);
  const [imageUpload] = useMutation(ImageUpload);
  const [allyReceiveCar] = useMutation(AllyReceiveCar);
  const [rejectRental] = useMutation(RejectRental);
  const [image, setImage] = useState("");
  const [grandTotal, setGrangTotal] = useState(0);
  const [closeRental] = useMutation(CloseRental);
  const { data, refetch } = useQuery(GetStatus, { variables: { id: bookingId } });
  const [Reasons, setReasons] = useState();
  const [openmodel, setOpenModel] = useState(false);
  const [rejectmodal, setRejectModal] = useState(false);
  const [rejectedreasons, setRejectedReasons] = useState();
  function successAction() {
    NotificationManager.success(<FormattedMessage id="StatusSucessfully" />);
    refetch();
  }
  useEffect(() => {
    if (reasons && value == "closed") {
      setReasons(reasons);
      setOpenModel(true);
    }
  }, [reasons]);
  useEffect(() => {
    if (rejectreasons && value == "rejected") {
      setRejectedReasons(rejectreasons);
      setRejectModal(true);
    }
  }, [rejectreasons]);
  useEffect(() => {
    if (rentalDetails?.rentalDetails?.invoicePic) {
      setImage(rentalDetails.rentalDetails.invoicePic);
    }
    if (rentalDetails?.rentalDetails?.newGrandTotal) {
      setGrangTotal(rentalDetails?.rentalDetails?.newGrandTotal);
    }
  }, [rentalDetails]);
  function ImageUpladThenCarRecived() {
    imageUpload({
      variables: { image, topic: "InvoiceImage" },
    })
      .then((res) => {
        res.data.imageUpload.status == "success"
          ? allyReceiveCar({
              variables: {
                invoicePic: res.data.imageUpload.imageUpload.imageUrl,
                newGrandTotal: grandTotal ? grandTotal : 0,
                rentalId: bookingId,
              },
            }).then((res) => {
              if (res.data.allyReceiveCar.status == "success") {
                successAction();
              } else {
                NotificationManager.error(<FormattedMessage id="Error" />);
              }
            })
          : null;
      })
      .catch((err) => {
        NotificationManager.error(err.message);
      });
  }

  function applyCarRevieved() {
    return carReceived({
      variables: { rentalId: bookingId },
    }).then((res) => {
      if (res.data.carReceived.status == "success") {
        successAction();
      } else {
        NotificationManager.error(<FormattedMessage id="error" />);
      }
    });
  }

  function performAcceptRental() {
    acceptRental({
      variables: { rentalId: bookingId },
    })
      .then((res) => {
        if (res?.data?.acceptRental?.status == "success") {
          successAction();
        } else {
          NotificationManager.error(<FormattedMessage id=" Error " />);
        }
      })
      .catch((err) => NotificationManager.error(err.message));
  }

  function performCloseRent(reason, note) {
    if (!reason) {
      NotificationManager.error(<FormattedMessage id="please.selecte.reason" />);
      return;
    }
    if (+reason == 998 && !note.length) {
      NotificationManager.error(<FormattedMessage id="note.required" />);
      return;
    }

    closeRental({
      variables: {
        rentalId: +bookingId,
        closeReasonId: +reason,
        note,
      },
    })
      .then((res) => {
        setOpenModel(false);
        successAction();
      })
      .catch((err) => {
        NotificationManager.error(err?.message);
        refetch();
      });
  }
  function rejectRent(reason) {
    if (!reason) {
      NotificationManager.error(<FormattedMessage id="please.selecte.reason" />);
      return;
    }
    rejectRental({
      variables: {
        rejectedReasons: +reason,
        rentalId: bookingId,
      },
    })
      .then((res) => {
        setRejectModal(false);
        successAction();
      })
      .catch((err) => {
        NotificationManager.error(err?.message);
      });
  }

  function performAllyRecieveCar() {
    allyReceiveCar({
      variables: {
        rentalId: bookingId,
        invoicePic: image,
        newGrandTotal: grandTotal ? grandTotal : 0,
      },
    })
      .then((res) => {
        successAction();
      })
      .catch((err) => NotificationManager.error(err?.message));
  }
  function applyCarRejected() {
    rejectedReasons({
      variables: {
        status: data?.rentalDetails.status == "pending" ? "pending" : "confirmed",
        userType: "ally",
      },
    });
    if (rejectedreasons) {
      setRejectModal(true);
    }
  }
  function OpenReasones() {
    const { ally_id } = store.getState()?.authUser.user;
    if (ally_id) {
      cancelledReasons({
        variables: {
          status: data?.rentalDetails.status == "pending" ? "pending" : "confirmed",
          userType: "ally",
        },
      });
      if (reasons) {
        setOpenModel(true);
      }
    } else {
      cancelledReasons({
        variables: {
          status: data?.rentalDetails.status == "pending" ? "pending" : "confirmed",
          userType: data?.rentalDetails.status == "pending" ? "customer" : "customer_care",
        },
      });
      if (reasons) {
        setOpenModel(true);
      }
    }
  }

  useEffect(() => {
    setValue(data?.rentalDetails.status);
  }, [data]);

  const onChangeStatus = (value) => {
    setValue(value);
    value === "confirmed"
      ? performAcceptRental()
      : value == "rejected"
      ? applyCarRejected()
      : value === "car_received"
      ? applyCarRevieved()
      : value === "invoiced"
      ? image.length > 0 && !image.includes("https")
        ? ImageUpladThenCarRecived()
        : performAllyRecieveCar()
      : OpenReasones();
  };

  const InputHandelChange = (e) => {
    if (e.target.value.length) {
      const value = parseFloat(e.target.value);
      setGrangTotal(value);
    } else {
      setGrangTotal(null);
    }
  };

  const Check = () => (
    <>
      <i class="fa fa-check-circle" aria-hidden="true"></i>{" "}
    </>
  );

  return (
    <>
      <ReasonsModal
        openmodel={openmodel}
        setOpenModel={setOpenModel}
        reasons={reasons}
        setValue={setValue}
        orignalval={data?.rentalDetails.status}
        performCloseRent={performCloseRent}
      />
      <RejectModal
        openmodel={rejectmodal}
        setOpenModel={setRejectModal}
        reasons={rejectedreasons}
        setValue={setValue}
        orignalval={data?.rentalDetails.status}
        rejectRent={rejectRent}
      />
      {value && (
        <div>
          <div className="d-flex">
            <button
              className="btn btn-info mr-1 ml-1 btn-md"
              value="pending"
              disabled
              onClick={(e) => onChangeStatus(e.target.value)}
            >
              {value === "pending" && <Check />}
              <FormattedMessage id="PENDING" />
            </button>
            <button
              className="btn btn-success mr-1 ml-1 btn-md"
              value="confirmed"
              onClick={(e) => onChangeStatus(e.target.value)}
            >
              {value === "confirmed" && <Check />}
              <FormattedMessage id="CONFIRMED" />
            </button>
            <button
              className="btn btn-secondary mr-1 ml-1 btn-md"
              value="car_received"
              onClick={(e) => onChangeStatus(e.target.value)}
            >
              {value === "car_received" && <Check />}
              <FormattedMessage id="CAR_RECEIVED" />
            </button>
            <button
              className="btn btn-primary mr-1 ml-1 btn-md"
              value="invoiced"
              onClick={(e) => onChangeStatus(e.target.value)}
            >
              {value === "invoiced" && <Check />}
              <FormattedMessage id="INVOICED" />
            </button>
            {value === "cancelled" && (
              <button disabled className="btn btn-danger mr-1 ml-1 btn-md" value="cancelled">
                {value === "cancelled" && <Check />}
                <FormattedMessage id="CANCELLED" />
              </button>
            )}
            {ally_id && (
              <button
                className="btn btn-warning mr-1 ml-1 btn-md"
                value="rejected"
                onClick={(e) => onChangeStatus(e.target.value)}
              >
                {value === "rejected" && <Check />}
                <FormattedMessage id="REJECTED" />
              </button>
            )}
            {!ally_id && (
              <button
                className="btn btn-danger mr-1 ml-1 btn-md"
                value="closed"
                onClick={(e) => onChangeStatus(e.target.value)}
                disabled={data?.rentalDetails.status == "closed"}
              >
                {value === "closed" && <Check />}
                <FormattedMessage id="CLOSED" />
              </button>
            )}
          </div>
          {(value === "car_received" || value === "invoiced") && (
            <div className="mt-4 col-sm-12 col-md-4">
              <div className="col-lg-auto" style={{ width: "200px" }}>
                <FileUploader titleId="InvoiceImage" image={image} setImage={setImage} />
              </div>
              <div className="col-lg-auto p-1">
                <CustomTextField
                  value={grandTotal}
                  name="grandTotal"
                  onChange={(e) => InputHandelChange(e)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ChangeStatus;
