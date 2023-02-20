/* eslint-disable no-nested-ternary */
import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { rentalMonths } from "constants/constants";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField, Checkbox, FormControlLabel } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { BulkUpdateCars } from "gql/mutations/BulkUpdateCars.gql";
import NotificationManager from "react-notifications/lib/NotificationManager";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const Form = styled.form`
  input {
    height: 45px;
    border-radius: 5px;
    border: solid 1px grey;
    padding: 0 10px;
    font-size: 12px;
  }
  .input-insurance {
    input {
      border: none !important;
    }
  }
`;
const ModalExample = (props) => {
  // const classes = useStyles();
  const history = useHistory();
  const [monthsprice, SetMonthsPrice] = React.useState({});
  const [distancepermonth, setDistanceperMonth] = useState();
  const [distanceperday, setDistanceperDay] = useState();
  const [distanceperweek, setDistanceperWeek] = useState();
  const [additionaldistancecost, setAdditionalDistanceCost] = useState();
  const [isUnlimitedFree, setIsUnlimitedFree] = useState(false);
  const [unlimitedFeePerDay, setUnlimitedFeePerDay] = useState("");
  const { formatMessage } = useIntl();
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [bulkUpdateCars] = useMutation(BulkUpdateCars);
  const [rentperday, setRentPerDay] = useState();
  const [, setrentperweek] = useState();
  const [, setRentPerMonth] = useState();
  const [fullChecked, setFullChecked] = useState(false);
  const [standardChecked, setStandardChecked] = useState(false);

  const [weeklyprice, setWeeklyprice] = useState();
  const [monthlyprice, setMonthlyprice] = useState();
  const [referenceCode, setReferenceCode] = useState();

  const [insuranceValues, setInsuranceValues] = useState([
    { insuranceId: "1", value: undefined },
    { insuranceId: "2", value: undefined, monthlyValue: undefined },
  ]);
  const [insuranceValidation, setInsuranceValidation] = useState({
    standard: null,
    daily: null,
    monthly: null,
  });
  const [errors, setErrors] = React.useState();
  // const [modalStyle] = React.useState(getModalStyle);

  const { className, open, setOpen, ids, refetch, setCarIds, setAllChecked } = props;
  const handelMonthsprice = (value, month) => {
    const cmonths = { ...monthsprice };

    if (month == 2) {
      cmonths.twoMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 3) {
      cmonths.threeMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 4) {
      cmonths.fourMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 5) {
      cmonths.fiveMonths = +value;

      SetMonthsPrice(cmonths);
    } else if (month == 6) {
      cmonths.sixMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 7) {
      cmonths.sevenMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 8) {
      cmonths.eightMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 9) {
      cmonths.nineMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 10) {
      cmonths.tenMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 11) {
      cmonths.elevenMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 12) {
      cmonths.twelveMonths = +value;
      SetMonthsPrice(cmonths);
    } else {
      cmonths.twentyFourMonths = +value;
      SetMonthsPrice(cmonths);
    }
  };
  const standardInsurancePayload = insuranceValues.filter((i) => i.insuranceId !== "2");
  const fullInsurancePayload = insuranceValues.filter((i) => i.insuranceId !== "1");
  const handelSaveCar = (e) => {
    if (!ids.length) {
      NotificationManager.error(<FormattedMessage id="you.must.select.car" />);
      return;
    }
    bulkUpdateCars({
      variables: {
        carIds: ids,
        additionalDistanceCost: additionaldistancecost || undefined,
        carInsuranceAttributes:
          standardChecked && fullChecked
            ? insuranceValues
            : !standardChecked && fullChecked
            ? fullInsurancePayload
            : !fullChecked && standardChecked
            ? standardInsurancePayload
            : undefined,
        dailyPrice: rentperday,
        distanceByDay: distanceperday,
        distanceByMonth: distanceperday * 30,
        distanceByWeek: distanceperday * 7,
        monthlyPrice: monthlyprice,
        weeklyPrice: weeklyprice,
        isUnlimited,
        isUnlimitedFree,
        unlimitedFeePerDay: Number(unlimitedFeePerDay),
        monthsPrice: Object.keys(monthsprice).length ? monthsprice : undefined,
        referenceCode: referenceCode?.length ? referenceCode : undefined,
      },
    })
      .then(() => {
        setOpen(false);
        setAllChecked(false);
        setCarIds([]);
        refetch().then(() =>
          NotificationManager.success(<FormattedMessage id="carsupdatedsuccessfully" />),
        );
      })
      .catch((err) => NotificationManager.error(<FormattedMessage id={err?.message} />));
    history.push("/cw/dashboard/cars");
    e.preventDefault();
  };
  const TextFieldGenerator = (insuranceId, insuraceType) =>
    ((standardChecked && insuranceId == "1") || (fullChecked && insuranceId == "2")) && (
      <>
        {((standardChecked && insuranceId == "1") || (fullChecked && insuranceId == "2")) && (
          <TextField
            error={Boolean(errors?.insurance)}
            helperText={errors?.insurance ? <FormattedMessage id="thisfieldisrequired" /> : null}
            type="number"
            variant="outlined"
            className="input-insurance"
            InputProps={{ inputProps: { maxLength: 5, step: "0.01" } }}
            label={
              insuraceType === "standard" ? (
                <FormattedMessage id="insurancevalue" />
              ) : insuraceType === "daily" ? (
                <FormattedMessage id="Daily insurance value" />
              ) : (
                <FormattedMessage id="Monthly insurance value" />
              )
            }
            onChange={(e) => {
              if (Number(e.target.value) > 999999.99) {
                setInsuranceValidation({
                  ...insuranceValidation,
                  [insuraceType]: formatMessage({ id: "maxout.99" }),
                });
              } else if (e.target.value && Number(e.target.value) < 999999.99) {
                setInsuranceValidation({ ...insuranceValidation, [insuraceType]: null });
              } else {
                setInsuranceValidation({ ...insuranceValidation, [insuraceType]: true });
              }

              const standard = insuranceValues.find((i) => i.insuranceId === "1");
              const full = insuranceValues.find((i) => i.insuranceId === "2");
              if (insuraceType === "standard") {
                standard.value = e.target.value ? +e.target.value : e.target.value;
                setErrors({ ...errors, insurance: null });
              } else if (insuraceType === "daily") {
                if (e.target.value) {
                  full.value = +e.target.value;
                  setErrors({ ...errors, insurance: null });
                } else {
                  delete full.value;
                }
              } else {
                if (e.target.value) {
                  full.monthlyValue = e.target.value ? +e.target.value : e.target.value;
                } else {
                  delete full.monthlyValue;
                }
                setErrors({ ...errors, insurance: null });
              }
              setInsuranceValues([standard, full]);
            }}
          />
        )}
      </>
    );
  const body = (
    <div style={{ overflowY: "scroll", height: "500px", overflowX: "hidden" }}>
      <fieldset style={{ border: "1px solid ", padding: "3px" }}>
        <legend style={{ width: "120px" }}>
          <FormattedMessage id="car" />
        </legend>
        <div className="row ">
          <div className="col-md-3">
            <input
              placeholder={formatMessage({ id: "referenceCode" })}
              onChange={(e) => {
                setReferenceCode(e.target.value);
              }}
              maxLength={10}
            />
          </div>
        </div>
      </fieldset>
      <fieldset style={{ border: "1px solid ", padding: "10px" }}>
        <legend style={{ width: "120px" }}>
          <FormattedMessage id="rental.price" />
        </legend>
        <div className="row ">
          <div className="col-md-3">
            <input
              type="number"
              min={0.1}
              max={99999}
              step="0.01"
              placeholder={formatMessage({ id: "RentperDay" })}
              onChange={(e) => {
                setRentPerDay(+e.target.value);
                setrentperweek(e.target.value * 7);
                setRentPerMonth(e.target.value * 30);
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(formatMessage({ id: "Please enter a valid value" }))
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              min={0.1}
              max={99999}
              step="0.01"
              placeholder={formatMessage({ id: "weeklyprice" })}
              onChange={(e) => {
                setWeeklyprice(+e.target.value);
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(formatMessage({ id: "Please enter a valid value" }))
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              min={0.1}
              max={99999}
              step="0.01"
              placeholder={formatMessage({ id: "monthlyprice" })}
              onChange={(e) => {
                setMonthlyprice(+e.target.value);
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(formatMessage({ id: "Please enter a valid value" }))
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </div>
        </div>
        <div className="row">
          {rentalMonths.map((month) => (
            <div className="col-md-3 mt-2">
              <input
                type="number"
                max={99999}
                step="0.01"
                placeholder={formatMessage({ id: month.label })}
                onChange={(e) => handelMonthsprice(e.target.value, month.value)}
                onInvalid={(e) =>
                  e.target.setCustomValidity(formatMessage({ id: "Max. is 99999" }))
                }
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset style={{ border: "1px solid ", padding: "5px" }}>
        <legend style={{ width: "80px" }}>
          <FormattedMessage id="kilometers" />
        </legend>

        <div className="row ">
          <div className="col-md-3">
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label={formatMessage({ id: "isUnlimited" })}
              checked={isUnlimited}
              onChange={(e) => {
                setIsUnlimited(e.target.checked);
              }}
            />
          </div>
          <div className="col-md-3">
            {isUnlimited && (
              <FormControlLabel
                control={<Checkbox name="checkedB" color="primary" />}
                checked={isUnlimitedFree}
                label={formatMessage({ id: "isUnlimitedFree" })}
                onChange={(e) => {
                  if (e.target.checked) {
                    setUnlimitedFeePerDay("0");
                  }
                  setIsUnlimitedFree(e.target.checked);
                }}
              />
            )}
          </div>
          {isUnlimited && !isUnlimitedFree && (
            <div className="col-md-3" style={{ padding: 0 }}>
              <input
                type="number"
                max={99999}
                step="0.01"
                value={unlimitedFeePerDay}
                placeholder={formatMessage({ id: "unlimitedFeePerDay" })}
                onChange={(e) => {
                  const fee = e.target.value;
                  if (/^[0-9]+(\.)?[0-9]*$/.test(fee.toString()) || fee === "") {
                    setUnlimitedFeePerDay(fee);
                  } else {
                    setUnlimitedFeePerDay(unlimitedFeePerDay);
                  }
                }}
                onInvalid={(e) =>
                  e.target.setCustomValidity(formatMessage({ id: "Max. is 99999" }))
                }
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
          )}
          {!isUnlimitedFree && (
            <div className="col-md-4">
              <input
                type="number"
                max={99999}
                step="0.01"
                placeholder={formatMessage({ id: "AdditionalDistanceCost" })}
                onChange={(e) => setAdditionalDistanceCost(parseFloat(e.target.value))}
                onInvalid={(e) =>
                  e.target.setCustomValidity(formatMessage({ id: "Max. is 99999" }))
                }
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
          )}
        </div>
        <div className="row mt-3">
          {!isUnlimitedFree && (
            <>
              <div className="col-md-3">
                <input
                  type="number"
                  max={999999}
                  step="0.01"
                  placeholder={formatMessage({ id: "Distanceperday" })}
                  onChange={(e) => {
                    setDistanceperDay(+e.target.value);
                    setDistanceperMonth(+e.target.value * 30);
                    setDistanceperWeek(+e.target.value * 7);
                  }}
                  onInvalid={(e) =>
                    e.target.setCustomValidity(formatMessage({ id: "Max. is 999999" }))
                  }
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  value={distanceperweek}
                  placeholder={formatMessage({ id: "Disnatceperweek" })}
                  disabled
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  value={distancepermonth}
                  placeholder={formatMessage({ id: "DistanceperMonth" })}
                  disabled
                />
              </div>
            </>
          )}
        </div>
      </fieldset>
      <fieldset style={{ border: "1px solid ", padding: "10px" }}>
        <legend style={{ width: "120px" }}>
          <FormattedMessage id="insurance" />
        </legend>
        <div className="row mt-3 mb-3 grid-insurance-cars">
          {[
            { id: "1", name: "standard", localizedName: formatMessage({ id: "Standard" }) },
            {
              id: "2",
              name: "daily",
              localizedName: formatMessage({ id: "Daily insurance value" }),
            },
            { id: "2", name: "monthly", localizedName: "Monthly insurance value" },
          ].map((item, index) => (
            <div className="col-md-12 col-lg-4" key={JSON.stringify(index)}>
              <div className="row" style={{ gap: "10px" }}>
                <div className={`${item.name === "monthly" ? "d-none" : false} col-md-4`}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checkedB"
                        color="primary"
                        onChange={(e) => {
                          if (item.id === "1") {
                            setStandardChecked(e.target.checked);
                          } else {
                            setFullChecked(e.target.checked);
                            setInsuranceValidation({
                              ...insuranceValidation,
                              daily: e.target.checked,
                              monthly: e.target.checked,
                            });
                          }
                        }}
                      />
                    }
                    label={
                      item.id == 1
                        ? formatMessage({ id: "Standard" })
                        : formatMessage({ id: "Full" })
                    }
                  />
                </div>
                <div className="col-md-7" style={{ padding: 0 }}>
                  {TextFieldGenerator(item.id, item.name)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div style={{ minWidth: "1200px" }}>
      <Modal isOpen={open} toggle={toggle} className={className} style={{ minWidth: "1200px" }}>
        {/* <ModalHeader toggle={toggle}>Modal title</ModalHeader> */}
        <Form onSubmit={(e) => handelSaveCar(e)}>
          <ModalBody>{body}</ModalBody>
          <ModalFooter>
            <Button type="submit" className="btn btn-primary text-center text-white">
              <FormattedMessage id="save" />
            </Button>{" "}
            <Button
              onClick={() => setOpen(false)}
              type="button"
              className="btn btn-danger text-white text-center"
            >
              {" "}
              <FormattedMessage id="cancel" />
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default ModalExample;
