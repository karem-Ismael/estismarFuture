/* eslint-disable prettier/prettier */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undefined */
/** Add/Edit Customer */
import React, { useState, useRef, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import { AddCustomerMutation, EditCustomerMutation } from "gql/mutations/User.mutations.gql";
import { GetNationalities } from "gql/queries/Nationalities.query.gql";
import { CustomerStatuses } from "gql/queries/CustomerStatus.gql";
import DatePicker, { utils } from "react-modern-calendar-datepicker";
import { MuiPickersUtilsProvider, DatePicker as MaterialDatePicker } from "@material-ui/pickers";
import PhoneInput from "react-phone-input-2";

import IntlTelInput from "react-intl-tel-input";
import { CreateCustomerValidation } from "validations/User.validations";
import CustomTextField from "components/Input/CustomTextField";
import { ClickAwayListener, TextField } from "@material-ui/core";
import { ErrorMessage } from "components/shared/ErrorMessage";
import { CitiesDropDown } from "components/DropDowns";
import GenderDropDown from "components/DropDowns/GenderDropDown";
import CustomerStatus from "components/DropDowns/CustomerStatus";
import { GetAllyDropDown } from "gql/queries/Ally.queries.gql";

import Select from "react-select";
import { DatePickerCustomInputSingle } from "components/DatePickerCustomInput/DatePickerCustomInput";
import { persist, titlesOptions } from "constants/constants";
import UPLOAD_IMAGE from "gql/mutations/UploadImage.gql";
import { FileUploader } from "components/ImageUploader";
import { dateFormat, dateStringToObject, getPageFromHash } from "functions";
import { GetCustomerDetailsQuery, GetUsersList } from "gql/queries/Users.queries.gql";
import { CircularProgressWithLabel } from "components/CircularProgressWithLabel";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import "./style1.css";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { Autocomplete } from "@material-ui/lab";

import AsyncLoader from "components/AutoComplete/AsyncLoader";
import "moment/locale/ar-sa";
import HijriUtilsExtended from "./HijriUtilsExtended";
import "moment/locale/en-au";
import { addCustomerInitValues } from "./AddEditCustomer.model";

function CreateEditUser() {
  const { customerId } = useParams();
  const [hijriDOB, setHijriDOB] = useState(null);
  const [hijrinationalIdExpireDate, setHijriNationalIdExpireDate] = useState(null);
  const [hijridriverLicenceExpireDate, setHijriDriverLicenceExpireDate] = useState(null);


  const [gregorainDOB, setGregorainDOB] = useState(null);
  const [passportExpireDateHijri, setpassportExpireDateHijri] = useState(null);


  const history = useHistory();
  const { locale } = useIntl();
  const selectInputRef = useRef();
  const mobileReactRef = useRef();
  const { formatMessage } = useIntl();
  const [licenseSelfieImage, setLicenseSelfieImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [nidImage, setNidImage] = useState("");

  const [licenseFrontImage, setLicenseFrontImage] = useState("");
  const [passportFrontImage, setPassportFrontImage] = useState("");
  const [mobileDisplay, setMobileDisplay] = useState("");
  const [businessCard, setBusinessCard] = useState("");
  const [phoneValidity, setPhoneValidity] = useState(false);
  const [nationalitiesOptions, setNationalitiesOptions] = useState([]);
  const today = utils().getToday();
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(getPageFromHash(history) || 1);
  const [limit, setLimit] = useState(persist.initLimit);
  const [showPicker, setShowPicker] = useState(true);
  const [showPicker2, setShowPicker2] = useState(true);
  const [showPicker6,setShowPicker6]=useState(true)
  const [showPicker3, setShowPicker3] = useState(true);
  const [showPicker7, setShowPicker7] = useState(true);

  
  const [showPicker4, setShowPicker4] = useState(true);
  const [showPicker5, setShowPicker5] = useState(true);

  const [gulfCitizen, setGulf] = useState(false);
  const [blockingAllies, setBlockingAllies] = useState([]);

  const {
    data: nationalitiesRes,
    refetch: fetchNationalities,
    loading: gettingNationalities,
  } = useQuery(GetNationalities, { variables: { isGulf: gulfCitizen } });
  const { data: AllyDropDownRes, loading: gettingAllies } = useQuery(GetAllyDropDown);
  const { data: customerstatus } = useQuery(CustomerStatuses);
  const [CreateNewUserMutation, { loading: creatingUser }] = useMutation(AddCustomerMutation);
  const [EditUserMutation, { loading: EditingUser }] = useMutation(EditCustomerMutation);
  const [uploadImageMutation, { loading: uploading }] = useMutation(UPLOAD_IMAGE);
  const [cstatus, setCStatus] = useState([]);
  const [visaImage,setvisaImage]=useState("")
  const blockingStatusOptions = [
    { label: formatMessage({ id: "unblocked" }), value: null },
    { label: formatMessage({ id: "blocked" }), value: "blocked" },
    { label: formatMessage({ id: "partially_blocked" }), value: "partially_blocked" },
  ];
  // START EDIT PROCESS
  // FOR EDIT MODE
  const [
    getCustomerDetailsQuery,
    { data: customerDetailsRes, refetch: RefetchCustomer },
  ] = useLazyQuery(GetCustomerDetailsQuery, {
    skip: !customerId,
    variables: { id: +customerId, type: "customers" },
  });

  const titleValue = (title) => {
    if (title === "السيد") {
      return "Mr";
    }
    if (title === "السيدة") {
      return "Ms";
    }
    return title;
  };
  useEffect(() => {
    moment.locale(locale === "ar" ? "ar" : "en-au");
  }, [locale]);

  useEffect(() => {
    if (customerId) getCustomerDetailsQuery();
  }, [customerId]);

  useEffect(() => {
    if (customerDetailsRes?.user) {
      const { customerProfile: user, mobile, isActive, profileImage } = customerDetailsRes?.user;
      setFieldValue("companyName", user.companyName || addCustomerInitValues.companyName);
    
      setFieldValue("driverLicense", user.driverLicense || addCustomerInitValues.driverLicense);
      setFieldValue("email", user.email || addCustomerInitValues.email);
      setFieldValue("firstName", user.firstName || addCustomerInitValues.firstName);
      setFieldValue("gender", user.gender || addCustomerInitValues.gender);
      setFieldValue("isActive", isActive === true ? "active" : "inactive");
      setFieldValue("lastName", user.lastName || addCustomerInitValues.lastName);
      setFieldValue("middleName", user.middleName || addCustomerInitValues.middleName);
      setFieldValue("blockingStatus", user.blockingStatus || addCustomerInitValues.blockingStatus);
      setFieldValue("blockingAllies", user.blockingAllies || addCustomerInitValues.blockingAllies);
      setFieldValue("blockingReason", user.blockingReason || addCustomerInitValues.blockingReason);
      setMobileDisplay(mobile); // works for numers start with 966 & won't be suitable for numbers from other countries
      setFieldValue("mobile", mobile || addCustomerInitValues.mobile); // works for numers start with 966 & won't be suitable for numbers from other countries
      setPhoneValidity(true);
      setFieldValue(
        "nationalIdVersion",
        user.nationalIdVersion || addCustomerInitValues.nationalIdVersion,
      );
      setFieldValue("nationalityId", user?.nationality?.id || addCustomerInitValues.nationalityId);
      setFieldValue("nid", user.nid || addCustomerInitValues.nid);
      setFieldValue("passportNumber", user.passportNumber || addCustomerInitValues.passportNumber);
      setFieldValue("status", user.status || addCustomerInitValues.status);
      if (user.status == "gulf_citizen") {
        setGulf(true);
      }
      setFieldValue("title", titleValue(user.title) || addCustomerInitValues.title);
      // dates
      setFieldValue("dob", user.dob ? user.dob : addCustomerInitValues.dob);
      setHijriDOB(user.dob ? user.dob : addCustomerInitValues.dob);
      setFieldValue(
        "driverLicenseExpireAt",
        user.driverLicenseExpireAt
          ? moment(user.driverLicenseExpireAt).locale("en").format("MM/DD/YYYY HH:mm:ss")
          : addCustomerInitValues.driverLicenseExpireAt,
      );
      setHijriDriverLicenceExpireDate(user.driverLicenseExpireAt
        ? moment(user.driverLicenseExpireAt).locale("en").format("MM/DD/YYYY HH:mm:ss")
        : addCustomerInitValues.driverLicenseExpireAt)

      setFieldValue(
        "passportExpireAt",
        user.passportExpireAt
          ? moment(user.passportExpireAt).locale("en").format("MM/DD/YYYY HH:mm:ss")
          : addCustomerInitValues.passportExpireAt,
      );
      setpassportExpireDateHijri( user.passportExpireAt ? moment(user.passportExpireAt).locale("en").format("MM/DD/YYYY HH:mm:ss") : addCustomerInitValues.passportExpireAt)
      setFieldValue(
        "nationalIdExpireAt",
        user.nationalIdExpireAt
          ? moment(user.nationalIdExpireAt).locale("en").format("MM/DD/YYYY HH:mm:ss")
          : addCustomerInitValues.nationalIdExpireAt,
      );
      setHijriNationalIdExpireDate(user.nationalIdExpireAt)
      setFieldValue("customerClass", user.customerClass || addCustomerInitValues.customerClass);
        setFieldValue("borderNumber",user.borderNumber)
      // Images
      setBusinessCard(user.businessCard);
      setNidImage(user.nidImage)
      setvisaImage(user.visaImage)
      setLicenseFrontImage(user.licenseFrontImage);
      setPassportFrontImage(user.passportFrontImage);
      setLicenseSelfieImage(user.licenseSelfieImage);
      setProfileImage(profileImage);
    }

    return () => {
      setBusinessCard("");
      setLicenseFrontImage("");
      setPassportFrontImage("");
      setLicenseSelfieImage("");
      setProfileImage("");
    };
  }, [customerDetailsRes]);
  // END EDIT PROCESS

  useEffect(() => {
    if (businessCard) setFieldValue("businessCard", businessCard);
    if (licenseSelfieImage) setFieldValue("licenseSelfieImage", licenseSelfieImage);
    if (licenseFrontImage) setFieldValue("licenseFrontImage", licenseFrontImage);
    if (passportFrontImage) setFieldValue("passportFrontImage", passportFrontImage);
    if (profileImage) setFieldValue("profileImage", profileImage);
    if(nidImage) setFieldValue("nidImage",nidImage)
    if(visaImage)setFieldValue("visaImage",visaImage)
  }, [licenseSelfieImage, licenseFrontImage, passportFrontImage, businessCard, profileImage,nidImage,visaImage]);

  const formik = useFormik({
    initialValues: addCustomerInitValues,
    validationSchema: CreateCustomerValidation,

    onSubmit: async (values) => {
      if (!phoneValidity) return;
      if (values?.blockingStatus === "partially_blocked" && !values?.blockingAllies?.length) return;
      if (values?.blockingStatus === "partially_blocked" && !values?.blockingReason) return;
      const { dob, nationalIdExpireAt, driverLicenseExpireAt, passportExpireAt } = values;

      setProgress(12 || progress);
      // nidImage 
      if(!values.nidImage?.startsWith("http") && values.nidImage?.length){

        await uploadImageMutation({
          variables: { image: values.nidImage, topic: "nationalidImage" },
        })
          .then((res) => {
            values.nidImage = res.data.imageUpload.imageUpload.imageUrl;
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
      if(!values.visaImage?.startsWith("http") && values.visaImage?.length){

        await uploadImageMutation({
          variables: { image: values.visaImage, topic: "visaImage" },
        })
          .then((res) => {
            values.visaImage = res.data.imageUpload.imageUpload.imageUrl;
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
      
      // License Front Image
      if (!values.licenseFrontImage.startsWith("http")) {
        await uploadImageMutation({
          variables: { image: values.licenseFrontImage, topic: "licenseFrontImage" },
        })
          .then((res) => {
            values.licenseFrontImage = res.data.imageUpload.imageUpload.imageUrl;
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

      // License Selfie Image
      if (!values.licenseSelfieImage.startsWith("http") && values.licenseSelfieImage.length) {
        await uploadImageMutation({
          variables: { image: values.licenseSelfieImage, topic: "licenseSelfieImage" },
        })
          .then((res) => {
            values.licenseSelfieImage = res.data.imageUpload.imageUpload.imageUrl;
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

      // Business Card
      if (!values.businessCard?.startsWith("http") && values.businessCard?.length > 0) {
        await uploadImageMutation({
          variables: { image: values.businessCard, topic: "businessCard" },
        })
          .then((res) => {
            values.businessCard = res.data.imageUpload.imageUpload.imageUrl;
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

      // Passport Front Image
      if (!values.passportFrontImage?.startsWith("http")) {
        if (values.status === "visitor") {
          await uploadImageMutation({
            variables: { image: values.passportFrontImage, topic: "passportFrontImage" },
          })
            .then((res) => {
              values.passportFrontImage = res.data.imageUpload.imageUpload.imageUrl;
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
      }

      if (!values.profileImage?.startsWith("http") && values.profileImage?.length > 0) {
        await uploadImageMutation({
          variables: { image: values.profileImage, topic: "profileImage" },
        })
          .then((res) => {
            values.profileImage = res.data.imageUpload.imageUpload.imageUrl;
            setProgress((progress) => progress + 10);
          })
          .catch((err) => {
            if (err?.message) NotificationManager.error(err?.message);
            for (const iterator of err?.message) {
              NotificationManager.error(iterator);
            }
            setProgress(0);
          });
      }

      const variables = {
        ...values,
        blockingStatus: values?.blockingStatus || null,
        blockingAllies:
          values?.blockingStatus === "partially_blocked"
            ? values?.blockingAllies.map((i) => i.id || i) || undefined
            : undefined,
        blockingReason:
          values?.blockingStatus === "partially_blocked" ? values?.blockingReason : undefined,
        dob: gregorainDOB
          ? `${
              moment(gregorainDOB)?.date() < 10
                ? `0${moment(gregorainDOB)?.date()}`
                : moment(gregorainDOB)?.date()
            }/${
              moment(gregorainDOB)?.month() + 1 < 10
                ? `0${moment(gregorainDOB)?.month() + 1}`
                : moment(gregorainDOB)?.month() + 1
            }/${moment(gregorainDOB)?.year()}`
          : null,
        // eslint-disable-next-line no-unneeded-ternary
        isActive: values.isActive === "active" ? true : false,
        nid: values.nid.toString(),
        driverLicenseExpireAt: Object.keys(driverLicenseExpireAt).length
          ? moment(driverLicenseExpireAt).locale("en").format("DD/MM/YYYY")
          : null,
        driverLicense: values.driverLicense,
        businessCard: values?.businessCard || "",
        passportExpireAt:
          values.status === "citizen" ||
          values.status == "resident" ||
          values.status == "gulf_citizen"
            ? undefined
            : values.passportExpireAt.length == 0
            ? ""
            : moment(passportExpireAt).locale("en").format("DD/MM/YYYY")
            ,
        passportNumber:
          values.status === "citizen" ||
          values.status == "resident" ||
          values.status == "gulf_citizen"
            ? undefined
            : values.passportNumber,
        passportFrontImage: values.status === "citizen" ? "" : values.passportFrontImage,
        nationalityId:
          values.status === "citizen"
            ? ""
            : +values.nationalityId == 0
            ? undefined
            : +values.nationalityId,
        nationalIdExpireAt: values.status !="visitor" &&  Object.keys(nationalIdExpireAt)?.length
          ? moment(nationalIdExpireAt).locale("en").format("DD/MM/YYYY")
          : undefined,
        nationalIdVersion:
          values.status != "visitor" && values.nationalIdVersion != 0
            ? +values.nationalIdVersion
            : undefined,
      };

      if (!customerId) {
        if(!values.borderNumber?.length && !values.passportNumber?.length  &&values.status == "visitor" ){
          NotificationManager.error(<FormattedMessage id="passportNumber or borderNumber required "/>)
          return
        }
        // Create New User/CUSTOMRT
        await CreateNewUserMutation({ variables: { ...variables } })
          .then(() => {
            setProgress(100);
            NotificationManager.success(formatMessage({ id: "success.create.user" }));
            history.push("/cw/dashboard/customers");
          })
          .catch((err) => {
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator);
            }
          });
      } else {
        // EDIT EXISTIGN User/CUSTOMRT
        if(!values.borderNumber?.length && !values.passportNumber?.length  && values.status == "visitor" ){
          NotificationManager.error(<FormattedMessage id="passportNumber or borderNumber required "/>)
          return
        }
        await EditUserMutation({
          variables: {
            ...variables,
            userId: customerId,
            profileImage: values.profileImage?.length ? values.profileImage : undefined,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.edit.user" }));
            setTimeout(() => {
              RefetchCustomer();
              history.push("/cw/dashboard/customers");
            }, 100);
            setProgress(100);
          })
          .catch((err) => {
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
    setFieldTouched,
  } = formik;
  function handleChange(e) {
    e.target.value = e.target.value.trimStart();
    handleFormikChange(e);
  }

  function resetForm() {
    formik.resetForm();
  }

  useEffect(() => {
    setNationalitiesOptions(
      nationalitiesRes?.nationalities?.map((nationality) => ({
        label: nationality[`${locale}Name`],
        value: nationality.id,
      })),
    );
  }, [nationalitiesRes]);
  useEffect(() => {
    if (customerstatus?.customerStatuses.length) {
      const status = customerstatus?.customerStatuses.map((cstatus) => ({
        label: cstatus.value,
        value: cstatus.key,
      }));
      setCStatus(status);
    }
  }, [customerstatus?.customerStatuses?.length]);

  useEffect(() => {
    if (gregorainDOB) setHijriDOB(gregorainDOB);
    setFieldValue("dob", gregorainDOB);
  }, [gregorainDOB]);
  useEffect(() => {
    if (hijrinationalIdExpireDate) setHijriNationalIdExpireDate(hijrinationalIdExpireDate);
    setFieldValue("nationalIdExpireAt", hijrinationalIdExpireDate);
   
  }, [hijrinationalIdExpireDate]);


  useEffect(() => {
    if (hijriDOB) {
      setGregorainDOB(hijriDOB);
    }
  }, [hijriDOB]);
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>
          {formatMessage({
            id: customerId ? "EditCustomer" : "addCustomer",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={customerId ? "EditCustomer" : "addCustomer"} />}
        match={location}
        lastElement={customerId || <IntlMessages id="addCustomer" />}
        enableBreadCrumb
      />
      <form onSubmit={handleSubmit}>
        <div className="row ">
          <div className="col-md-6">
            <CustomTextField
              fullWidth
              required
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              error={touched.firstName && Boolean(errors.firstName)}
              errormsg={touched.firstName && errors.firstName}
            />
          </div>
          <div className="col-md-6">
            <CustomTextField
              fullWidth
              name="middleName"
              value={values.middleName}
              onChange={handleChange}
              error={touched.middleName && Boolean(errors.middleName)}
              errormsg={touched.middleName && errors.middleName}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <CustomTextField
              required
              fullWidth
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              error={touched.lastName && Boolean(errors.lastName)}
              errormsg={touched.lastName && errors.lastName}
            />
          </div>
          <div className="col-md-6">
            {/* <CustomTextField
              fullWidth
              required
              type="text"
              value={values.email}
              onChange={(e) => setFieldValue("email", e.target.value)}
              // error={touched.email && Boolean(errors.email)}
              // errormsg={touched.email && errors.email}
              placeholder="example@mail.com"
            /> */}
            <CustomTextField
              required
              fullWidth
              name="email"
              value={values.email}
              onChange={handleChange}
              error={touched.email && Boolean(errors.email)}
              errormsg={touched.email && errors.email}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6" dir="ltr">
            {/* <IntlTelInput
              fieldId="input-tel"
              inputClassName={
                !phoneValidity && (values.mobile > 0 || formik.submitCount > 0) ? "input-error" : ""
              }
              separateDialCode
              telInputProps={{ pattern: "[0-9]*", autoComplete: "off" }}
              ref={mobileReactRef}
              preferredCountries={["sa"]}
              containerClassName="intl-tel-input"
              placeholder="512345678*"
              value={mobileDisplay}
              // onPhoneNumberFocus={(isValid) => setPhoneValidity(isValid)}
              onPhoneNumberChange={(isValid, num, obj, fullNum) => {
                if (/^[0-9]+$/.test(num.toString()) || num === "") {
                  setFieldValue("mobile", fullNum.replace(/\D/gm, ""));
                  setMobileDisplay(num);
                } else {
                  setFieldValue("mobile", values.mobile);
                  setMobileDisplay(mobileDisplay);
                }
                setPhoneValidity(isValid);
              }}
            /> */}
            <PhoneInput
              country="sa"
              placeholder="512345678*"
              onlyCountries={["sa"]}
              value={mobileDisplay}
              isValid={(value, country) => {
                if (value.toString().length != 12 && !!formik.submitCount) {
                  setPhoneValidity(false);
                  return false;
                }
                setPhoneValidity(true);
                return true;
              }}
              onChange={(phone) => {
                if (/^[0-9]+$/.test(phone.toString()) || phone === "") {
                  setFieldValue("mobile", phone.replace(/\D/gm, ""));
                  setMobileDisplay(phone);
                } else {
                  setFieldValue("mobile", values.mobile);
                  setMobileDisplay(mobileDisplay);
                }
              }}
              countryCodeEditable={false}
            />
            <ErrorMessage
            locale={locale}
              condition={!!formik.submitCount && !phoneValidity}
              errorMsg="validation.invalidMobileNumber"
            />
          </div>
          <div className="col-md-6">
            <CustomTextField
              fullWidth
              name="companyName"
              value={values.companyName}
              onChange={handleChange}
              error={touched.companyName && Boolean(errors.companyName)}
              errormsg={touched.companyName && errors.companyName}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <GenderDropDown
              error={!!formik.submitCount && Boolean(errors?.gender)}
              selectedGender={values?.gender}
              setSelecteGender={(id) => setFieldValue("gender", id)}
            />
          </div>
          <div className="col-md-6">
            <Select
              className={`dropdown-select ${errors.status ? "selection-error" : ""}`}
              options={cstatus}
              value={[cstatus.find((optn) => `${optn.value}` == `${values.status}`)]}
              placeholder={formatMessage({ id: "status" })}
              onChange={(selection) => {
                if (selection?.value == "gulf_citizen") {
                  setGulf(true);
                } else {
                  setGulf(false);
                }
                setFieldValue("status", selection?.value);
              }}
            />
          </div>
          <div className="col-md-6 mt-4 mb-2">
            <Select
              className={`dropdown-select ${errors?.blockingStatus ? "selection-error" : ""}`}
              options={blockingStatusOptions}
              defaultValue={{ label: formatMessage({ id: "unblocked" }), value: null }}
              value={[
                blockingStatusOptions.find(
                  (optn) => `${optn.value}` == `${values?.blockingStatus}`,
                ) || { label: formatMessage({ id: "unblocked" }), value: null },
              ]}
              placeholder={formatMessage({ id: "Blocking status" })}
              onChange={(selection) => {
                setFieldValue("blockingStatus", selection?.value);
              }}
            />
          </div>
          {values?.blockingStatus === "partially_blocked" && (
            <>
              <div className="col-md-6 mt-4 mb-2 d-flex flex-column" id="ally-companies-customer">
                <Autocomplete
                  key={AllyDropDownRes?.allyCompanies?.collection}
                  id="ally-companies-dd"
                  name="blockingAllies"
                  options={AllyDropDownRes?.allyCompanies?.collection || []}
                  getOptionLabel={(option) => option?.name}
                  value={AllyDropDownRes?.allyCompanies?.collection?.filter((obj) =>
                    values?.blockingAllies
                      .map((i) => Number(i?.id) || Number(i))
                      ?.includes(Number(obj.id)),
                  )}
                  disableClearable
                  multiple
                  onChange={(e, selection) => {
                    setTimeout(() => {
                      setFieldValue("blockingAllies", selection);
                    }, 100);
                  }}
                  loading={gettingAllies}
                  renderInput={(p) => (
                    <AsyncLoader
                      params={p}
                      labelId="bookings.list.allyName"
                      loading={gettingAllies}
                    />
                  )}
                />
                <ErrorMessage
                locale={locale}
                  condition={!!formik.submitCount && !values?.blockingAllies?.length}
                  errorMsg="thisfieldisrequired"
                />
              </div>
              <div className="col-md-6 mt-4 mb-2 d-flex flex-column">
                <textarea
                  name="blockingReason"
                  style={{ borderRadius: "5px", borderColor: "#bfbfc0" }}
                  placeholder={formatMessage({ id: "Blocking reason" })}
                  value={values?.blockingReason}
                  onChange={(e) => setFieldValue("blockingReason", e.target.value)}
                />
                <ErrorMessage
                locale={locale}
                  condition={!!formik.submitCount && !values?.blockingReason}
                  errorMsg="thisfieldisrequired"
                />
              </div>
            </>
          )}
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <CustomerStatus
              error={!!formik.submitCount && Boolean(errors?.is_active)}
              valueAttribute="id"
              selectedStatus={values?.isActive}
              setSelecteStatus={(id) => setFieldValue("isActive", id)}
            />
          </div>
          {values.status === "citizen" ||
          values.status == "resident" ||
          values.status == "gulf_citizen" ? (
            <div className="col-md-6">
              <CustomTextField
                name="nid"
                label={
                  values.status == "citizen" ? (
                    <FormattedMessage id="nid.label" />
                  ) : values.status == "resident" ? (
                    <FormattedMessage id="iqama.no" />
                  ) : (
                    <FormattedMessage id="Gulf_ID" />
                  )
                }
                placeholder={
                  values.status == "citizen"
                    ? formatMessage({ id: "nid.placeholder" })
                    : values.status == "resident"
                    ? formatMessage({ id: "iqama.no" })
                    : formatMessage({ id: "Gulf_ID" })
                }
                required
                className="custom-textfield"
                type="text"
                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                value={values.nid}
                onChange={handleChange}
                error={touched.nid && Boolean(errors.nid)}
                errormsg={touched.nid && errors.nid}
              />
            </div>
          ) : (
            <div className="col-md-6">
              {(!customerId || (customerId && nationalitiesOptions?.length)) && (
                <Select
                  className={`dropdown-select mb-4  ${
                    touched.nationalityId && Boolean(errors.nationalityId) ? "selection-error" : ""
                  }`}
                  options={nationalitiesOptions}
                  ref={selectInputRef}
                  placeholder={formatMessage({ id: "nationality" })}
                  onChange={(selection) => {
                    setFieldValue("nationalityId", selection?.value);
                  }}
                  defaultValue={
                    (customerId &&
                      nationalitiesOptions?.find(
                        (nat) =>
                          `${nat?.value}` ===
                          `${customerDetailsRes?.user?.customerProfile?.nationality?.id}`,
                      )) ||
                    null
                  }
                />
              )}
              <ErrorMessage
              locale={locale}
                condition={!!formik.submitCount && Boolean(errors?.nationalityId)}
                errorMsg={errors.nationalityId}
              />
            </div>
          )}
          {(values.status == "gulf_citizen" || values.status == "resident") && (
            <>
              <div className="col-md-6">
                {(!customerId || (customerId && nationalitiesOptions?.length)) && (
                  <Select
                    className={`dropdown-select mb-4  ${
                      touched.nationalityId && Boolean(errors.nationalityId)
                        ? "selection-error"
                        : ""
                    }`}
                    options={nationalitiesOptions}
                    ref={selectInputRef}
                    placeholder={formatMessage({ id: "nationality" })}
                    onChange={(selection) => {
                      setFieldValue("nationalityId", selection?.value);
                    }}
                    defaultValue={
                      (customerId &&
                        nationalitiesOptions?.find(
                          (nat) =>
                            `${nat?.value}` ===
                            `${customerDetailsRes?.user?.customerProfile?.nationality?.id}`,
                        )) ||
                      null
                    }
                  />
                )}
                <ErrorMessage
                locale={locale}
                  condition={!!formik.submitCount && Boolean(errors?.nationalityId)}
                  errorMsg={errors.nationalityId}
                />
              </div>
            </>
          )}
          {(values.status == "citizen" || values.status == "resident") && (
            <div className="col-md-6">
              {(!customerId || customerId) && (
                <CustomTextField
                  name="nationalIdVersion"
                  className="custom-textfield"
                  type="number"
                  required={values.status == "resident"}
                  value={values.nationalIdVersion}
                  onChange={handleChange}
                  error={touched.nationalIdVersion && Boolean(errors.nationalIdVersion)}
                />
              )}
              <ErrorMessage
              locale={locale}
                condition={!!formik.submitCount && Boolean(errors?.nationalIdVersion)}
                errorMsg={errors.nationalIdVersion}
              />
            </div>
          )}
        </div>

        {/* CITIZEN ONLY */}
        {(values.status === "citizen" ||
          values.status == "gulf_citizen" ||
          values.status == "resident") && (
          <>
            <div className="row">
              <ClickAwayListener
                onClickAway={() => {
                  setShowPicker(!showPicker);
                }}
              >
                <div className="col-md-6 date" key={showPicker}>
             
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
                    <MaterialDatePicker
                      okLabel={formatMessage({ id: "ok" })}
                      cancelLabel={formatMessage({ id: "cancel" })}
                      clearLabel={formatMessage({ id: "clear" })}
                    inputVariant="outlined"

                      clearable
                      style={{ width: "100%" }}
                      onChange={(date) => {
                        // setGregorainDOB(date);
                        // setFieldValue("dob", date);
                        setFieldValue("nationalIdExpireAt", date);
                        setHijriNationalIdExpireDate(date)
                      }}
                      required
                      value={values?.nationalIdExpireAt ? values?.nationalIdExpireAt : null}
                      disablePast
                      // value={values.dob}
                      // className={!values.dob ? "required astrik" : ""}
                      // name="dob"
                      placeholder={
                        values.status == "gulf_citizen"
                          ? formatMessage({ id: "GulfIdExpireAt" })
                          : values.status == "resident"
                          ? formatMessage({ id: "iqamaIdExpireAt" })
                          : formatMessage({ id: "nationalIdExpireAt" })
                      }
                      label={
                        values.status == "gulf_citizen"
                        ? formatMessage({ id: "GulfIdExpireAt" })
                        : values.status == "resident"
                        ? formatMessage({ id: "iqamaIdExpireAt" })
                        : formatMessage({ id: "nationalIdExpireAt" })
                      }
                      renderInput={(props) => <TextField
                         {...props} 
                      
                      />}
                      openTo="year"
                      views={["year", "month", "date"]}
                      format="DD-MM-YYYY"
                    />
                  </MuiPickersUtilsProvider>
                  <ErrorMessage
                  locale={locale}
                    condition={!!formik.submitCount && Boolean(errors?.nationalIdExpireAt)}
                    errorMsg={errors.nationalIdExpireAt}
                  />
                </div>
              </ClickAwayListener>
              <ClickAwayListener
                onClickAway={() => {
                  setShowPicker5(!showPicker5);
                }}
              >
                <div className="col-md-6 date" key={showPicker5 }>

                   <MuiPickersUtilsProvider
                  libInstance={moment}
                  utils={HijriUtilsExtended}
                  locale={locale}
                  required
                >
                  <MaterialDatePicker
                    key={locale}
                    minDate="1937-03-14"
                    maxDate="2076-11-26"
                    clearable
                    // variant="outlined"
                    inputVariant="outlined"
                    
                    okLabel={formatMessage({ id: "ok" })}
                    cancelLabel={formatMessage({ id: "cancel" })}
                    clearLabel={formatMessage({ id: "clear" })}
                    labelFunc={(date) => (date ? date.locale(locale).format("iDD-iMM-iYYYY") : "")}
                    style={{ width: "100%" }}
                    value={hijrinationalIdExpireDate || null}
                    onChange={(date) => setHijriNationalIdExpireDate(date)}
                    name="dob_hijri"
                    variant="dialog"
                    emptyLabel={ values.status == "gulf_citizen"
                    ? formatMessage({ id: "GulfIdExpireAt" })
                    : values.status == "resident"
                    ? formatMessage({ id: "iqamaIdExpireAt" })
                    : formatMessage({ id: "nationalIdExpireAt-hijri" })}
                    label={ values.status == "gulf_citizen"
                    ? formatMessage({ id: "GulfIdExpireAt" })
                    : values.status == "resident"
                    ? formatMessage({ id: "iqamaIdExpireAt" })
                    : formatMessage({ id: "nationalIdExpireAt-hijri" })}
                    placeholder={
                      values.status == "gulf_citizen"
                      ? formatMessage({ id: "GulfIdExpireAt" })
                      : values.status == "resident"
                      ? formatMessage({ id: "iqamaIdExpireAt" })
                      : formatMessage({ id: "nationalIdExpireAt-hijri" })
                    }
                    disablePast
                    renderInput={(props) => (
                      <TextField {...props} label="Next appointment"   required />
                    )}
                    openTo="year"
                    views={["year", "month", "date"]}
                    format="DD-MM-YYYY"
                  />
                </MuiPickersUtilsProvider>
                  <ErrorMessage
                  locale={locale}
                    condition={!!formik.submitCount && Boolean(errors?.nationalIdExpireAt)}
                    errorMsg={errors.nationalIdExpireAt}
                  />
                </div>
              </ClickAwayListener>
              {/* <div className="col-md-6">
                {(!customerId || (customerId && customerDetailsRes?.user)) && (
                  <>
                    <CitiesDropDown
                      error={!!formik.submitCount && Boolean(errors?.cityId)}
                      valueAttribute="id"
                      selectedCity={values?.cityId?.id}
                      setSelectedCity={(id) => setFieldValue("cityId", id)}
                      errormsg={errors?.cityId?.id}
                    />
                    <ErrorMessage
                    
                    locale={locale}
                      condition={!!formik.submitCount && Boolean(errors?.cityId)}
                      errorMsg={errors?.cityId?.id || errors?.cityId}
                    />
                  </>
                )}
              </div> */}
            </div>
          </>
        )}
        {/* COMMON Between citizen & visitor */}
        {values.status === "visitor" && (
          <>
            <div className="row">
              <div className="col-md-6">
                <CustomTextField
                  name="passportNumber"
                  value={values.passportNumber}
                  onChange={handleChange}
                  error={touched.passportNumber && Boolean(errors.passportNumber)}
                  errormsg={touched.passportNumber && errors.passportNumber}
                />
              </div>
              <div className="col-md-6">
                <CustomTextField
                  name="borderNumber"
                  value={values.borderNumber}
                  onChange={handleChange}
                  error={touched.borderNumber && Boolean(errors.borderNumber)}
                  errormsg={touched.borderNumber && errors.borderNumber}
                />
              </div>

          
            </div>
            <div className="row">
            <ClickAwayListener
                onClickAway={() => {
                  setShowPicker2(!showPicker2);
                }}
              >
                <div className="col-md-6" key={showPicker2}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
                    <MaterialDatePicker
                      okLabel={formatMessage({ id: "ok" })}
                      cancelLabel={formatMessage({ id: "cancel" })}
                      clearLabel={formatMessage({ id: "clear" })}
                      clearable
                      style={{ width: "100%" }}
                      required
                    inputVariant="outlined"
                      onChange={(date) => {
                        
                        setFieldValue("passportExpireAt", date);
                        setpassportExpireDateHijri(date)

                      }}
                      value={values?.passportExpireAt ? values?.passportExpireAt : null}
                      disablePast
                      // value={values.dob}
                      // className={!values.dob ? "required astrik" : ""}
                      // name="dob"
                      placeholder={formatMessage({ id: "passportExpireAt" })}
                      label={formatMessage({ id: "passportExpireAt" })}
                      renderInput={(props) => <TextField {...props} />}
                      openTo="year"
                      views={["year", "month", "date"]}
                      format="DD-MM-YYYY"
                    />
                  </MuiPickersUtilsProvider>
            
                  <ErrorMessage
                  locale={locale}
                    condition={!!formik.submitCount && Boolean(errors?.passportExpireAt)}
                    errorMsg={errors.passportExpireAt}
                  />
                </div>
              </ClickAwayListener>
              <ClickAwayListener
                onClickAway={() => {
                  setShowPicker2(!showPicker6);
                }}
              >
                <div className="col-md-6" key={showPicker6}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={HijriUtilsExtended} locale={locale}>
                    <MaterialDatePicker
                      okLabel={formatMessage({ id: "ok" })}
                      cancelLabel={formatMessage({ id: "cancel" })}
                      clearLabel={formatMessage({ id: "clear" })}
                      minDate="1937-03-14"
                      maxDate="2076-11-26"
                      clearable
                      style={{ width: "100%" }}
                    inputVariant="outlined"
                      onChange={(date) => {
                        // setGregorainDOB(date);
                        // setFieldValue("dob", date);
                        setFieldValue("passportExpireAt", date);
                        setpassportExpireDateHijri(date)
                      }}
                      value={passportExpireDateHijri || null  }
                      disablePast
                    
                    labelFunc={(date) => (date ? date.locale(locale).format("iDD-iMM-iYYYY") : "")}
                      placeholder={formatMessage({ id: "passportExpireAt-hijri" })}
                      label={formatMessage({ id: "passportExpireAt-hijri" })}
                      renderInput={(props) => <TextField {...props} />}
                      openTo="year"
                      views={["year", "month", "date"]}
                      format="DD-MM-YYYY"
                    />
                  </MuiPickersUtilsProvider>
            
                  
                </div>
              </ClickAwayListener>

            </div>
          </>
        )}
        <>
          <div className="row">
            <ClickAwayListener
              onClickAway={() => {
                setShowPicker3(!showPicker3);
              }}
            >
              <div className="col-md-6 date" key={showPicker3}>
               

                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
                  <MaterialDatePicker
                    okLabel={formatMessage({ id: "ok" })}
                    cancelLabel={formatMessage({ id: "cancel" })}
                    clearLabel={formatMessage({ id: "clear" })}
                    clearable
                    required

                    style={{ width: "100%" }}
                    onChange={(date) => {
                      // setGregorainDOB(date);
                      // setFieldValue("dob", date);
                      setFieldValue("driverLicenseExpireAt", date);
                      setHijriDriverLicenceExpireDate(date)
                    }}
                    disablePast
                    inputVariant="outlined"
                    label={formatMessage({ id: "driverLicenseExpireAt" })}
                    value={values?.driverLicenseExpireAt ? values?.driverLicenseExpireAt : null}
                    placeholder={formatMessage({ id: "driverLicenseExpireAt" })}
                    renderInput={(props) => <TextField {...props} />}
                    openTo="year"
                    views={["year", "month", "date"]}
                    format="DD-MM-YYYY"
                  />
                </MuiPickersUtilsProvider>
                <ErrorMessage
                locale={locale}
                  condition={!!formik.submitCount && Boolean(errors?.driverLicenseExpireAt)}
                  errorMsg={errors.driverLicenseExpireAt}
                />
              </div>
            </ClickAwayListener>
            <ClickAwayListener
              onClickAway={() => {
                setShowPicker7(!showPicker7);
              }}
            >
              <div className="col-md-6 date" key={showPicker7}>
               

              <MuiPickersUtilsProvider
                  libInstance={moment}
                  utils={HijriUtilsExtended}
                  locale={locale}
                  required
                >
                  <MaterialDatePicker
                    key={locale}
                    minDate="1937-03-14"
                    maxDate="2076-11-26"
                    clearable
                    // variant="outlined"
                    inputVariant="outlined"
                    okLabel={formatMessage({ id: "ok" })}
                    cancelLabel={formatMessage({ id: "cancel" })}
                    clearLabel={formatMessage({ id: "clear" })}
                    labelFunc={(date) => (date ? date.locale(locale).format("iDD-iMM-iYYYY") : "")}
                    style={{ width: "100%" }}
                    value={hijridriverLicenceExpireDate || null}
                    onChange={(date) =>{
                      setFieldValue("driverLicenseExpireAt", date);
                      setHijriDriverLicenceExpireDate(date)
                    }
                       }
                    name="karem"
                    variant="dialog"
                    emptyLabel={formatMessage({ id: "driverLicenseExpireAt" })}
                    placeholder={formatMessage({ id: "driverLicenseExpireAt" })}
                    label={formatMessage({ id: "driverLicenseExpireAt-hijri" })}
                    disablePast
                    renderInput={(props) => (
                      <TextField {...props} label="Next appointment"   required />
                    )}
                    openTo="year"
                    views={["year", "month", "date"]}
                    format="DD-MM-YYYY"
                  />
                </MuiPickersUtilsProvider>
                 
                <ErrorMessage
                locale={locale}
                  condition={!!formik.submitCount && Boolean(errors?.driverLicenseExpireAt)}
                  errorMsg={errors.driverLicenseExpireAt}
                />
              </div>
            </ClickAwayListener>
            <div className="col-md-6">
              <CustomTextField
                name="driverLicense"
                required={values.status == "gulf_citizen" || values.status=="visitor"}
                value={values.driverLicense}
                onChange={handleChange}
                error={touched.driverLicense && Boolean(errors.driverLicense)}
                errormsg={touched.driverLicense && errors.driverLicense}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
                <MaterialDatePicker
                  okLabel={formatMessage({ id: "ok" })}
                  cancelLabel={formatMessage({ id: "cancel" })}
                  clearLabel={formatMessage({ id: "clear" })}
                  minDate="1937-03-14"
                  clearable
                  style={{ width: "100%" }}
                  onChange={(date) => {
                    setGregorainDOB(date);
                    setFieldValue("dob", date);
                  }}
                  value={values.dob || null}
                  inputVariant="outlined"
                  required
                  label={formatMessage({ id: "DOB.Gregor" })}
                  name="dob"
                  placeholder={formatMessage({ id: "DOB.Gregor" })}
                  disableFuture
                  renderInput={(props) => <TextField {...props} />}
                  openTo="year"
                  views={["year", "month", "date"]}
                  format="DD-MM-YYYY"
                />
              </MuiPickersUtilsProvider>
            </div>
            <ClickAwayListener
              onClickAway={() => {
                setShowPicker4(!showPicker4);
              }}
            >
              <div className="col-md-6" key={showPicker4}>
         
                <MuiPickersUtilsProvider
                  libInstance={moment}
                  utils={HijriUtilsExtended}
                  locale={locale}
                  required
                >
                  <MaterialDatePicker
                    key={locale}
                    minDate="1937-03-14"
                    maxDate="2076-11-26"
                    clearable
                    okLabel={formatMessage({ id: "ok" })}
                    cancelLabel={formatMessage({ id: "cancel" })}
                    clearLabel={formatMessage({ id: "clear" })}
                    labelFunc={(date) => (date ? date.locale(locale).format("iDD-iMM-iYYYY") : "")}
                    style={{ width: "100%" }}
                    value={hijriDOB || null}
                    onChange={(date) => setHijriDOB(date)}
                    name="dob_hijri"
                    inputVariant="outlined"
                    label={formatMessage({ id: "DOB.Hijri" })}
                    emptyLabel={formatMessage({ id: "DOB.Hijri" })}
                    placeholder={formatMessage({ id: "DOB.Hijri" })}
                    disableFuture
                    renderInput={(props) => (
                      <TextField {...props} label="Next appointment" required />
                    )}
                    openTo="year"
                    views={["year", "month", "date"]}
                    format="DD-MM-YYYY"
                  />
                </MuiPickersUtilsProvider>

                <ErrorMessage
                locale={locale}
                  condition={!!formik.submitCount && Boolean(errors?.dob)}
                  errorMsg={errors.dob}
                />
              </div>
            </ClickAwayListener>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <Select
                className="dropdown-select"
                name="customerClass"
                options={[
                  { label: formatMessage({ id: "basic_member" }), value: "basic_member" },
                  { label: formatMessage({ id: "bronze_member" }), value: "bronze_member" },
                  { label: formatMessage({ id: "gold_member" }), value: "gold_member" },
                  { label: formatMessage({ id: "private_member" }), value: "private_member" },
                ]}
                value={{
                  label: formatMessage({ id: values?.customerClass }),
                  value: values?.customerClass,
                }}
                placeholder={formatMessage({ id: "customerClass" })}
                onChange={(selection) => {
                  setFieldValue("customerClass", selection?.value);
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <FileUploader
                error={!!formik.submitCount && Boolean(errors?.licenseSelfieImage)}
                // required
                imgheight={50000000}
                imgwidth={50000000}
                titleId="licenseSelfieImage"
                image={licenseSelfieImage}
                setImage={setLicenseSelfieImage}
              />
              <ErrorMessage
              locale={locale}
                condition={!!formik.submitCount && Boolean(errors?.licenseSelfieImage)}
                errorMsg={errors.licenseSelfieImage}
              />
            </div>
            <div className="col-md-6">
              <FileUploader
                imgheight={5000000}
                imgwidth={5000000}
                error={!!formik.submitCount && Boolean(errors?.licenseFrontImage)}
                required
                titleId="licenseFrontImage"
                image={licenseFrontImage}
                setImage={setLicenseFrontImage}
              />
              <ErrorMessage
              locale={locale}
                condition={!!formik.submitCount && Boolean(errors?.licenseFrontImage)}
                errorMsg={errors.licenseFrontImage}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <FileUploader
                imgheight={5000000}
                imgwidth={5000000}
                titleId="profileImage"
                image={profileImage}
                setImage={setProfileImage}
                error={!!formik.submitCount && Boolean(errors?.profileImage)}
              />
              <ErrorMessage
              locale={locale}
                condition={!!formik.submitCount && Boolean(errors?.profileImage)}
                errorMsg={errors.profileImage}
              />

            </div>
            {
              values.status == "visitor" && 
              <div className="col-md-6">
              <FileUploader
                imgheight={5000000}
                imgwidth={5000000}
                error={!!formik.submitCount && Boolean(errors?.passportFrontImage)}
                required
                titleId="passportFrontImage"
                image={passportFrontImage}
                setImage={setPassportFrontImage}
              />

              <ErrorMessage
              locale={locale}
                condition={!!formik.submitCount && Boolean(errors?.passportFrontImage)}
                errorMsg={errors.passportFrontImage}
              />
            </div>
            }
            {
              values?.status =="gulf_citizen" && 
              <div className="col-md-6">
              <FileUploader
                imgheight={5000000}
                imgwidth={5000000}
                titleId="ID Image"
                image={nidImage}
                setImage={setNidImage}
              />
             
            </div>

            }
            
          </div>
          <div className="row">
            {values?.status === "visitor" && (
              <>
         
                <div className="col-md-6">
                  <FileUploader
                    imgheight={5000000}
                    imgwidth={5000000}
                    error={!!formik.submitCount && Boolean(errors?.visaImage)}
                    titleId="VISAimage"
                    image={visaImage}
                    setImage={setvisaImage}
                  />

                 
                </div>
              </>
            )}
           
          </div>
        </>

        <div className="pt-25 text-right">
          <button
            variant="contained"
            color="primary"
            className="btn btn-primary mr-4"
            type="submit"
            disabled={creatingUser || gettingNationalities || uploading || EditingUser}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSubmit}
          >
            <FormattedMessage id="button.save" />
          </button>
          <button
            type="button"
            className="btn btn-danger mr-15 text-white"
            onClick={() => {
              history.push("/cw/dashboard/customers");
              resetForm();
            }}
            disabled={creatingUser || gettingNationalities || uploading || EditingUser}
          >
            <FormattedMessage id="button.cancel" />
          </button>
          {progress === 100 ||
            ((uploading || creatingUser) && progress > 0 && progress <= 100 && (
              <CircularProgressWithLabel value={progress} />
            ))}
        </div>
      </form>
    </div>
  );
}

export default CreateEditUser;
