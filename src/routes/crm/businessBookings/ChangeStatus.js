/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GetStatus } from "gql/queries/GetBusinessRentalStatus.gql";
import { ConfirmBusinessRental } from "gql/mutations/ConfirmRental.gql";
import { BusinessCarReceived } from "gql/mutations/RecievedCar.gql";
import { ImageUpload } from "gql/mutations/UploadImage.gql";
import { FileUploader } from "components/ImageUploader";
import { InvoiceBusinessRental } from "gql/mutations/ChangeToInvoice.gql";
import { NotificationManager } from "react-notifications";
import { CloseBusinessRental } from "gql/mutations/CloseRental.gql";
import moment from "moment";
import RejectModal from "./RejectModal";
import CustomTextField from "components/Input/CustomTextField";
import store from "../../../store";
import { BusinessClosedReasons } from "gql/queries/BusinessClosedReasons.gql";
import { RejectedReasons } from "gql/queries/RejectReasons.gql";
import { RejectRental } from "gql/mutations/RejectRental.gql";
import ReasonsModal from "./ReasonsModel";
import { CircularProgress } from "@material-ui/core";
function ChangeStatus() {
  const { businessBookingId } = useParams();
  const { ally_id } = store.getState()?.authUser.user;

  const [businessClosedReasons, { loading, data: businessClosedReasonsData }] = useLazyQuery(
    BusinessClosedReasons,
  );
  const [rejectedReasons, { data: rejectreasons }] = useLazyQuery(RejectedReasons);
  const [value, setValue] = React.useState(null);
  const [confirmBusinessRental] = useMutation(ConfirmBusinessRental);
  const [businessCarReceived] = useMutation(BusinessCarReceived);
  const [imageUpload, { loading: loadingImgUpload }] = useMutation(ImageUpload);
  const [invoiceBusinessRental] = useMutation(InvoiceBusinessRental);
  const [rejectRental] = useMutation(RejectRental);
  const [image, setImage] = useState("");
  const [grandTotal, setGrangTotal] = useState(0);
  const [closeBusinessRental] = useMutation(CloseBusinessRental);
  const { data, refetch } = useQuery(GetStatus, { variables: { id: businessBookingId } });
  const [Reasons, setReasons] = useState();
  const [openmodel, setOpenModel] = useState(false);
  const [rejectmodal, setRejectModal] = useState(false);
  const [rejectedreasons, setRejectedReasons] = useState();
  function successAction() {
    NotificationManager.success(<FormattedMessage id="StatusSucessfully" />);
    refetch();
  }
  useEffect(() => {
    if (businessClosedReasonsData && value == "closed") {
      setReasons(businessClosedReasonsData);
      setOpenModel(true);
    }
  }, [businessClosedReasonsData]);
  useEffect(() => {
    if (rejectreasons && value == "rejected") {
      setRejectedReasons(rejectreasons);
      setRejectModal(true);
    }
  }, [rejectreasons]);

  useEffect(() => {
    if (image) {
      async function ImageUpload() {
        const res = await imageUpload({
          variables: { image, topic: "InvoiceImage" },
        });
        if (res.data.imageUpload.status == "success") {
          invoiceBusinessRental({
            variables: {
              invoicePic: res.data.imageUpload.imageUpload.imageUrl,
              newGrandTotal: grandTotal,
              businessRentalId: businessBookingId,
            },
          }).then((res) => {
            if (res.data.invoiceBusinessRental.status == "success") {
              successAction();
            } else {
              NotificationManager.error(<FormattedMessage id="Error" />);
            }
          });
        }
      }
      ImageUpload();
    }
  }, [image, grandTotal]);

  function applyCarRevieved() {
    businessCarReceived({
      variables: { businessRentalId: businessBookingId },
    }).then((res) => {
      if (res.data.businessCarReceived.status == "success") {
        successAction();
      } else {
        NotificationManager.error(<FormattedMessage id="error" />);
      }
    });
  }

  function performConfirmRental() {
    confirmBusinessRental({
      variables: { businessRentalId: businessBookingId },
    }).then((res) => {
      if (res.data.confirmBusinessRental.status == "success") {
        successAction();
      } else {
        NotificationManager.error(<FormattedMessage id=" Error " />);
      }
    });
  }

  function performCloseRent(reason, note) {
    closeBusinessRental({
      variables: {
        businessRentalId: +businessBookingId,
        closedReasons: reason,
        closedReason: note,
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
        rentalId: businessBookingId,
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
      variables: { rentalId: businessBookingId },
    })
      .then((res) => {
        successAction();
      })
      .catch((err) => NotificationManager.error(err?.message));
  }
  function applyCarRejected() {
    rejectedReasons({
      variables: {
        status: data?.businessRentalDetails.status == "pending" ? "pending" : "confirmed",
        userType: "ally",
      },
    });
    if (rejectedreasons) {
      setRejectModal(true);
    }
  }
  function OpenReasones() {
    businessClosedReasons();
    if (businessClosedReasonsData) {
      setOpenModel(true);
    }
  }

  useEffect(() => {
    setValue(data?.businessRentalDetails.status);
  }, [data]);

  const onChangeStatus = (value) => {
    setValue(value);
    value === "confirmed"
      ? performConfirmRental()
      : value == "rejected"
      ? applyCarRejected()
      : value === "car_received"
      ? applyCarRevieved()
      : value === "invoiced"
      ? image.length > 0
        ? ImageUpladThenCarRecived()
        : performAllyRecieveCar()
      : OpenReasones();
  };

  const InputHandelChange = (e) => {
    const value = parseFloat(e.target.value);
    setGrangTotal(value);
  };

  const Check = () => (
    <>
      <i class="fa fa-check-circle" aria-hidden="true"></i>{" "}
    </>
  );

  return (
    <>
      {loadingImgUpload ? (
        <div className="d-flex justify-content-center align-items-center">
          <CircularProgress />
        </div>
      ) : null}
      <ReasonsModal
        openmodel={openmodel}
        setOpenModel={setOpenModel}
        reasons={businessClosedReasonsData}
        setValue={setValue}
        orignalval={data?.businessRentalDetails.status}
        performCloseRent={performCloseRent}
      />
      <RejectModal
        openmodel={rejectmodal}
        setOpenModel={setRejectModal}
        reasons={rejectedreasons}
        setValue={setValue}
        orignalval={data?.businessRentalDetails.status}
        rejectRent={rejectRent}
      />
      {value && (
        <div className="row ">
          <div className="col-sm-12 col-md-12 d-flex justify-content-end">
            {/* <button
              className="btn btn-info mr-1 ml-1 btn-md"
              value="pending"
              disabled
              onClick={(e) => onChangeStatus(e.target.value)}
            >
              {value === "pending" && <Check />}
              <FormattedMessage id="PENDING" />
            </button> */}
            <button
              className="btn btn-success mr-1 ml-1 btn-md"
              value="confirmed"
              disabled={data?.businessRentalDetails.status === "confirmed"}
              onClick={(e) => onChangeStatus(e.target.value)}
            >
              {value === "confirmed" && <Check />}
              <FormattedMessage id="CONFIRMED" />
            </button>
            <button
              className="btn btn-secondary mr-1 ml-1 btn-md"
              value="car_received"
              disabled={value === "car_received"}
              onClick={(e) => onChangeStatus(e.target.value)}
            >
              {value === "car_received" && <Check />}
              <FormattedMessage id="CAR_RECEIVED" />
            </button>
            <button
              className="btn btn-primary mr-1 ml-1 btn-md"
              value="invoiced"
              disabled={data?.businessRentalDetails.status === "invoiced"}
              onClick={(e) => onChangeStatus(e.target.value)}
            >
              {value === "invoiced" && <Check />}
              <FormattedMessage id="INVOICED" />
            </button>
            {value === "cancelled" && (
              <button
                disabled
                className="btn btn-danger mr-1 ml-1 btn-md"
                value="cancelled"
                // onClick={(e) => onChangeStatus(e.target.value)}
                // disabled
              >
                {value === "cancelled" && <Check />}
                <FormattedMessage id="CANCELLED" />
              </button>
            )}
            {/* {ally_id && (
              <button
                className="btn btn-warning mr-1 ml-1 btn-md"
                value="rejected"
                // disabled={value !== "pending"}
                onClick={(e) => onChangeStatus(e.target.value)}
              >
                {value === "rejected" && <Check />}
                <FormattedMessage id="REJECTED" />
              </button>
            )} */}
            {!ally_id && (
              <button
                className="btn btn-danger mr-1 ml-1 btn-md"
                value="closed"
                onClick={(e) => onChangeStatus(e.target.value)}
                disabled={data?.businessRentalDetails.status == "closed"}
              >
                {value === "closed" && <Check />}
                <FormattedMessage id="CLOSED" />
              </button>
            )}
          </div>
          {value === "invoiced" && (
            <div className="row m-2 p-2">
              <div className="col-lg-auto p-1">
                <CustomTextField
                  name="grandTotal"
                  placeholder={grandTotal}
                  onChange={(e) => InputHandelChange(e)}
                />
              </div>
              {grandTotal ? (
                <div className="col-lg-auto" style={{ width: "200px" }}>
                  <FileUploader titleId="InvoiceImage" image={image} setImage={setImage} />
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ChangeStatus;
