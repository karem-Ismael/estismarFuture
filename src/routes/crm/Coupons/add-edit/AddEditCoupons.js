/* eslint-disable prettier/prettier */
/** Add/Edit Customer */
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import CreateCoupons from "gql/mutations/CreateCoupon.gql";
import UpdateCoupon from "gql/mutations/UpdateCoupon.gql";
import moment from "moment";
import { CrreatCoupon } from "validations/Coupon.validation";
import CustomTextField from "components/Input/CustomTextField";
import { InputAdornment, TextField } from "@material-ui/core";
import { ErrorMessage } from "components/shared/ErrorMessage";
import { CitiesDropDown } from "components/DropDowns";
import AllyName from "components/DropDowns/AllyName";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Select from "react-select";

import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { addCouponInitValues } from "./CouponAddEdit.modal";
import "./style.css";
import { CouponDetails } from "gql/queries/CouponDetails.gql";
import BranchesDropDown from "components/DropDowns/BranchesDropDown";
import PaymentDropDown from "components/DropDowns/PaymentDropDown";
import { CarVersionsDropDown } from "components/DropDowns/CarVersionsDropDown";

import "moment/locale/en-au";

import "moment/locale/ar-sa";

function AddEditCoupon() {
  const { id } = useParams();
  const history = useHistory();
  const { locale } = useIntl();

  const { formatMessage } = useIntl();

  const [createCoupon, { loading: creatingUser }] = useMutation(CreateCoupons);
  const [updateCoupon] = useMutation(UpdateCoupon);

  const [gregorainDOB, setGregorainDOB] = useState(null);
  const [hijriDOB, setHijriDOB] = useState(null);
  const [startDate, setStartDate] = useState();
  const [expireDate, setExpireDate] = useState();
  const [endchange, setEndChanged] = useState(false);
  const [startchange, setStartChanged] = useState(false);
  const [carVersionLength, setCarVersionList] = useState(0);
  const [allyLength, setAllyList] = useState(0);
  const [branchLength, setBranchList] = useState(0);
  const [cityLength, setCityList] = useState(0);

  // START EDIT PROCESS
  // FOR EDIT MODE

  const { data: couponDetails, refetch } = useQuery(CouponDetails, {
    skip: !id,
    variables: { id: +id },
  });

  useEffect(() => {
    if (couponDetails) {
      const {
        code,
        id,
        allyCompanies,

        startAt,
        expireAt,
        numOfUsages,
        discountType,
        discountTypeKey,
        discountValue,
        maxLimitValue,
        areas,
        numOfUsagesPerUser,
        minRentPrice,
        numOfDays,
        branches,
        carVersions,
        minRentDays,
        paymentMethod,
      } = couponDetails.couponDetails;
      if (areas.length) {
        setFieldValue(
          "cityIds",
          areas.map((area) => +area.id),
        );
      }
      if (allyCompanies.length) {
        setFieldValue(
          "allyCompanyIds",
          allyCompanies.map((ally) => +ally.id),
        );
      }

      setFieldValue("code", code);
      setFieldValue("numOfUsages", numOfUsages);
      setFieldValue("numOfUsagesPerUser", numOfUsagesPerUser);
      setFieldValue("discountValue", discountValue);
      setFieldValue("maxLimitValue", maxLimitValue);
      setFieldValue("startAt", startAt);
      setFieldValue("expireAt", expireAt ? moment(expireAt).utc() : null);
      setFieldValue("discountType", discountTypeKey);
      setFieldValue("minRentPrice", minRentPrice);
      setFieldValue("numOfDays", numOfDays);
      setFieldValue("minRentDays", minRentDays);
      setFieldValue("paymentMethod", paymentMethod);

      setFieldValue(
        "branchIds",
        branches.map((branch) => +branch.id),
      );
      setFieldValue(
        "carVersionIds",
        carVersions.map((version) => +version.id),
      );

      setStartDate(moment(startAt).utc().locale("en").format("DD/MM/YYYY HH:mm:ss"));
    }

    return () => {};
  }, [couponDetails]);
  // END EDIT PROCESS
  useEffect(() => {
    moment.locale(locale === "ar" ? "ar" : "en-au");
  }, [locale]);

  useEffect(() => {
    if (gregorainDOB) setHijriDOB(gregorainDOB);
  }, [gregorainDOB]);

  useEffect(() => {
    if (hijriDOB) {
      setGregorainDOB(hijriDOB);
    }
  }, [hijriDOB]);

  const formik = useFormik({
    initialValues: addCouponInitValues,
    validationSchema: CrreatCoupon,

    onSubmit: async (values) => {
      const variables = {
        ...values,
        allyCompanyIds: values.allyCompanyIds?.length == allyLength ? [] : values.allyCompanyIds, // Send empty array if All is selected
        branchIds: values.branchIds?.length == branchLength ? [] : values.branchIds, // Send empty array if All is selected
        cityIds: values.cityIds?.length == cityLength ? [] : values.cityIds, // Send empty array if All is selected
        carVersionIds:
          values.carVersionIds?.length == carVersionLength &&
          values.branchIds?.length == branchLength
            ? []
            : values.carVersionIds, // Send empty array if All is selected
        paymentMethod: !values.paymentMethod ? "ALL" : values.paymentMethod,
      };
      console.log(variables, "variables");
      if (!id) {
        // Create New User/CUSTOMRT
        await createCoupon({
          variables: {
            ...variables,
            discountValue: +values.discountValue,
            maxLimitValue: +values.maxLimitValue,
            numOfUsages: +values.numOfUsages,
            numOfUsagesPerUser: +values.numOfUsagesPerUser,
            startAt: startDate.concat("T00:00:00"),
            expireAt: expireDate ? expireDate.concat("T23:59:00") : undefined,
            minRentDays: +values.minRentDays,
            minRentPrice: +values.minRentPrice,
            numOfDays: +values.numOfDays,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.create.coupon" }));
            history.push("/cw/dashboard/coupons");
          })
          .catch((err) => {
            NotificationManager.error(err?.message);
          });
      } else {
        // EDIT EXISTIGN User/CUSTOMRT
        await updateCoupon({
          variables: {
            ...variables,
            couponId: id,
            discountValue: +values.discountValue,
            maxLimitValue: +values.maxLimitValue,
            numOfUsages: +values.numOfUsages,
            numOfUsagesPerUser: +values.numOfUsagesPerUser,
            startAt: startchange ? startDate.concat("T00:00:00") : undefined,
            expireAt: endchange ? expireDate.concat("T23:59:00") : undefined,
            minRentDays: +values.minRentDays,
            minRentPrice: +values.minRentPrice,
            numOfDays: +values.numOfDays,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.edit.coupon" }));
            refetch().then(() =>
              setTimeout(() => {
                history.push("/cw/dashboard/coupons");
              }, 1000),
            );
          })
          .catch((err) => {
            NotificationManager.error(err?.message);
          });
      }
    },
  });

  const {
    values,
    touched,
    setFieldValue,
    handleSubmit,
    handleChange: handleFormikChange,
    errors,
  } = formik;

  function handleChange(e) {
    e.target.value = e.target.value.trimStart();
    handleFormikChange(e);
  }

  function resetForm() {
    formik.resetForm();
  }
  return (
    <>
      <Helmet>
        <title>
          {formatMessage({
            id: id ? "Editcoupon" : "Addcoupon",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={id ? "Editcoupon" : "Addcoupon"} />}
        match={location}
        lastElement={id || <IntlMessages id="Addcoupon" />}
        enableBreadCrumb
      />
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "24px" }}
        className="add-edit-coupons"
      >
        <div className="row">
          <div className="col-md-6">
            <CustomTextField
              fullWidth
              required
              name="code"
              value={values.code}
              inputProps={{ maxLength: 25 }}
              onChange={handleChange}
              error={touched.code && Boolean(errors.code)}
              errormsg={touched.code && errors.code}
            />
          </div>

          <div className="col-md-6">
            <AllyName
              valueAttribute="id"
              selectedAlly={values.allyCompanyIds}
              multiple
              setList={setAllyList}
              setSelectedAlly={(Id) =>
                Id
                  ? setFieldValue(
                      "allyCompanyIds",
                      Id.map((val) => +val.value),
                    )
                  : null
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <BranchesDropDown
              coupon
              isDisabled={values.isAllyManager}
              multiple
              setList={setBranchList}
              allyId={values.allyCompanyIds}
              valueAttribute="id"
              selectedBranch={values.branchIds}
              setSelectedBranch={(Id) => {
                setFieldValue("branchIds", Id);
                setFieldValue("carVersionIds", null);
              }}
            />
          </div>
          <div className="col-md-6">
            <CarVersionsDropDown
              key={values?.branchIds}
              valueAttribute="id"
              selectVersion={values.carVersionIds}
              setCarVersionList={setCarVersionList}
              branchIds={values?.branchIds}
              multiple
              setSelectedVersion={(Id) => {
                setFieldValue(
                  "carVersionIds",
                  Id?.map((val) => +val.value),
                );
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
              <DatePicker
                okLabel={formatMessage({ id: "ok" })}
                cancelLabel={formatMessage({ id: "cancel" })}
                clearLabel={formatMessage({ id: "clear" })}
                clearable
                inputVariant="outlined"
                label={formatMessage({ id: "start.date" })}
                style={{ width: "100%" }}
                value={values.startAt}
                onChange={(date) => {
                  setStartChanged(true);
                  setFieldValue("startAt", date);
                  setStartDate(date.locale("en").format("DD/MM/YYYY"));
                }}
                name="start"
                placeholder={formatMessage({ id: "start.date" })}
                disablePast={!id}
                required
                renderInput={(props) => <TextField {...props} />}
                openTo="year"
                views={["year", "month", "date"]}
                format="DD-MM-YYYY"
              />
            </MuiPickersUtilsProvider>
            <ErrorMessage
              condition={!!formik.submitCount && Boolean(errors?.startAt)}
              errorMsg={errors.startAt}
            />
          </div>

          <div className="col-md-6">
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
              <DatePicker
                okLabel={formatMessage({ id: "ok" })}
                cancelLabel={formatMessage({ id: "cancel" })}
                clearLabel={formatMessage({ id: "clear" })}
                clearable
                style={{ width: "100%" }}
                value={values.expireAt}
                inputVariant="outlined"
                onChange={(date) => {
                  setEndChanged(true);
                  setFieldValue("expireAt", date);
                  setExpireDate(date.locale("en").format("DD/MM/YYYY"));
                }}
                name="enddate"
                label={formatMessage({ id: "end.date" })}
                placeholder={formatMessage({ id: "end.date" })}
                disablePast={!id}
                renderInput={(props) => <TextField {...props} />}
                openTo="year"
                views={["year", "month", "date"]}
                format="DD-MM-YYYY"
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            {(!id || (id && CouponDetails)) && (
              <CitiesDropDown
                valueAttribute="id"
                multiple
                setList={setCityList}
                selectedCity={values?.cityIds}
                setSelectedCity={(id) =>
                  id &&
                  setFieldValue(
                    "cityIds",
                    id.map((val) => +val.value),
                  )
                }
              />
            )}
          </div>
          <div className="col-md-6">
            {(!id || (values.discountType && id)) && (
              <Select
                error={!!formik.submitCount && Boolean()}
                className={`dropdown-select required  ${
                  errors?.discountType && !!formik.submitCount ? "selection-error" : ""
                }`}
                options={[
                  {
                    value: "percentage",
                    label: formatMessage({ id: "percentage" }),
                  },
                  {
                    value: "fixed_value",
                    label: formatMessage({ id: "fixedvalue" }),
                  },
                  {
                    value: "free_delivery",
                    label: formatMessage({ id: "free_delivery" }),
                  },
                  {
                    value: "free_handover",
                    label: formatMessage({ id: "free_handover" }),
                  },
                  {
                    value: "free_days",
                    label: formatMessage({ id: "free_days" }),
                  },
                ]}
                value={[
                  {
                    value: "percentage",
                    label: formatMessage({ id: "percentage" }),
                  },
                  {
                    value: "fixed_value",
                    label: formatMessage({ id: "fixedvalue" }),
                  },
                  {
                    value: "free_delivery",
                    label: formatMessage({ id: "free_delivery" }),
                  },
                  {
                    value: "free_handover",
                    label: formatMessage({ id: "free_handover" }),
                  },
                  {
                    value: "free_days",
                    label: formatMessage({ id: "free_days" }),
                  },
                ].find((optn) => `${optn.value}` === values.discountType)}
                placeholder={formatMessage({ id: "type" })}
                onChange={(selection) => {
                  setFieldValue("discountValue", "");
                  setFieldValue("discountType", selection.value);
                }}
              />
            )}
          </div>
        </div>
        {values.discountType == "free_days" ? (
          <div className="row">
            <div className="col-md-6">
              <CustomTextField
                fullWidth
                required
                name="numOfDays"
                value={values.numOfDays}
                inputProps={{ maxLength: 6 }}
                //   onChange={handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                onChange={(e) => setFieldValue("numOfDays", e.target.value)}
                error={touched.numOfDays && Boolean(errors.numOfDays)}
                errormsg={touched.numOfDays && errors.numOfDays}
              />
            </div>
            <div className="col-md-6">
              <CustomTextField
                fullWidth
                required
                name="minRentDays"
                value={values.minRentDays}
                inputProps={{ maxLength: 6 }}
                //   onChange={handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                onChange={(e) => setFieldValue("minRentDays", e.target.value)}
                error={touched.minRentDays && Boolean(errors.minRentDays)}
                errormsg={touched.minRentDays && errors.minRentDays}
              />
            </div>
          </div>
        ) : null}
        <div className="row">
          <div className="col-md-6">
            <CustomTextField
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {values.discountType == "percentage" ? "%" : null}
                  </InputAdornment>
                ),
              }}
              name="discountValue"
              value={values.discountValue}
              inputProps={{ maxLength: values.discountType == "percentage" ? 3 : 9 }}
              onInput={(e) => {
                if (values.discountType == "percentage") {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                } else if (values.discountType != "percentage") {
                  e.target.value = e.target.value;
                }
              }}
              onChange={(e) => {
                setFieldValue(
                  "discountValue",
                  values.discountType == "percentage"
                    ? e.target.value
                    : e.target.value.includes(".")
                    ? e.target.value.slice(0, 9)
                    : e.target.value.slice(0, 6),
                );
              }}
              error={touched.discountValue && Boolean(errors.discountValue)}
              errormsg={touched.discountValue && errors.discountValue}
            />
          </div>
          <div className="col-md-6">
            <CustomTextField
              fullWidth
              disabled={values.discountType != "percentage"}
              name="maxLimitValue"
              value={values.maxLimitValue}
              inputProps={{ maxLength: 9 }}
              onInput={(e) => {
                if (!e.target.value.includes(".") && e.target.value.length > 6) {
                  return;
                }
                e.target.value = e.target.value.includes(".")
                  ? e.target.value.slice(0, 9)
                  : e.target.value.slice(0, 6);
              }}
              onChange={(e) =>
                setFieldValue(
                  "maxLimitValue",
                  e.target.value.includes(".")
                    ? e.target.value.slice(0, 9)
                    : e.target.value.slice(0, 6),
                )
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <CustomTextField
              fullWidth
              required
              name="numOfUsages"
              value={values.numOfUsages}
              inputProps={{ maxLength: 6 }}
              //   onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              onChange={(e) => setFieldValue("numOfUsages", e.target.value)}
              error={touched.numOfUsages && Boolean(errors.numOfUsages)}
              errormsg={touched.numOfUsages && errors.numOfUsages}
            />
          </div>
          <div className="col-md-6">
            <CustomTextField
              fullWidth
              required
              name="numOfUsagesPerUser"
              value={values.numOfUsagesPerUser}
              inputProps={{ maxLength: 6 }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              onChange={(e) => setFieldValue("numOfUsagesPerUser", e.target.value)}
              error={touched.numOfUsagesPerUser && Boolean(errors.numOfUsagesPerUser)}
              errormsg={touched.numOfUsagesPerUser && errors.numOfUsagesPerUser}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <CustomTextField
              fullWidth
              name="minRentPrice"
              value={values.minRentPrice}
              inputProps={{ maxLength: 6 }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              onChange={(e) => setFieldValue("minRentPrice", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <PaymentDropDown
              valueAttribute="id"
              coupon
              selectedPayment={values.paymentMethod}
              setSelectedPayment={(payment) => {
                setFieldValue("paymentMethod", payment);
              }}
            />
          </div>
        </div>

        <div className="pt-25 text-right">
          <button
            variant="contained"
            color="primary"
            className="btn btn-primary mr-4"
            type="submit"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSubmit}
          >
            <FormattedMessage id="button.save" />
          </button>
          <button
            type="button"
            className="btn btn-danger mr-15 text-white"
            onClick={() => {
              history.push("/cw/dashboard/coupons");
              resetForm();
            }}
          >
            <FormattedMessage id="button.cancel" />
          </button>
        </div>
      </form>
    </>
  );
}

export default AddEditCoupon;
