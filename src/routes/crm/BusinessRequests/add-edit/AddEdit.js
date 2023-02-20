/* eslint-disable prettier/prettier */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable import/order */
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { NotificationManager } from "react-notifications";
import "react-tabs/style/react-tabs.css";
import { CircularProgressWithLabel } from "components/CircularProgressWithLabel";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { CreateBusinessRental, UpdateBusinessRental } from "gql/mutations/BusinessRentals.gql";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Makes } from "gql/queries/GetAllMake.gql";
import { AllAreas } from "gql/queries/Areas.queries.gql";
import { Insurances } from "gql/queries/GetInsurances.gql";
import { ModelsOfMake } from "gql/queries/GetModelsOfMake.gql";
import { GetcarsVersions } from "gql/queries/Cars.queries.gql";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/ar";
import "moment/locale/en-au";
import Select, { createFilter } from "react-select";
import { CircularProgress } from "@material-ui/core";
import { GetCustomerDetailsQuery } from "gql/queries/Users.queries.gql";
import { Add, CalendarToday, Remove } from "@material-ui/icons";
import { BusinessRequestDetails } from "gql/queries/BusinessRequestDetails.gql";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import GettingCustomerDetails from "../GettingCustomerDetails";
import { CustomerDataDisplay } from "components/CustomerDataDisplay";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-column-gap: 25px;
  margin-top: 50px;
  .customerDetails {
    form {
      > div {
        margin: 20px 0 0 0 !important;
        padding: 0 !important;
        > div {
          justify-content: unset !important;
        }
      }
    }
  }
`;
const Form = styled.form`
  > div {
    margin-top: 30px !important;
    text-align: ${(props) => (props.language === "ar" ? "right" : "left")};
    & > div {
      padding: 7px 15px;
      width: 100%;
      &,
      &:hover {
        border: solid 1px var(--color-7);
      }
    }
  }
  > div:first-child {
    margin: 0 !important;
  }
  h4 {
    margin-top: 30px !important;
    font-size: 20px;
  }
  > input {
    margin-bottom: 28px !important;
    padding: 13px 25px;
    width: 100%;
    border-radius: var(--radius-1);
    border: solid 1px var(--color-7);
  }
  .required {
    label {
      position: relative;
      &:after {
        content: "*";
        color: red;
        position: absolute;
        top: 0;
        right: ${(props) => (props.language === "en" ? "-6px" : null)};
        left: ${(props) => (props.language === "ar" ? "-6px" : null)};
      }
    }
    &.select {
      > div {
        padding-right: 0 !important;
        padding-left: 0 !important;
      }
      > div:first-child {
        &:before {
          display: none !important;
        }
      }
      div:first-child {
        /* width: fit-content; */
        transform: translateX(-1px);
        position: relative;
        &:before {
          content: "*";
          color: red;
          position: absolute;
          top: 0;
          right: ${(props) => (props.language === "en" ? "-10px" : null)};
          left: ${(props) => (props.language === "ar" ? "-10px" : null)};
        }
      }
      div:only-child {
        width: auto !important;
        &:before {
          display: none;
        }
      }
    }
    [aria-hidden="true"],
    [aria-disabled="false"] {
      width: auto !important;
      &:after,
      &:before {
        display: none;
      }
    }
  }
`;
const PeriodWrapper = styled.div`
  background: white;
  svg {
    cursor: pointer;
  }
  label {
    margin: 0 !important;
  }
  > div {
    /* padding: 7px 20px !important; */
    border-radius: var(--radius-1);
    color: var(--color-8);
  }
  input {
    background: none;
    border: none;
    text-align: center !important;
    font-size: 24px;
    font-weight: bold;
    color: var(--color-1);
    transform: translate(-7px, -2px);
    color: var(--color-8);
  }
`;

const CalendarWrapper = styled.div`
  background: white;
  label {
    margin: 0 !important;
  }
  > div {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  div {
    border-radius: var(--radius-1);
    &:after,
    &:before {
      border: none;
    }
    input {
      color: var(--color-8);
      padding: 10px 10px !important;
    }
    .MuiInput-input {
      padding-right: 5px;
      padding-left: 5px;
    }
  }
  .MuiInput-underline {
    &:before {
      border: none !important;
    }
  }
  .MuiTextField-root {
    position: relative;
    &:after {
      content: "*";
      color: red;
      position: absolute;
      top: 6px;
      right: ${(props) => (props.language === "ar" ? "143px" : null)};
      left: ${(props) => (props.language === "en" ? "143px" : null)};
    }
  }
  &.hasValue {
    .MuiTextField-root {
      &:after {
        display: none;
      }
    }
  }
  img {
    transform: ${(props) => (props.language === "ar" ? "translateX(10px)" : "translateX(-10px)")};
  }
`;
const CarNumbersWrapper = styled.div`
  position: relative;
  span {
    position: absolute;
    top: 12px;
    right: ${(props) => (props.language === "ar" ? "15px" : null)};
    left: ${(props) => (props.language === "en" ? "15px" : null)};
  }
  input {
    padding: 13px 10px;
    width: 100%;
    border-radius: var(--radius-1);
    border: solid 1px var(--color-7);
  }
  &.number-cars {
    position: relative;
    &:after {
      content: "*";
      color: red;
      position: absolute;
      top: 10px;
      right: ${(props) => (props.language === "ar" ? "45px" : null)};
      left: ${(props) => (props.language === "en" ? "100px" : null)};
    }
    &.hasValue {
      &:after {
        display: none;
      }
    }
  }
`;
const InsuranceTypeWrapper = styled.div`
  grid-column: 1/4;
  > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-columns-gap: 30px;
  }
  div > div {
    font-size: 20px;
    border: none !important;
    text-align: center;
    margin-top: 0 !important;
    background-color: var(--color-6);
    color: var(--color-8);
    border-radius: 10px;
    padding: 18px 0 !important;
    cursor: pointer;
    &.active {
      color: #464d69;
      background: #fff;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: calc(50% - 15px);
        width: 30px;
        height: 5px;
        background: #464d69;
        border-radius: 10px 10px 0 0;
      }
    }
  }
`;
const AdditionalNotesWrapper = styled.div`
  margin-top: 25px !important;
  textarea {
    width: 100%;
    height: 150px;
    resize: none;
    border-radius: var(--radius-3);
    border-color: var(--color-7);
    padding: 15px;
  }
`;

const OtherMakeWrapper = styled.div`
  input {
    padding: 13px 10px;
    width: 100%;
    border-radius: var(--radius-1);
    border: solid 1px var(--color-7);
  }
  &.required {
    position: relative;
    &:after {
      content: "*";
      color: red;
      position: absolute;
      top: 10px;
      right: ${(props) => (props.language === "ar" ? "180px" : null)};
      left: ${(props) => (props.language === "en" ? "130px" : null)};
    }
    &.hasValue {
      &:after {
        display: none;
      }
    }
  }
`;

const Validation = styled.span`
  position: absolute;
  display: inline-block;
  color: red;
  padding: 0 10px;
  width: 100%;
  margin-top: 1px;
`;

function CreateEditRequest() {
  // const { ally_id } = JSON.parse(localStorage.getItem("user_data"));
  const { requestId } = useParams();
  const history = useHistory();
  const { formatMessage, locale } = useIntl();
  const [progress, setProgress] = useState(0);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [periodMonths, setPeriodMonths] = useState(1);
  const [insuranceType, setInsuranceType] = useState(1);
  const [BookingData, setBookingData] = useState({});
  const [showOtherMake, setShowOtherMake] = useState(false);
  const [showPeriodMonthsErr, setShowPeriodMonthsErr] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    getValues,
  } = useForm();

  const [createBusinessRental, { loading: creatingRequests, error: CreateError }] = useMutation(
    CreateBusinessRental,
  );

  const [updateBusinessRental, { loading: updatingRequests, error: UpdateError }] = useMutation(
    UpdateBusinessRental,
  );

  const { data: businessRequestRes, refetch } = useQuery(BusinessRequestDetails, {
    skip: !requestId,
    variables: { id: +requestId },
  });

  // Customer Data Request by id for edit mode
  const { data: customerDetailsRes, loading: loadingCustomerDetails } = useQuery(
    GetCustomerDetailsQuery,
    {
      skip: !businessRequestRes?.businessRequestDetails,
      variables: { id: businessRequestRes?.businessRequestDetails?.userId },
    },
  );

  useEffect(() => {
    if (CreateError?.message) NotificationManager.error(CreateError?.message);
  }, [CreateError]);

  useEffect(() => {
    if (UpdateError?.message) NotificationManager.error(UpdateError?.message);
  }, [UpdateError]);

  const { data: makes_res, loading: loadingMakes } = useQuery(Makes, {
    variables: { limit: 1000 },
  });
  const { data: areas_res, loading: loadingAreas } = useQuery(AllAreas, {
    variables: { limit: 1000 },
  });
  const { data: Insurances_res, loading: loadingInsurances } = useQuery(Insurances);

  const [fetchModelsofMake, { data: modelsRes, loading: loadingModels }] = useLazyQuery(
    ModelsOfMake,
    {
      variables: { limit: 1000 },
    },
  );

  useEffect(() => {
    if (businessRequestRes?.businessRequestDetails?.makeId) {
      fetchModelsofMake({
        variables: {
          id: +businessRequestRes?.businessRequestDetails?.makeId,
        },
      });
    }
  }, [businessRequestRes?.businessRequestDetails?.makeId]);

  const [fetchVersions, { data: versionsRes, loading: loadingVersions }] = useLazyQuery(
    GetcarsVersions,
    {
      variables: { limit: 1000, orderBy: "year", sortBy: "desc" },
    },
  );

  useEffect(() => {
    // Edit mode input values
    if (businessRequestRes?.businessRequestDetails) {
      setValue("makeId", businessRequestRes?.businessRequestDetails.makeId);
      setValue("carModelId", businessRequestRes?.businessRequestDetails.carModelId);
      setValue("carVersionId", businessRequestRes?.businessRequestDetails.carVersionId);
      setValue("insuranceId", businessRequestRes?.businessRequestDetails.insuranceId);
      setValue("numberOfCars", businessRequestRes?.businessRequestDetails.numberOfCars);
      setValue("numberOfMonths", businessRequestRes?.businessRequestDetails.numberOfMonths);
      setValue("otherCarName", businessRequestRes?.businessRequestDetails.otherCarName);
      setValue("pickUpCityId", businessRequestRes?.businessRequestDetails.pickUpCityId);
      setValue("pickUpDatetime", businessRequestRes?.businessRequestDetails.pickUpDatetime);
      setValue("additionalNotes", businessRequestRes?.businessRequestDetails.additionalNotes);

      fetchVersions({
        variables: { carModelId: +businessRequestRes?.businessRequestDetails?.carModelId },
      });
      if (businessRequestRes?.businessRequestDetails?.otherCarName) {
        setShowOtherMake(true);
      }
      setPeriodMonths(Number(businessRequestRes?.businessRequestDetails?.numberOfMonths));
      setInsuranceType(businessRequestRes?.businessRequestDetails?.insuranceId);
    }
  }, [businessRequestRes?.businessRequestDetails]);

  const handleDateTimeChange = (e) => {
    setSelectedDateTime(e);
    setValue("pickUpDatetime", e);
    clearErrors("pickUpDatetime");
  };

  moment.locale(locale);

  useEffect(() => {
    setValue("numberOfMonths", periodMonths);
  }, [periodMonths]);

  useEffect(() => {
    moment.locale(locale === "ar" ? "ar" : "en-au");
  }, [locale]);

  const onSubmit = (data) => {
    if (data.numberOfMonths > 0 && data.numberOfMonths <= 60) {
      data.numberOfMonths = periodMonths;
      data.numberOfCars = Number(data.numberOfCars);
      const oldDateTime = data.pickUpDatetime;
      data.pickUpDatetime = `${moment(oldDateTime).locale("en").format("DD/MM/YYYY")} ${moment(
        oldDateTime,
      )
        .locale("en")
        .format("hh:mm A")}`;
      data.userId = +customerId;
      data.insuranceId = insuranceType;
      if (data.makeId == "999") {
        delete data.makeId;
      } else {
        data.makeId = +data.makeId;
        delete data.otherCarName;
      }
      data.carModelId = +data.carModelId;
      data.carVersionId = +data.carVersionId;
      data.pickUpCityId = +data.pickUpCityId;
      if (requestId && businessRequestRes)
        data.businessRentalId = businessRequestRes.businessRequestDetails.id;

      async function mutate() {
        const res = requestId
          ? await updateBusinessRental({ variables: data })
          : await createBusinessRental({ variables: data });
        if (res?.data?.createBusinessRental) {
          NotificationManager.success(<FormattedMessage id="requestCreated" />);
          history.push("/cw/dashboard/businessRequests");
        } else if (res?.data?.updateBusinessRental) {
          NotificationManager.success(<FormattedMessage id="requestUpdated" />);
          history.push("/cw/dashboard/businessRequests");
        }
      }

      mutate();
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {formatMessage({
            id: requestId ? "EditRequest" : "AddRequest",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={requestId ? "EditRequest" : "AddRequest"} />}
        match={location}
        lastElement={requestId || <IntlMessages id={requestId ? "EditRequest" : "AddRequest"} />}
        enableBreadCrumb
      />
      {!requestId && (
        <div className="mt-4 customerDetails">
          <h3>
            <FormattedMessage id="rental.enterphone" />
          </h3>
          <GettingCustomerDetails
            setCustomerDetails={setCustomerDetails}
            setCustomerId={setCustomerId}
          />
        </div>
      )}
      {!loadingAreas && (customerDetails || customerDetailsRes) ? (
        <Wrapper>
          <Form id="step2" language={locale} onSubmit={handleSubmit(onSubmit)}>
            {makes_res?.makes && (
              <Select
                {...register("makeId", { required: true })}
                placeholder={formatMessage({
                  id: "car.make",
                })}
                isSearchable
                // isClearable={() => null}
                className="select required"
                filterOption={createFilter({
                  matchFrom: "any",
                  stringify: (option) => `${option.label}`,
                })}
                value={
                  !loadingMakes
                    ? [
                        ...makes_res?.makes?.collection,
                        {
                          id: 999,
                          name: formatMessage({
                            id: "Other",
                          }),
                          enName: "other",
                          arName: "أخري",
                        },
                      ]
                        .filter((i) => +i.id === +getValues("makeId"))
                        ?.map((item) => ({
                          label: item.name,
                          value: item.id,
                          enName: item.enName,
                          arName: item.arName,
                        }))
                    : []
                }
                defaultValue={
                  !loadingMakes
                    ? [
                        ...makes_res?.makes?.collection,
                        {
                          id: 999,
                          name: formatMessage({
                            id: "Other",
                          }),
                          enName: "other",
                          arName: "أخري",
                        },
                      ]
                        .filter(
                          (i) => +i.id === +businessRequestRes?.businessRequestDetails?.makeId,
                        )
                        ?.map((item) => ({
                          label: item.name,
                          value: item.id,
                          enName: item.enName,
                          arName: item.arName,
                        }))
                    : []
                }
                options={
                  !loadingMakes
                    ? [
                        ...makes_res?.makes?.collection,
                        {
                          id: 999,
                          name: formatMessage({
                            id: "Other",
                          }),
                          enName: "other",
                          arName: "أخري",
                        },
                      ].map((item) => ({
                        label: item.name,
                        value: item.id,
                        enName: item.enName,
                        arName: item.arName,
                      }))
                    : []
                }
                isLoading={loadingMakes}
                onChange={(e) => {
                  if (e?.enName === "other") {
                    setShowOtherMake(true);
                  } else {
                    setShowOtherMake(false);
                  }
                  if (e?.value) {
                    fetchModelsofMake({ variables: { id: e.value } });
                    setValue("makeId", e.value);
                    clearErrors("makeId");
                  } else {
                    setValue("makeId", null);
                  }
                }}
              />
            )}
            {!showOtherMake ? (
              <>
                {errors.makeId && (
                  <Validation className="text-align-localized">
                    {formatMessage({
                      id: "validation.thisFieldIsRequired",
                    })}
                  </Validation>
                )}
                {modelsRes ? (
                  <Select
                    {...register("carModelId", { required: true })}
                    placeholder={formatMessage({
                      id: "Model",
                    })}
                    isSearchable
                    // isClearable
                    className="select required"
                    isLoading={loadingModels}
                    filterOption={createFilter({
                      matchFrom: "any",
                      stringify: (option) => `${option.label}`,
                    })}
                    options={
                      !loadingModels
                        ? modelsRes.make.carModels.map((item) => ({
                            label: item.name,
                            value: item.id,
                            enName: item.enName,
                            arName: item.arName,
                          }))
                        : []
                    }
                    value={
                      !loadingModels
                        ? modelsRes.make.carModels
                            .filter((i) => +i.id === +getValues("carModelId"))
                            ?.map((item) => ({
                              label: item.name,
                              value: item.id,
                              enName: item.enName,
                              arName: item.arName,
                            }))
                        : []
                    }
                    defaultValue={
                      !loadingModels
                        ? modelsRes.make.carModels
                            .filter(
                              (i) =>
                                +i.id === +businessRequestRes?.businessRequestDetails?.carModelId,
                            )
                            ?.map((item) => ({
                              label: item.name,
                              value: item.id,
                              enName: item.enName,
                              arName: item.arName,
                            }))
                        : []
                    }
                    onChange={(e) => {
                      if (e?.value) {
                        setBookingData({
                          ...BookingData,
                          carModelId: { enName: e.enName, arName: e.arName },
                        });
                        fetchVersions({
                          variables: { carModelId: Number(e.value) },
                        });
                        setValue("carModelId", e.value);
                        clearErrors("carModelId");
                      } else {
                        setValue("carModelId", null);
                      }
                    }}
                  />
                ) : null}
                {errors.carModelId && (
                  <Validation className="text-align-localized">
                    {formatMessage({ id: "validation.thisFieldIsRequired" })}
                  </Validation>
                )}
                {versionsRes ? (
                  <Select
                    {...register("carVersionId", { required: true })}
                    placeholder={formatMessage({ id: "car.year" })}
                    isSearchable
                    // isClearable
                    className="select required"
                    isLoading={loadingVersions}
                    filterOption={createFilter({
                      matchFrom: "any",
                      stringify: (option) => `${option.label}`,
                    })}
                    value={
                      !loadingVersions
                        ? versionsRes.carVersions.collection
                            .filter((i) => +i.id === +getValues("carVersionId"))
                            ?.map((item) => ({
                              label: item.year,
                              value: item.id,
                            }))
                        : []
                    }
                    defaultValue={
                      !loadingVersions
                        ? versionsRes.carVersions.collection
                            .filter(
                              (i) =>
                                +i.id === +businessRequestRes?.businessRequestDetails?.carVersionId,
                            )
                            ?.map((item) => ({
                              label: item.year,
                              value: item.id,
                            }))
                        : []
                    }
                    options={
                      !loadingVersions
                        ? versionsRes.carVersions.collection.map((item) => ({
                            label: item.year,
                            value: item.id,
                          }))
                        : []
                    }
                    onChange={(e) => {
                      if (e?.value) {
                        setBookingData({ ...BookingData, carVersionId: e.label });

                        setValue("carVersionId", e.value);
                        clearErrors("carVersionId");
                      } else {
                        setValue("carVersionId", null);
                      }
                    }}
                  />
                ) : null}
                {errors.carVersionId && (
                  <Validation className="text-align-localized">
                    {formatMessage({
                      id: "validation.thisFieldIsRequired",
                    })}
                  </Validation>
                )}
              </>
            ) : (
              <>
                <OtherMakeWrapper
                  className={`required ${BookingData?.otherCarName && "hasValue"}`}
                  language={locale}
                >
                  <input
                    type="text"
                    placeholder={formatMessage({
                      id: "makeModelVersion",
                    })}
                    {...register("otherCarName", { required: true })}
                    maxLength={150}
                    defaultValue={
                      businessRequestRes?.businessRequestDetails?.otherCarName ||
                      getValues("otherCarName")
                        ? +getValues("otherCarName")
                        : null
                    }
                    onChange={(e) => {
                      if (e.target.value) {
                        setBookingData({
                          ...BookingData,
                          otherCarName: e.target.value,
                        });

                        setValue("otherCarName", e.target.value);
                        clearErrors("otherCarName");
                      } else {
                        setValue("otherCarName", null);
                        setBookingData({
                          ...BookingData,
                          otherCarName: null,
                        });
                      }
                    }}
                  />
                </OtherMakeWrapper>
                {errors.otherCarName && (
                  <Validation className="text-align-localized">
                    {formatMessage({
                      id: "validation.thisFieldIsRequired",
                    })}
                  </Validation>
                )}
              </>
            )}

            <CarNumbersWrapper
              className={`number-cars ${
                (BookingData?.numberOfCars ||
                  businessRequestRes?.businessRequestDetails?.numberOfCars) &&
                "hasValue"
              }`}
              language={locale}
            >
              <input
                {...register("numberOfCars", { required: true })}
                type="text"
                placeholder={formatMessage({
                  id: "numberOfCars",
                })}
                defaultValue={
                  businessRequestRes?.businessRequestDetails?.numberOfCars ||
                  getValues("numberOfCars")
                    ? +getValues("numberOfCars")
                    : null
                }
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  setBookingData({
                    ...BookingData,
                    numberOfCars: e.target.value,
                  });

                  clearErrors("numberOfCars");
                }}
                maxLength={5}
              />
            </CarNumbersWrapper>
            {errors.numberOfCars && (
              <Validation className="text-align-localized">
                {" "}
                {formatMessage({
                  id: "validation.thisFieldIsRequired",
                })}
              </Validation>
            )}
            {
              <Select
                {...register("pickUpCityId", { required: true })}
                placeholder={formatMessage({
                  id: "components.city",
                })}
                isSearchable
                // isClearable
                className="select required"
                isLoading={loadingAreas}
                filterOption={createFilter({
                  matchFrom: "any",
                  stringify: (option) => `${option.label}`,
                })}
                value={
                  !loadingAreas
                    ? areas_res?.areas
                        .filter((i) => +i.id === +getValues("pickUpCityId"))
                        ?.map((item) => ({
                          label: item.name,
                          value: item.id,
                          enName: item.enName,
                          arName: item.arName,
                        }))
                    : []
                }
                defaultValue={
                  !loadingAreas
                    ? areas_res?.areas
                        .filter(
                          (i) =>
                            +i.id === +businessRequestRes?.businessRequestDetails?.pickUpCityId,
                        )
                        ?.map((item) => ({
                          label: item.name,
                          value: item.id,
                          enName: item.enName,
                          arName: item.arName,
                        }))
                    : []
                }
                options={
                  !loadingAreas
                    ? areas_res.areas.map((item) => ({
                        label: item.name,
                        value: item.id,
                        enName: item.enName,
                        arName: item.arName,
                      }))
                    : []
                }
                onChange={(e) => {
                  if (e?.value) {
                    setBookingData({
                      ...BookingData,
                      pickUpCityId: { enName: e.enName, arName: e.arName },
                    });

                    setValue("pickUpCityId", e.value);
                    clearErrors("pickUpCityId");
                  } else {
                    setValue("pickUpCityId", null);
                  }
                }}
              />
            }
            {errors.pickUpCityId && (
              <Validation className="text-align-localized">
                {formatMessage({
                  id: "validation.thisFieldIsRequired",
                })}
              </Validation>
            )}
            <PeriodWrapper>
              <div className="d-flex justify-content-between align-items-center px-2 required position-relative">
                <label className="px-1">{formatMessage({ id: "Duration in months" })}</label>
                <div className="d-flex flex-row-reverse align-items-center justify-content-between">
                  <span
                    onClick={() =>
                      Number(periodMonths) < 60
                        ? (setPeriodMonths(Number(periodMonths) + 1), setShowPeriodMonthsErr(false))
                        : setShowPeriodMonthsErr(true)
                    }
                  >
                    <Add />
                  </span>
                  <input
                    {...register("numberOfMonths", { required: true })}
                    type="number"
                    min={0}
                    max={60}
                    value={periodMonths}
                    disabled
                  />
                  <span
                    onClick={() =>
                      Number(periodMonths) > 1
                        ? (setPeriodMonths(Number(periodMonths) - 1), setShowPeriodMonthsErr(false))
                        : setShowPeriodMonthsErr(true)
                    }
                  >
                    <Remove />
                  </span>
                </div>
              </div>
              {showPeriodMonthsErr && (
                <Validation className="text-align-localized">
                  {formatMessage({ id: "Min. 1& Max. 60" })}
                </Validation>
              )}
            </PeriodWrapper>
            <CalendarWrapper
              language={locale}
              className={`${
                (selectedDateTime || businessRequestRes?.businessRequestDetails?.pickUpDatetime) &&
                "hasValue"
              }`}
            >
              <div className="d-flex justify-content-between align-items-center required position-relative">
                {console.log("selectedDateTime", selectedDateTime)}
                <div style={{ flexBasis: "100%" }}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
                    <DateTimePicker
                      {...register("pickUpDatetime", { required: true })}
                      value={
                        businessRequestRes?.businessRequestDetails?.pickUpDatetime ||
                        selectedDateTime ||
                        null
                      }
                      onChange={handleDateTimeChange}
                      okLabel={formatMessage({ id: "ok" })}
                      cancelLabel={formatMessage({ id: "cancel" })}
                      ampm
                      emptyLabel={formatMessage({ id: "Expected pick up date" })}
                      disablePast
                      className="w-100"
                      format="DD-MM-YYYY hh:mm A"
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <CalendarToday style={{ margin: "0 10px" }} />
              </div>
            </CalendarWrapper>
            {errors.pickUpDatetime && (
              <Validation className="text-align-localized">
                {formatMessage({
                  id: "validation.thisFieldIsRequired",
                })}
              </Validation>
            )}
            <InsuranceTypeWrapper>
              <h4 className="font-20px bold color-1 w-100">
                {formatMessage({
                  id: "car.insurancetype",
                })}
              </h4>
              <div>
                {!loadingInsurances ? (
                  Insurances_res.insurances.map((item) => (
                    <div
                      key={item.id}
                      className={`${insuranceType == item.id && "active"} bold`}
                      onClick={() => {
                        setBookingData({
                          ...BookingData,
                          insuranceType: {
                            enName: item.enName,
                            arName: item.arName,
                          },
                        });
                        setInsuranceType(item.id);
                      }}
                    >
                      {item.name}
                    </div>
                  ))
                ) : (
                  <div style={{ background: "none" }}>
                    <CircularProgress />
                  </div>
                )}
              </div>
              <input
                {...register("insuranceId", { required: true })}
                hidden
                value={insuranceType}
              />
            </InsuranceTypeWrapper>
            <AdditionalNotesWrapper>
              <h4 className="font-20px bold color-1">
                {formatMessage({ id: "Additional notes" })}
              </h4>
              <textarea
                {...register("additionalNotes")}
                maxLength={1000}
                placeholder={formatMessage({ id: "Type here" })}
                defaultValue={businessRequestRes?.businessRequestDetails?.additionalNotes}
              />
            </AdditionalNotesWrapper>
            <div className="pt-25 text-right" style={{ gridColumn: "1/4" }}>
              <button
                variant="contained"
                color="primary"
                className="btn btn-primary mr-4"
                type="submit"
                disabled={creatingRequests || updatingRequests}
                onMouseDown={(e) => e.preventDefault()}
              >
                <FormattedMessage id="button.save" />
              </button>
              <button
                type="button"
                className="btn btn-danger mr-15 text-white"
                onClick={() => {
                  history.push("/cw/dashboard/branches");
                }}
                disabled={creatingRequests || updatingRequests}
              >
                <FormattedMessage id="button.cancel" />
              </button>
              {progress === 100 ||
                ((creatingRequests || updatingRequests) && progress > 0 && progress <= 100 && (
                  <CircularProgressWithLabel value={progress} />
                ))}
            </div>
          </Form>
          <CustomerDataDisplay customerDetailsRes={customerDetails || customerDetailsRes} />
        </Wrapper>
      ) : (
        (customerDetails || customerDetailsRes) && (
          <div className="w-100 d-inline-block text-center">
            <CircularProgress />
          </div>
        )
      )}
    </>
  );
}

export default CreateEditRequest;
