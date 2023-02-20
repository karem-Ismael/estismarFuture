/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable no-undefined */
/* eslint-disable import/order */
/** Add/Edit Company */
import React, { useState, useRef, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import {
  CreateAllyCompanyMutation,
  UpdateAllyCompany,
} from "gql/mutations/AllyCompany.mutations.gql";
import { GetAllyCompanyQuery } from "gql/queries/Ally.queries.gql";
import IntlTelInput from "react-intl-tel-input";
import { EditCompanyValidation } from "validations/Company.validations";
import CustomTextField from "components/Input/CustomTextField";
import { ErrorMessage } from "components/shared/ErrorMessage";
import Select from "react-select";
import { allyClassOptions, paytype, showFor } from "constants/constants";
import UPLOAD_IMAGE from "gql/mutations/UploadImage.gql";
import { FileUploader } from "components/ImageUploader";
import { CircularProgressWithLabel } from "components/CircularProgressWithLabel";
import { addEditCompanyInitValues } from "./AddEditCompany.model";
import { Checkbox, FormControlLabel, FormLabel } from "@material-ui/core";
import {
  Add as AddIcon,
  DeleteForever as DeleteForeverIcon,
  ClearAll as ClearIcon,
} from "@material-ui/icons";
import BranchesDropDownWithArea from "components/DropDowns/BranchDropDwonWithCity";
import BranchesDropDownWithAreaForFilter from "components/DropDowns/BranchDropDownWithAreaForFilter";

import BranchesDropDownWithPicupLocation from "components/DropDowns/BranchesWithPicupLocation";
import { ExtraServices } from "gql/queries/ExtraService.gql";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Rates } from "gql/queries/AlliesRates.gql";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
function CreateEditAllyCompany() {
  const { companyId } = useParams();
  const history = useHistory();
  const { formatMessage, locale } = useIntl();
  const [extraservice, setExtraService] = useState([]);
  const [brancheschoosen, setBrancheschoosen] = useState([]);
  const selectInputRef = useRef();
  const phoneNumberReactRef = useRef();
  const [licenceImage, setlicenceImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [logo, setlogo] = useState("");
  const [bankCardImage, setBankCardImage] = useState("");
  const [phoneNumberDisplay, setMobileDisplay] = useState("");
  const [commercialRegistrationImage, setcommercialRegistrationImage] = useState("");
  const [phoneValidity, setPhoneValidity] = useState(false);
  const [progress, setProgress] = useState(0);
  const [delivery, SetDelivery] = useState([{ isFree: false }]);
  const [companyservice, setCompanyService] = useState([]);
  const [hover, setHover] = useState(-1);
  const [CreateAllyMutation, { loading: creatingAlly }] = useMutation(CreateAllyCompanyMutation);
  const [EditAllyCompanyMutation, { loading: EditingAllyCompany }] = useMutation(UpdateAllyCompany);
  const [uploadImageMutation, { loading: uploading, error: UploadImageError }] = useMutation(
    UPLOAD_IMAGE,
  );
  const { data: ratesData } = useQuery(Rates, {
    variables: {
      isActive: null,
      limit: 100,
    },
  });

  const { data: allservice } = useQuery(ExtraServices, {
    variables: {
      limit: 100,
    },
  });
  useEffect(() => {
    if (UploadImageError?.message) {
      NotificationManager.error(UploadImageError?.message);
    }
  }, [UploadImageError]);
  // START EDIT PROCESS
  // FOR EDIT MODE
  const { data: companyDetailsRes, refetch } = useQuery(GetAllyCompanyQuery, {
    skip: !companyId,
    variables: { id: +companyId },
  });

  useEffect(() => {
    if (companyId) refetch();
  }, [companyId]);

  useEffect(() => {
    if (companyDetailsRes?.allyCompany) {
      const { allyCompany = {} } = companyDetailsRes;

      const deliverd = allyCompany.allyHandoverCities.map((hancities) => ({
        dropOffCityId: hancities.dropOffCityId,
        isFree: !!hancities.isFree,
        pickUpCityId: hancities.pickUpCityId,
        price: hancities.price,
      }));
      const services = allyCompany.allyExtraServices.map((service) => ({
        extraServiceId: service.extraServiceId,
        isActive: service.isActive,
        isRequired: service.isRequired,
        payType: service.payType,
        serviceValue: service.serviceValue,
        showFor: service.showFor || "ally_company",
      }));
      setCompanyService(services.length ? services : [{}]);
      SetDelivery(deliverd.length ? deliverd : [{ isFree: false, price: 0 }]);
      setFieldValue("canHandoverInAntherCity", allyCompany.canHandoverInAntherCity);
      setFieldValue("isApiIntegrated", allyCompany.isApiIntegrated);
      setFieldValue("isB2b", allyCompany.isB2b);
      setFieldValue("isB2c", !allyCompany.isB2c);
      setFieldValue("rate", allyCompany.rate);
      setFieldValue("commisionRate", allyCompany.commisionRate);
      setFieldValue("managerName", allyCompany.managerName || addEditCompanyInitValues.managerName);
      setFieldValue("arName", allyCompany.arName || addEditCompanyInitValues.arName);
      setFieldValue("enName", allyCompany.enName || addEditCompanyInitValues.enName);
      setFieldValue("phoneNumber", allyCompany.phoneNumber || addEditCompanyInitValues.phoneNumber); // works for numers start with 966 & won't be suitable for numbers from other countries
      setFieldValue("email", allyCompany.email || addEditCompanyInitValues.email);
      setFieldValue("rate", allyCompany.rate || addEditCompanyInitValues.rate);
      setFieldValue("allyClass", allyCompany.allyClass || addEditCompanyInitValues.allyClass);
      setFieldValue("allyClass", allyCompany.allyClass || addEditCompanyInitValues.allyClass);
      setFieldValue("allyRateId", allyCompany.allyRateId || addEditCompanyInitValues.allyRateId);
      setFieldValue(
        "commercialRegestration",
        allyCompany.commercialRegestration || addEditCompanyInitValues.commercialRegestration,
      );
      setFieldValue(
        "isExtendFixedPrice",
        allyCompany.isExtendFixedPrice || addEditCompanyInitValues.isExtendFixedPrice,
      );
      setFieldValue("isOnlinePayEnable", allyCompany.isOnlinePayEnable);
      setMobileDisplay(allyCompany.phoneNumber.slice(3)); // works for numers start with 966 & won't be suitable for numbers from other countries
      setPhoneValidity(true);
      // Images
      setcommercialRegistrationImage(allyCompany.commercialRegistrationImage);
      setlogo(allyCompany.logo);
      setBankCardImage(allyCompany.bankCardImage);
      setlicenceImage(allyCompany.licenceImage);
      setProfileImage(profileImage);
    }

    return () => {
      setcommercialRegistrationImage("");
      setlogo("");
      setBankCardImage("");
      setlicenceImage("");
    };
  }, [companyDetailsRes]);
  // END EDIT PROCESS

  useEffect(() => {
    setFieldValue("commercialRegistrationImage", commercialRegistrationImage);
    setFieldValue("licenceImage", licenceImage);
    setFieldValue("logo", logo);
    setFieldValue("bankCardImage", bankCardImage);
  }, [licenceImage, logo, commercialRegistrationImage, bankCardImage]);
  useEffect(() => {
    if (allservice?.extraServices?.collection.length) {
      const services = allservice?.extraServices?.collection.map((service, index) => ({
        arTitle: service.arTitle,
        enTitle: service.enTitle,
        extraServiceId: service.id,
        isActive: service.isActive,
        payType: service.payType,
        serviceValue: service.serviceValue || 0,
        showFor: service.showFor || "ally_company",
      }));
      setExtraService(services);
    }
  }, [allservice]);

  const formik = useFormik({
    initialValues: addEditCompanyInitValues,
    validationSchema: EditCompanyValidation,

    onSubmit: async (values) => {
      if (!phoneValidity) return;

      setProgress(12 || progress);
      // Logo
      if (!values.logo.startsWith("http")) {
        await uploadImageMutation({
          variables: { image: values.logo, topic: "logo" },
        })
          .then((res) => {
            values.logo = res.data.imageUpload.imageUpload.imageUrl;
            setProgress((progress) => progress + 20);
          })
          .catch((err) => {
            if (err?.message) NotificationManager.error(err?.message);
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator);
            }
            setProgress(0);
          });
      }

      if (!values.licenceImage.startsWith("http")) {
        await uploadImageMutation({
          variables: { image: values.licenceImage, topic: "licenceImage" },
        })
          .then((res) => {
            values.licenceImage = res.data.imageUpload.imageUpload.imageUrl;
            setProgress((progress) => progress + 40);
          })
          .catch((err) => {
            if (err?.message) NotificationManager.error(err?.message);
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator);
            }
            setProgress(0);
          });
      }

      if (!values.bankCardImage.startsWith("http")) {
        await uploadImageMutation({
          variables: { image: values.bankCardImage, topic: "bankCardImage" },
        })
          .then((res) => {
            values.bankCardImage = res.data.imageUpload.imageUpload.imageUrl;
            setProgress((progress) => progress + 60);
          })
          .catch((err) => {
            if (err?.message) NotificationManager.error(err?.message);
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator);
            }
            setProgress(0);
          });
      }

      // commercialRegistrationImage
      if (
        !values.commercialRegistrationImage.startsWith("http") &&
        values.commercialRegistrationImage.length > 0
      ) {
        await uploadImageMutation({
          variables: {
            image: values.commercialRegistrationImage,
            topic: "commercialRegistrationImage",
          },
        })
          .then((res) => {
            values.commercialRegistrationImage = res.data.imageUpload.imageUpload.imageUrl;
            setProgress((progress) => progress + 20);
          })
          .catch((err) => {
            if (err?.message) NotificationManager.error(err?.message);
            NotificationManager.error(err);
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator);
            }
            setProgress(0);
          });
      }

      const variables = {
        ...values,
      };

      if (!companyId) {
        const services = extraservice.map((service) => ({
          extraServiceId: service.extraServiceId,
          isActive: service.isActive,
          payType: service.payType,
          serviceValue: service.serviceValue,
          showFor: service.showFor,
        }));
        await CreateAllyMutation({
          variables: {
            ...variables,
            isB2c: !values.isB2c,
            allyExtraServicesAttributes: Object.keys(services[0]).length
              ? services.filter((service) => service.isActive)
              : undefined,
          },
        })
          .then(() => {
            setProgress(100);
            NotificationManager.success(formatMessage({ id: "success.create.allyCompany" }));
            history.push("/cw/dashboard/companies");
          })
          .catch((err) => {
            NotificationManager.error(err.message);

            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator);
            }
          });
      } else {
        const cities = delivery.filter((d) => d.pickUpCityId && d.dropOffCityId);
        // EDIT EXISTIGN company
        await EditAllyCompanyMutation({
          variables: {
            ...companyDetailsRes?.allyCompany,
            ...variables,
            isB2c: !values.isB2c,
            allyCompanyId: companyId,
            handoverCitiesAttributes: !values.canHandoverInAntherCity
              ? []
              : values.canHandoverInAntherCity && Object.keys(delivery[0]).length
              ? cities
              : undefined,
            allyExtraServicesAttributes: Object.keys(companyservice[0]).length
              ? companyservice.filter((service) => service.isActive)
              : undefined,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.edit.allyCompany" }));
            refetch().then(() =>
              setTimeout(() => {
                history.push("/cw/dashboard/companies");
              }, 3000),
            );
            setProgress(100);
          })
          .catch((err) => {
            NotificationManager.error(err?.message);

            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator);
            }
            setProgress(0);
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
  function clearInputs(delivery, index) {
    const filtered = delivery.filter((br, deindex) => deindex !== index);
    filtered.push({ pickUpCityId: null, dropOffCityId: null, isFree: false, price: 0 });
    SetDelivery(filtered);
  }
  return (
    <>
      <div className="">
        <Helmet>
          <title>
            {formatMessage({
              id: companyId ? "EditCompany" : "addCompany",
            })}
          </title>
        </Helmet>
        <PageTitleBar
          title={<IntlMessages id={companyId ? "EditCompany" : "addCompany"} />}
          match={location}
          lastElement={companyId || <IntlMessages id="addCompany" />}
          enableBreadCrumb
        />
      </div>
      <div className="d-inline-block w-100">
        <Tabs>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <TabList>
              <Tab>
                <FormattedMessage id="basicinformation" />
              </Tab>
              <Tab>
                <FormattedMessage id="allyExtraService" />
              </Tab>
              <Tab>
                <FormattedMessage id="ApIIntegration" />
              </Tab>
            </TabList>
          </div>
          <TabPanel>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <CustomTextField
                    fullWidth
                    name="arName"
                    required
                    value={values.arName}
                    onChange={handleChange}
                    error={touched.arName && Boolean(errors.arName)}
                    errormsg={touched.arName && errors.arName}
                  />
                </div>
                <div className="col-md-6">
                  <CustomTextField
                    fullWidth
                    name="enName"
                    required
                    value={values.enName}
                    onChange={handleChange}
                    error={touched.enName && Boolean(errors.enName)}
                    errormsg={touched.enName && errors.enName}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomTextField
                    fullWidth
                    required
                    name="managerName"
                    value={values.managerName}
                    onChange={handleChange}
                    error={touched.managerName && Boolean(errors.managerName)}
                    errormsg={touched.managerName && errors.managerName}
                  />
                </div>
                <div className="col-md-6" dir="ltr">
                  <IntlTelInput
                    fieldId="input-tel"
                    inputClassName={
                      !phoneValidity && (values.phoneNumber > 0 || formik.submitCount > 0)
                        ? "input-error"
                        : ""
                    }
                    separateDialCode
                    telInputProps={{ pattern: "[0-9]*" }}
                    ref={phoneNumberReactRef}
                    preferredCountries={["sa"]}
                    containerClassName="intl-tel-input"
                    placeholder="512345678*"
                    value={phoneNumberDisplay}
                    onPhoneNumberFocus={(isValid) => setPhoneValidity(isValid)}
                    onPhoneNumberChange={(isValid, num, obj, fullNum) => {
                      if (/^[0-9]+$/.test(num.toString()) || num === "") {
                        setFieldValue("phoneNumber", fullNum.replace(/\D/gm, ""));
                        setMobileDisplay(num);
                      } else {
                        setFieldValue("phoneNumber", values.phoneNumber);
                        setMobileDisplay(phoneNumberDisplay);
                      }
                      setPhoneValidity(isValid);
                    }}
                  />
                  <ErrorMessage
                    condition={!!formik.submitCount && !phoneValidity}
                    errorMsg="validation.invalidMobileNumber"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomTextField
                    fullWidth
                    required
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    errormsg={touched.email && errors.email}
                    placeholder="example@mail.com"
                  />
                </div>
                <div className="col-md-6">
                  <div
                    style={
                      touched.allyClass && errors.allyClass
                        ? { border: "solid 1px red", borderRadius: "4px" }
                        : null
                    }
                  >
                    <Select
                      className="dropdown-select"
                      options={allyClassOptions(formatMessage)}
                      ref={selectInputRef}
                      placeholder={`${formatMessage({ id: "class" })} *`}
                      error={touched.allyClass && Boolean(errors.allyClass)}
                      errormsg={touched.allyClass && errors.allyClass}
                      onChange={(selection) => {
                        setFieldValue("allyClass", selection?.value);
                      }}
                      value={allyClassOptions(formatMessage).find(
                        (allyClass) => allyClass.value === values.allyClass,
                      )}
                    />
                  </div>
                  <ErrorMessage
                    condition={touched.allyClass && errors.allyClass}
                    errorMsg="thisfieldisrequired"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomTextField
                    fullWidth
                    required
                    name="commercialRegestration"
                    value={values.commercialRegestration}
                    onChange={(e) => {
                      const CR = e.target.value;
                      if (/^[0-9]+(\.)?[0-9]*$/.test(CR.toString()) || CR === "") {
                        setFieldValue("commercialRegestration", CR);
                      } else {
                        setFieldValue(values.commercialRegestration);
                      }
                    }}
                    error={touched.commercialRegestration && Boolean(errors.commercialRegestration)}
                    errormsg={touched.commercialRegestration && errors.commercialRegestration}
                  />
                </div>
                {((companyId && companyDetailsRes?.allyCompany) || !companyId) && (
                  <div className="col-md-6">
                    <CustomTextField
                      fullWidth
                      name="commisionRate"
                      type="number"
                      value={values.commisionRate}
                      // onChange={(e) => {
                      //   setFieldValue("commisionRate", +e.target.value);
                      // }}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-9">
                      {ratesData?.rates?.collection && (
                        <div
                          style={
                            touched.allyRateId && errors.allyRateId
                              ? { border: "solid 1px red", borderRadius: "4px" }
                              : null
                          }
                        >
                          <Select
                            className="dropdown-select allyRateId"
                            style={touched.rate && errors.rate ? { border: "solid 1px red" } : null}
                            options={ratesData.rates.collection.map((i) => ({
                              value: i.id,
                              label: i.name,
                            }))}
                            required
                            name="allyRateId"
                            ref={selectInputRef}
                            error={touched.allyRateId && Boolean(errors.allyRateId)}
                            errormsg={touched.allyRateId && errors.allyRateId}
                            placeholder={`${formatMessage({ id: "rate" })} *`}
                            onChange={(selection) => {
                              setFieldValue("allyRateId", selection?.value);
                            }}
                            value={ratesData?.rates?.collection
                              .filter((i) => i.id == values.allyRateId)
                              .map((i) => ({
                                value: i.id,
                                label: i.name,
                              }))}
                          />
                        </div>
                      )}
                      {touched.allyRateId && errors.allyRateId && (
                        <p className="text-danger mt-1 text-left">
                          <FormattedMessage id="thisfieldisrequired" />
                        </p>
                      )}
                    </div>
                    <div className="col-md-3">
                      <CustomTextField
                        required
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        fullWidth
                        name="rate"
                        value={values.rate}
                        onChange={handleChange}
                        placeholder="3.5"
                        error={touched.rate && Boolean(errors.rate)}
                        errormsg={touched.rate && errors.rate}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isOnlinePayEnable}
                        onChange={(e) => setFieldValue("isOnlinePayEnable", e.target.checked)}
                        name="Enable online payment"
                        color="primary"
                      />
                    }
                    label={formatMessage({ id: "Enableonlinepayment" })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isB2b}
                        onChange={(e) => setFieldValue("isB2b", e.target.checked)}
                        name="Enable online payment"
                        color="primary"
                      />
                    }
                    label={formatMessage({ id: "B2B_carwah_Bussines" })}
                  />
                </div>
                <div className="col-md-6">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isB2c}
                        onChange={(e) => setFieldValue("isB2c", e.target.checked)}
                        name="Enable online payment"
                        color="primary"
                      />
                    }
                    label={formatMessage({ id: "not_b2c" })}
                  />
                </div>
                <div className="col-md-6">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isExtendFixedPrice}
                        onChange={(e) => setFieldValue("isExtendFixedPrice", e.target.checked)}
                        name="isExtendFixedPrice"
                        color="primary"
                      />
                    }
                    label={formatMessage({ id: "isExtendFixedPrice" })}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FileUploader
                    required
                    titleId="commercialRegistrationImage"
                    image={commercialRegistrationImage}
                    setImage={setcommercialRegistrationImage}
                    error={!!formik.submitCount && Boolean(errors?.commercialRegistrationImage)}
                  />
                </div>
                <div className="col-md-6">
                  <FileUploader
                    error={!!formik.submitCount && Boolean(errors?.licenceImage)}
                    required
                    titleId="licenceImage"
                    image={licenceImage}
                    setImage={setlicenceImage}
                  />
                  <ErrorMessage
                    condition={!!formik.submitCount && Boolean(errors?.licenceImage)}
                    errorMsg={errors.licenceImage}
                  />
                </div>
              </div>
              <>
                <div className="row">
                  <div className="col-md-6">
                    <FileUploader
                      error={!!formik.submitCount && Boolean(errors?.logo)}
                      required
                      titleId="logo"
                      image={logo}
                      setImage={setlogo}
                    />
                    <ErrorMessage
                      condition={!!formik.submitCount && Boolean(errors?.logo)}
                      errorMsg={errors.logo}
                    />
                  </div>
                  <div className="col-md-6">
                    <FileUploader
                      error={!!formik.submitCount && Boolean(errors?.logo)}
                      required
                      titleId="bankCardImage"
                      image={bankCardImage}
                      setImage={setBankCardImage}
                    />
                    <ErrorMessage
                      condition={!!formik.submitCount && Boolean(errors?.bankCardImage)}
                      errorMsg={errors.bankCardImage}
                    />
                  </div>
                </div>
              </>
              <div className="row">
                <FormLabel component="legend">
                  <FormattedMessage id="Car_delivery_service" />
                </FormLabel>
                {["canHandoverInAntherCity"].map((state) => (
                  <div className="col-md-4">
                    <FormControlLabel
                      control={<Checkbox row />}
                      checked={values.canHandoverInAntherCity}
                      label={formatMessage({ id: state })}
                      onChange={(e) => {
                        setFieldValue("canHandoverInAntherCity", !values.canHandoverInAntherCity);
                      }}
                    />
                  </div>
                ))}
              </div>
              {companyId &&
                companyDetailsRes?.allyCompany &&
                delivery.map((dd, index) => (
                  <div className="row" style={{ marginBottom: "15px" }}>
                    <div className="col-md-2">
                      {["isFree"].map((state) => (
                        <FormControlLabel
                          control={<Checkbox row />}
                          checked={delivery[index].isFree}
                          label={formatMessage({ id: state })}
                          onChange={(e) => {
                            const deliverd = [...delivery];
                            if (!e.target.checked) {
                              deliverd[index].isFree = false;
                            } else {
                              deliverd[index].isFree = true;
                              deliverd[index].price = 0;
                            }
                            SetDelivery(deliverd);
                          }}
                        />
                      ))}
                    </div>
                    <div className="col-md-2">
                      <BranchesDropDownWithArea
                        required={false}
                        multiple={false}
                        allyId={companyId}
                        valueAttribute="id"
                        selectedBranch={delivery[index].pickUpCityId}
                        setSelectedBranch={(Id) => {
                          const deliverd = [...delivery];
                          const Brancheschoosen = [...brancheschoosen];
                          deliverd[index].pickUpCityId = Id;
                          Brancheschoosen[index] = Id;
                          deliverd[index].dropOffCityId = null;
                          SetDelivery(deliverd);
                          setBrancheschoosen(Brancheschoosen);
                        }}
                      />
                    </div>
                    <div className="col-md-2">
                      <BranchesDropDownWithAreaForFilter
                        required={false}
                        multiple={false}
                        allyId={companyId}
                        valueAttribute="id"
                        required
                        choosenID={brancheschoosen[index]}
                        delivery={delivery}
                        selectedBranch={delivery[index].dropOffCityId}
                        setSelectedBranch={(Id) => {
                          const deliverd = [...delivery];
                          deliverd[index].dropOffCityId = Id;
                          SetDelivery(deliverd);
                        }}
                      />
                    </div>

                    <div className="col-md-2">
                      <CustomTextField
                        fullWidth
                        name="handoverprice"
                        // value={v}
                        disabled={delivery[index]?.isFree}
                        value={delivery[index]?.price}
                        onChange={(e) => {
                          const deliverd = [...delivery];
                          if (e.target.value.length) {
                            deliverd[index].price = parseFloat(e.target.value);
                          } else {
                            deliverd[index].price = 0;
                          }
                          SetDelivery(deliverd);
                        }}
                      />
                    </div>
                    <div className="col-md-2 d-flex" style={{ marginTop: "10px" }}>
                      {!index ? (
                        <AddIcon
                          className="mr-3 ml-3 pointer"
                          onClick={() => {
                            if (!values.canHandoverInAntherCity) {
                              return;
                            }
                            SetDelivery([...delivery, { isFree: false, price: 0 }]);
                          }}
                        />
                      ) : (
                        <DeleteForeverIcon
                          className="mr-3 ml-3 pointer"
                          onClick={() =>
                            SetDelivery([...delivery].filter((br, deindex) => deindex !== index))
                          }
                        />
                      )}
                      <ClearIcon className="pointer" onClick={() => clearInputs(delivery, index)} />
                    </div>
                  </div>
                ))}
            </form>
          </TabPanel>
          <TabPanel>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "isActive",
                      "isRequired",
                      "arTitle",
                      "enTitle",

                      "paytype",
                      "showfor",
                      "servicevalue",
                    ].map((data) => (
                      <TableCell>
                        <FormattedMessage id={data} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody style={{ maxHeight: 400, overflow: "auto" }}>
                  {((companyId &&
                    companyDetailsRes?.allyCompany &&
                    extraservice.length &&
                    companyservice.length) ||
                    (!companyId && extraservice.length)) &&
                    extraservice?.map((service, index) => (
                      <TableRow key={service.enName}>
                        <TableCell>
                          <FormControlLabel
                            control={<Checkbox row />}
                            checked={
                              companyId
                                ? companyservice.find(
                                    (cservice) =>
                                      +cservice.extraServiceId == +service.extraServiceId,
                                  )?.isActive
                                : service?.isActive
                            }
                            onChange={(e) => {
                              const services = [...extraservice];

                              if (companyId) {
                                const CompnayService = [...companyservice];
                                const existService = CompnayService.find(
                                  (cservice) =>
                                    +cservice.extraServiceId ==
                                    +extraservice[index]?.extraServiceId,
                                );
                                if (existService) {
                                  delete extraservice.enTitle;
                                  delete extraservice.arTitle;
                                  existService.isActive = !existService.isActive;
                                  setCompanyService([...CompnayService]);
                                  return;
                                }
                                const addedservice = services[index];

                                addedservice.isActive = e.target.checked;
                                delete addedservice.id;
                                const service = [addedservice].map((service) => ({
                                  extraServiceId: service.extraServiceId,
                                  isActive: service.isActive,
                                  payType: service.payType,
                                  serviceValue: service.serviceValue,
                                  showFor: service.showFor,
                                }));
                                Object.keys(companyservice[0]).length
                                  ? setCompanyService([...companyservice, ...service])
                                  : setCompanyService(service);

                                return;
                              }

                              services[index].isActive = !services[index].isActive;
                              setExtraService(services);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={<Checkbox row />}
                            checked={
                              companyId
                                ? companyservice.find(
                                    (cservice) =>
                                      +cservice.extraServiceId == +service.extraServiceId,
                                  )?.isRequired
                                : extraservice[index]?.isRequired
                            }
                            onChange={(e) => {
                              const services = [...extraservice];

                              if (companyId) {
                                const CompnayService = [...companyservice];
                                const existService = CompnayService.find(
                                  (cservice) => +cservice.extraServiceId == +service.extraServiceId,
                                );
                                if (existService) {
                                  existService.isRequired = e.target.checked;
                                  setCompanyService([...CompnayService]);
                                  return;
                                }
                                const addedservice = services[index];
                                addedservice.isRequired = e.target.checked;
                                addedservice.isActive = false;
                                setCompanyService([...companyservice, addedservice]);
                                return;
                              }
                              services[index].isRequired = e.target.check;
                              setExtraService(services);
                            }}
                          />
                        </TableCell>
                        <TableCell>{service.arTitle}</TableCell>
                        <TableCell>{service.enTitle}</TableCell>

                        <TableCell>
                          <Select
                            className="dropdown-select mb-4"
                            options={paytype(formatMessage)}
                            placeholder={formatMessage({ id: "paytype" })}
                            onChange={(selection) => {
                              const services = [...extraservice];
                              if (companyId) {
                                const CompnayService = [...companyservice];
                                const existService = CompnayService.find(
                                  (cservice) => +cservice.extraServiceId == +service.extraServiceId,
                                );
                                if (existService) {
                                  existService.payType = selection.value;
                                  setCompanyService([...CompnayService]);
                                  return;
                                }
                                const addedservice = services[index];
                                addedservice.payType = selection.value;
                                addedservice.isActive = false;
                                setCompanyService([...companyservice, addedservice]);
                                return;
                              }

                              services[index].payType = selection.value;
                              setExtraService(services);
                            }}
                            defaultValue={
                              companyId
                                ? paytype(formatMessage).find(
                                    (paytype) =>
                                      paytype.value ===
                                      companyservice.find(
                                        (cservice) =>
                                          +cservice.extraServiceId == +service.extraServiceId,
                                      )?.payType,
                                  )
                                  ? paytype(formatMessage).find(
                                      (paytype) =>
                                        paytype.value ===
                                        companyservice.find(
                                          (cservice) =>
                                            +cservice.extraServiceId == +service.extraServiceId,
                                        )?.payType,
                                    )
                                  : paytype(formatMessage).find(
                                      (paytype) => paytype.value === service.payType,
                                    )
                                : paytype(formatMessage).find(
                                    (paytype) => paytype.value === service.payType,
                                  )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            className="dropdown-select mb-4"
                            options={showFor(formatMessage)}
                            placeholder={formatMessage({ id: "showFor" })}
                            onChange={(selection) => {
                              const services = [...extraservice];
                              if (companyId) {
                                const CompnayService = [...companyservice];
                                const existService = CompnayService.find(
                                  (cservice) => +cservice.extraServiceId == +service.extraServiceId,
                                );
                                if (existService) {
                                  existService.showFor = selection.value;
                                  setCompanyService([...CompnayService]);
                                  return;
                                }
                                const addedservice = services[index];
                                addedservice.showFor = selection.value;
                                addedservice.isActive = false;
                                setCompanyService([...companyservice]);
                                return;
                              }

                              services[index].showFor = selection.value;
                              setExtraService(services);
                            }}
                            defaultValue={
                              companyId
                                ? showFor(formatMessage).find(
                                    (show) =>
                                      show.value ===
                                      companyservice.find(
                                        (cservice) =>
                                          +cservice.extraServiceId == +service.extraServiceId,
                                      )?.showFor,
                                  )
                                  ? showFor(formatMessage).find(
                                      (show) =>
                                        show.value ===
                                        companyservice.find(
                                          (cservice) =>
                                            +cservice.extraServiceId == +service.extraServiceId,
                                        )?.showFor,
                                    )
                                  : showFor(formatMessage).find(
                                      (show) => show.value == service.showFor,
                                    )
                                : showFor(formatMessage).find(
                                    (show) => show.value == service.showFor,
                                  )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            style={{ width: "150px" }}
                            fullWidth
                            name="serviceValue"
                            defaultValue={
                              companyId
                                ? companyservice.find(
                                    (cservice) =>
                                      +cservice.extraServiceId == +service.extraServiceId,
                                  )?.serviceValue
                                  ? companyservice.find(
                                      (cservice) =>
                                        +cservice.extraServiceId == +service.extraServiceId,
                                    )?.serviceValue
                                  : service.serviceValue
                                : service.serviceValue
                            }
                            onChange={(e) => {
                              const services = [...extraservice];
                              if (companyId) {
                                const CompnayService = [...companyservice];
                                const existService = CompnayService.find(
                                  (cservice) => +cservice.extraServiceId == +service.extraServiceId,
                                );
                                if (existService) {
                                  existService.serviceValue = +e.target.value;
                                  setCompanyService([...CompnayService]);
                                  return;
                                }
                                const addedservice = services[index];
                                addedservice.serviceValue = +e.target.value;
                                addedservice.isActive = false;

                                setCompanyService([...companyservice, addedservice]);
                                return;
                              }

                              services[index].serviceValue = +e.target.value;
                              setExtraService(services);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <div className="row">
              <div className="col-md-6">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isApiIntegrated}
                      onChange={(e) => setFieldValue("isApiIntegrated", e.target.checked)}
                      name="Is Integrated"
                      color="primary"
                    />
                  }
                  label={formatMessage({ id: "isApiIntegrated" })}
                />
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
      <div className="pt-25 text-right" style={{ marginTop: "30px" }}>
        <button
          variant="contained"
          color="primary"
          className="btn btn-primary mr-4"
          type="submit"
          disabled={creatingAlly || uploading || EditingAllyCompany}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleSubmit}
        >
          <FormattedMessage id="button.save" />
        </button>
        <button
          type="button"
          className="btn btn-danger mr-15 text-white"
          onClick={() => {
            history.push("/cw/dashboard/companies");
            resetForm();
          }}
          disabled={creatingAlly || uploading || EditingAllyCompany}
        >
          <FormattedMessage id="button.cancel" />
        </button>
        {progress === 100 ||
          ((uploading || creatingAlly) && progress > 0 && progress <= 100 && (
            <CircularProgressWithLabel value={progress} />
          ))}
      </div>
    </>
  );
}

export default CreateEditAllyCompany;
