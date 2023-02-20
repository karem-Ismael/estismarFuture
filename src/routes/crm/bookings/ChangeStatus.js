import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocation, useHistory } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery, useMutation } from "@apollo/client";
import { GetStatus } from "gql/queries/GetStatus.gql";
import { AcceptRent } from "gql/mutations/AcceptRental.gql";
import { CarRecieved } from "gql/mutations/RecievedCar.gql";
import { ImageUpload } from "gql/mutations/UploadImage.gql";
import { FileUploader } from "components/ImageUploader";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { AllyReceiveCar } from "gql/mutations/ChangeToInvoice.gql";
import { NotificationManager } from "react-notifications";
import { CloseRental } from "gql/mutations/CloseRental.gql";
import moment from "moment";
import { Helmet } from "react-helmet";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import IntlMessages from "util/IntlMessages";
import DotsLoader from "components/shared/DotsLoader";
const maxSize = 1024 * 2;

/**
 *
 * @deprecated
 */
export default function ChangeStatus() {
  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const [value, setValue] = React.useState(null);
  const { bookingId } = useParams();
  const [acceptRental] = useMutation(AcceptRent);
  const [carReceived] = useMutation(CarRecieved);
  const [imageUpload] = useMutation(ImageUpload);
  const [allyReceiveCar] = useMutation(AllyReceiveCar);
  const [image, setImage] = useState("");

  const [grandTotal, setGrangTotal] = useState(0);
  const [renderData, setRenderData] = useState(false);
  const [closeRental] = useMutation(CloseRental);
  const { data, refetch } = useQuery(GetStatus, {
    variables: { id: bookingId },
  });
  useEffect(() => {
    setValue(data?.rentalDetails.status);
  }, [data, renderData, refetch, val]);
  const [val, setval] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const onChangeStatus = () => {
    value == "confirmed"
      ? acceptRental({
          variables: { rentalId: bookingId },
        }).then((res) => {
          if (res.data.acceptRental.status == "success") {
            {
              NotificationManager.success(<FormattedMessage id="StatusSucessfully" />);
              refetch();
            }
          } else {
            NotificationManager.error(<FormattedMessage id=" Error " />);
          }
        })
      : value == "car_received"
      ? moment(data?.rentalDetails.pickUpDate).diff(new Date(), "days") >= 0
        ? carReceived({
            variables: { rentalId: bookingId },
          }).then((res) => {
            if (res.data.carReceived.status == "success") {
              NotificationManager.success(<FormattedMessage id="StatusSucessfully" />);
              refetch();
            } else {
              NotificationManager.error(<FormattedMessage id="error" />);
            }
          })
        : (NotificationManager.error(<FormattedMessage id="pickupdatehaspassed" />),
          setValue("confirmed"))
      : value == "invoiced"
      ? image.length > 0
        ? imageUpload({
            variables: { image, topic: "InvoiceImage" },
          }).then((res) => {
            res.data.imageUpload.status == "success"
              ? allyReceiveCar({
                  variables: {
                    invoicePic: res.data.imageUpload.imageUpload.imageUrl,
                    newGrandTotal: grandTotal,
                    rentalId: bookingId,
                  },
                }).then((res) => {
                  if (res.data.allyReceiveCar.status == "success") {
                    NotificationManager.success(<FormattedMessage id="StatusSucessfully" />);
                    refetch();
                  } else {
                    NotificationManager.error(<FormattedMessage id="Error" />);
                  }
                })
              : null;
          })
        : allyReceiveCar({
            variables: {
              rentalId: bookingId,
            },
          }).then((res) => {
            if (res.data.allyReceiveCar.status == "success") {
              NotificationManager.success(<FormattedMessage id="StatusSucessfully" />);
              refetch();
            } else {
              NotificationManager.error(<FormattedMessage id="Error" />);
            }
          })
      : closeRental({
          variables: {
            rentalId: bookingId,
          },
        }).then((res) => {
          if (res.data.closeRental.status == "success") {
            NotificationManager.success(<FormattedMessage id="StatusSucessfully" />);
            refetch();
          } else {
            Notification.error(<FormattedMessage id="Erorr" />);
            refetch();
          }
        });
  };

  const InputHandelChange = (e) => {
    const value = parseFloat(e.target.value);
    setGrangTotal(value);
  };

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: "ChangeStatus" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="ChangeStatus" />}
        enableBreadCrumb
        match={location}
        lastElement={data?.rentalDetails?.bookingNo || <DotsLoader />}
      />
      {/* <input type="file" onChange={(e) => FileUpload(e)} /> */}
      {value && (
        <div className="row ">
          <div className="col-sm-12 col-md-12">
            <FormControl component="fieldset">
              <FormLabel component="legend">Stauts</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={value}
                onChange={handleChange}
                row
              >
                <FormControlLabel
                  value="pending"
                  disabled={
                    value != "pending" && data?.rentalDetails.status != "pending" ? true : false
                  }
                  control={<Radio />}
                  label={<FormattedMessage id="PENDING" />}
                />
                <FormControlLabel
                  value="confirmed"
                  disabled={
                    value != "pending" &&
                    value != "confirmed" &&
                    data?.rentalDetails.status != "pending" &&
                    data?.rentalDetails.status != "confirmed"
                      ? true
                      : false
                  }
                  control={<Radio />}
                  label={<FormattedMessage id="CONFIRMED" />}
                />
                <FormControlLabel
                  value="car_received"
                  disabled={
                    // value != "confirmed" &&
                    value != "car_received" &&
                    data?.rentalDetails.status != "confirmed" &&
                    data?.rentalDetails.status != "car_received"
                      ? true
                      : false
                  }
                  control={<Radio />}
                  label={<FormattedMessage id="CAR_RECEIVED" />}
                />
                <FormControlLabel
                  value="invoiced"
                  disabled={
                    data?.rentalDetails.status != "car_received" &&
                    data?.rentalDetails.status != "invoiced"
                      ? true
                      : false
                  }
                  control={<Radio />}
                  label={<FormattedMessage id="INVOICED" />}
                />
                <FormControlLabel
                  value="cancelled"
                  control={<Radio />}
                  label={<FormattedMessage id="CANCELLED" />}
                  disabled
                />
                <FormControlLabel
                  value="closed"
                  control={<Radio />}
                  label={<FormattedMessage id="CLOSED" />}
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-md-4 col-sm-12 align-items-center">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12">
                <button
                  type="button"
                  className="btn btn-primary text-white "
                  onClick={() => onChangeStatus()}
                >
                  <FormattedMessage id="ChangeStatus" />
                </button>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <button
                  type="button"
                  className="btn btn-danger text-white "
                  onClick={() => {
                    if (history.length > 1) {
                      history.goBack();
                    } else {
                      history.push("/cw/dashboard/bookings");
                    }
                  }}
                >
                  <FormattedMessage id="goBack" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {value == "invoiced" && data.rentalDetails.status !== "invoiced" && (
        <>
          <FileUploader titleId="InvoiceImage" image={image} setImage={setImage} />
          <TextField
            label="Grand Total"
            variant="outlined"
            onChange={(e) => InputHandelChange(e)}
          />
        </>
      )}
    </>
  );
}
