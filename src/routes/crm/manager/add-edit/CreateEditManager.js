/* eslint-disable prettier/prettier */
/** Add/Edit Customer */
import React, { useState, useRef, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import CreateAllyManager from "gql/mutations/CreateManager.gql";
import { GetNationalities } from "gql/queries/Nationalities.query.gql";
import moment from "moment";
import IntlTelInput from "react-intl-tel-input";
import { CreateManagerValidation } from "validations/Manager.validation";
import CustomTextField from "components/Input/CustomTextField";
import "moment/locale/ar-sa";
import "moment/locale/en-au";

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputAdornment,
  IconButton,
  Input,
  TextField,
  Checkbox,
} from "@material-ui/core";
import { ErrorMessage } from "components/shared/ErrorMessage";
import { CitiesDropDown } from "components/DropDowns";
import AllyName from "components/DropDowns/AllyName";
import BranchesDropDown from "components/DropDowns/BranchesDropDown";
import { UpdateAllyManager } from "gql/mutations/UpdateAllyManager.gql";
import Select from "react-select";
import UPLOAD_IMAGE from "gql/mutations/UploadImage.gql";
import { FileUploader } from "components/ImageUploader";
import { AllyManagerProfile } from "gql/queries/GetAllyManagerProfile.gql";
import { CircularProgressWithLabel } from "components/CircularProgressWithLabel";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { addManagerInitValues } from "./ManagerAddEdit.model";
import HijriUtilsExtended from "./HijriUtilsExtended";
function CreateEditManager() {
  const { managerId } = useParams();
  const history = useHistory();
  const { locale } = useIntl();
  const selectInputRef = useRef();
  const mobileReactRef = useRef();
  const { formatMessage } = useIntl();
  const [profileImage, setProfileImage] = useState("");
  const [mobileDisplay, setMobileDisplay] = useState("");
  const [idPhoto, setidPhoto] = useState("");
  const [phoneValidity, setPhoneValidity] = useState(false);
  const [nationalitiesOptions, setNationalitiesOptions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [allyId, setAllyId] = useState();

  const { data: nationalitiesRes, loading: gettingNationalities } = useQuery(GetNationalities);

  const [createManager, { loading: creatingUser }] = useMutation(CreateAllyManager);
  const [updateAllyManager, { loading: EditingUser }] = useMutation(UpdateAllyManager);
  const [uploadImageMutation, { loading: uploading }] = useMutation(UPLOAD_IMAGE);

  const [gregorainDOB, setGregorainDOB] = useState(null);
  const [hijriDOB, setHijriDOB] = useState(null);
  const [userId,setUserId]=useState()
  // START EDIT PROCESS
  // FOR EDIT MODE
  const { data: allyManager, refetch } = useQuery(AllyManagerProfile, {
    skip: !managerId,
    variables: { allyProfileId: +managerId},
  });

  useEffect(() => {
    refetch();
  }, [managerId]);
  useEffect(() => {
    moment.locale(locale === "ar" ? "ar" : "en-au");
  }, [locale]);
  useEffect(() => {
    if (allyManager) {
      const {
        email,
        firstName,
        lastName,
        middleName,
        gender,
        allyId,
        branches,
        town,
        nationalId,
        passportNum,
        idPhoto,
        nationality,
        dob,
      } = allyManager?.allyManagerProfile;
      const { mobile, profileImage, isActive,id:userId } = allyManager?.allyManagerProfile.user
      setUserId(userId)
      setFieldValue("allyId", allyId);
      setFieldValue("branches", branches);
      if (branches?.length == 0 || branches == null) {
        setFieldValue("isAllyManager", true);
      }
      setAllyId(allyId);
      setFieldValue("town", town || addManagerInitValues.town);
      setFieldValue("email", email);
      setFieldValue("firstName", firstName || addManagerInitValues.firstName);
      setFieldValue("gender", gender || addManagerInitValues.gender);
      setFieldValue("isActive", isActive === true ? "active" : "inactive");
      setFieldValue("lastName", lastName || addManagerInitValues.lastName);
      setFieldValue("middleName", middleName || addManagerInitValues.middleName);
      setMobileDisplay(mobile?.slice(3)); // works for numers start with 966 & won't be suitable for numbers from other countries
      setFieldValue("mobile", mobile || addManagerInitValues?.mobile); // works for numers start with 966 & won't be suitable for numbers from other countries
      setFieldValue("nationality", nationality || addManagerInitValues.nationality);
      setFieldValue("nationalId", nationalId || addManagerInitValues.nationalId);
      setFieldValue("passportNum", passportNum || addManagerInitValues.passportNum);
      setPhoneValidity(true);
      //   // Images
      setidPhoto(idPhoto);
      setProfileImage(profileImage);
      setGregorainDOB(dob || null);
    }

    return () => {
      setidPhoto("");
      setProfileImage("");
    };
  }, [allyManager]);
  // END EDIT PROCESS

  useEffect(() => {
    if (idPhoto) setFieldValue("idPhoto", idPhoto);
    if (profileImage) setFieldValue("profileImage", profileImage);
  }, [idPhoto, profileImage]);

  function calculateAge() {
    const year = moment(new Date()).year();
    const dobYear = moment(gregorainDOB).year();
    return +year - +dobYear;
  }
  useEffect(() => {
    if (gregorainDOB) setHijriDOB(gregorainDOB);
  }, [gregorainDOB]);

  useEffect(() => {
    if (hijriDOB) {
      setGregorainDOB(hijriDOB);
    }
  }, [hijriDOB]);

  const formik = useFormik({
    initialValues: addManagerInitValues,
    validationSchema: managerId && !values?.password.length ? null : CreateManagerValidation,

    onSubmit: async (values) => {
      if (!phoneValidity) return;
      setProgress(12 || progress);
      if (!values.idPhoto.startsWith("http") && values.idPhoto.length > 0) {
        await uploadImageMutation({
          variables: { image: values.idPhoto, topic: "idPhoto" },
        })
          .then((res) => {
            values.idPhoto = res.data.imageUpload.imageUpload.imageUrl;
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
      if (!values.profileImage.startsWith("http") && values.profileImage.length > 0) {
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
        // e slint-disable-next-line no-unneeded-ternary
        isActive: values.isActive === "active",
        idPhoto: values?.idPhoto || "",
        nationality: values.nationality,
        password: !values?.password.length ? undefined : values?.password,
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
        branches: values.isAllyManager ? [] : values.branches,
      };
      if (!managerId) {
        // Create New User/CUSTOMRT
        await createManager({
          variables: {
            input: {
              ...variables,
              status: undefined,
              town: values.town?.id,
              isAllyManager: undefined,
            },
          },
        })
          .then(() => {
            setProgress(100);
            NotificationManager.success(formatMessage({ id: "success.create.manager" }));
            history.push("/cw/dashboard/managers");
          })
          .catch((err) => {
            NotificationManager.error(err?.message);
          });
      } else {
        // EDIT EXISTIGN User/CUSTOMRT
        await updateAllyManager({
          variables: {
            input: {
              ...variables,
              id: userId,
              status: undefined,
              town: values.town?.id,
              isAllyManager: undefined,
            },
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.edit.manager" }));
            refetch().then(() =>
              setTimeout(() => {
                history.push("/cw/dashboard/managers");
              }, 3000),
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
  const changeAlly = (id) => {
    setAllyId(id);
  };
  useEffect(() => {
    setNationalitiesOptions(
      nationalitiesRes?.nationalities?.map((nationality) => ({
        label: nationality[`${locale}Name`],
        value: nationality.id,
      })),
    );
  }, [nationalitiesRes]);
  return (
    <>
      <Helmet>
        <title>
          {formatMessage({
            id: managerId ? "EditManager" : "AddManager",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={managerId ? "EditManager" : "AddManager"} />}
        match={location}
        lastElement={managerId || <IntlMessages id="AddManager" />}
        enableBreadCrumb
      />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-2" style={{ pointerEvents: "none" }}>
            <Select placeholder={formatMessage({ id: "mr.manager" })} />
          </div>
          <div className="col-md-5">
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
          <div className="col-md-5">
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
              fullWidth
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              error={touched.lastName && Boolean(errors.lastName)}
              errormsg={touched.lastName && errors.lastName}
            />
          </div>
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
        </div>
        <div className="row mb-4 align-items-end">
          <div className={gregorainDOB ? "col-md-5" : "col-md-6"}>
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={locale}>
              <DatePicker
                okLabel={formatMessage({ id: "ok" })}
                cancelLabel={formatMessage({ id: "cancel" })}
                clearLabel={formatMessage({ id: "clear" })}
                clearable
                style={{ width: "100%" }}
                value={gregorainDOB}
                onChange={(date) => setGregorainDOB(date)}
                name="dob"
                inputVariant="outlined"
                label={formatMessage({ id: "DOB.Gregor" })}

                placeholder={formatMessage({ id: "DOB.Gregor" })}
                disableFuture
                renderInput={(props) => <TextField {...props} />}
                openTo="year"
                views={["year", "month", "date"]}
                format="DD-MM-YYYY"
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className={hijriDOB ? "col-md-5" : "col-md-6"}>
            <MuiPickersUtilsProvider
              libInstance={moment}
              utils={HijriUtilsExtended}
              locale={locale}
            >
              <DatePicker
                minDate="1937-03-14"
                maxDate="2076-11-26"
                clearable
                okLabel={formatMessage({ id: "ok" })}
                cancelLabel={formatMessage({ id: "cancel" })}
                clearLabel={formatMessage({ id: "clear" })}
                labelFunc={(date) => (date ? date.format("iYYYY/iMM/iDD") : "")}
                style={{ width: "100%" }}
                value={hijriDOB}
                onChange={(date) => setHijriDOB(date)}
                name="dob_hijri"
                placeholder={formatMessage({ id: "DOB.Hijri" })}
                inputVariant="outlined"
                label={formatMessage({ id: "DOB.Hijri" })}
                disableFuture
                renderInput={(props) => <TextField {...props} />}
                openTo="year"
                views={["year", "month", "date"]}
                format="DD-MM-YYYY"
              />
            </MuiPickersUtilsProvider>
          </div>
          {gregorainDOB && (
            <div className="col-md-2 d-flex justify-content-center" style={{ gap: "5px" }}>
              <h4 className="m-0" style={{ fontWeight: "bold" }}>
                {formatMessage({ id: "age" })}
              </h4>
              <span>{calculateAge()}</span>
              <h4>{formatMessage({ id: "year" })}</h4>
            </div>
          )}
        </div>

        <div className="row">
          <>
            <input style={{ display: "none" }} />
            <div className="col-md-6">
              <FormControl>
                <Input
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  placeholder={formatMessage({ id: "placeholder.password" })}
                  className="has-input input-lg"
                  type={showPassword ? "text" : "password"}
                  inputMode="text"
                  onFocus={(event) => {
                    event.target.setAttribute("autoComplete", "off");
                  }}
                  inputProps={{ autoComplete: "off" }}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  errormsg={formik.touched.password && formik.errors.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <ErrorMessage
                condition={!!formik.submitCount && errors?.password}
                errorMsg="validation.strongPasswordRequired"
              />
            </div>
          </>

          <div className="col-md-6" dir="ltr">
            <IntlTelInput
              fieldId="input-tel"
              inputClassName={
                !phoneValidity && (values.mobile > 0 || formik.submitCount > 0) ? "input-error" : ""
              }
              separateDialCode
              telInputProps={{ pattern: "[0-9]*" }}
              ref={mobileReactRef}
              preferredCountries={["sa"]}
              containerClassName="intl-tel-input"
              placeholder="512345678*"
              value={mobileDisplay}
              onPhoneNumberFocus={(isValid) => setPhoneValidity(isValid)}
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
            />
            <ErrorMessage
              condition={!!formik.submitCount && !phoneValidity}
              errorMsg="validation.invalidMobileNumber"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <AllyName
              required
              valueAttribute="id"
              selectedAlly={values.allyId}
              onAllyChange={changeAlly}
              setSelectedAlly={(Id) => (Id ? setFieldValue("allyId", Id) : null)}
            />
            <ErrorMessage
              condition={!!formik.submitCount && Boolean(errors?.allyId)}
              errorMsg={errors.allyId}
            />
          </div>
          <div className="col-md-2" style={{ alignItems: "baseline" }}>
            <FormControlLabel
              control={<Checkbox name="jason" />}
              label={<FormattedMessage id="isAllyManager" />}
              style={{ minWidth: "100px", marginLeft: "10px" }}
              checked={values.isAllyManager}
              onChange={(e) => {
                setFieldValue("isAllyManager", !values.isAllyManager);
              }}
            />
          </div>
          <div className="col-md-4">
            <BranchesDropDown
              isDisabled={values.isAllyManager}
              required
              multiple
              allyId={allyId}
              valueAttribute="id"
              selectedBranch={values.branches}
              setSelectedBranch={(Id) => {
                setFieldValue("branches", Id);
              }}
            />
            <ErrorMessage
              condition={!!formik.submitCount && Boolean(errors?.branches)}
              errorMsg={errors.branches}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <FormControl component="fieldset">
              <FormLabel component="legend" required>
                <FormattedMessage id="rental.gender" />
              </FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender"
                value={values.gender}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label={formatMessage({ id: "male" })}
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label={formatMessage({ id: "female" })}
                />
              </RadioGroup>
            </FormControl>
            <ErrorMessage
              condition={!!touched.gender && !!errors.gender}
              errorMsg={errors.gender}
            />
          </div>
          <div className="col-md-4">
            <FormControl component="fieldset">
              <FormLabel component="legend" required>
                <FormattedMessage id="managerStatus" />
              </FormLabel>
              <RadioGroup
                aria-label="isActive"
                name="isActive"
                value={values.isActive}
                onChange={handleChange}
              >
                {["active", "inactive"].map((state) => (
                  <FormControlLabel
                    key={state}
                    value={state}
                    control={<Radio />}
                    label={formatMessage({ id: state })}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <ErrorMessage
              condition={!!touched.is_active && !!errors.is_active}
              errorMsg={errors.is_active}
            />
          </div>
        </div>

        {/* CITIZEN ONLY */}
        <>
          <div className="row">
            <div className="col-md-6">
              <CustomTextField
                name="nationalId"
                className="custom-textfield"
                value={values.nationalId}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              {(!managerId || (managerId && nationalitiesOptions?.length && allyManager)) && (
                <Select
                  className={`dropdown-select mb-4  ${
                    touched.nationality && Boolean(errors.nationality) ? "selection-error" : ""
                  }`}
                  options={nationalitiesOptions}
                  ref={selectInputRef}
                  placeholder={formatMessage({ id: "nationality" })}
                  onChange={(selection) => {
                    setFieldValue("nationality", selection?.value);
                  }}
                  defaultValue={
                    managerId &&
                    allyManager?.allyManager?.allyProfile &&
                    nationalitiesOptions?.find(
                      (nat) => nat?.value == allyManager?.allyManager?.allyProfile?.nationality,
                    )
                  }
                />
              )}
              <ErrorMessage
                condition={!!formik.submitCount && Boolean(errors?.nationality)}
                errorMsg={errors.nationality}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {(!managerId || (managerId && allyManager && allyManager)) && (
                <CitiesDropDown
                  error={!!formik.submitCount && Boolean(errors?.town)}
                  valueAttribute="id"
                  selectedCity={values?.town}
                  setSelectedCity={(id) => setFieldValue("town", id)}
                />
              )}
            </div>
            <div className="col-md-6">
              <CustomTextField
                name="passportNum"
                value={values.passportNum}
                onChange={handleChange}
                error={touched.passportNum && Boolean(errors.passportNum)}
                errormsg={touched.passportNum && errors.passportNum}
              />
            </div>
          </div>
        </>
        <>
          <div className="row">
            <div className="col-md-6">
              <FileUploader
                titleId="idPhoto"
                image={idPhoto}
                setImage={setidPhoto}
                error={!!formik.submitCount && Boolean(errors?.idPhoto)}
              />
            </div>
            <div className="col-md-6">
              <FileUploader
                titleId="profileImage"
                image={profileImage}
                setImage={setProfileImage}
                error={!!formik.submitCount && Boolean(errors?.profileImage)}
              />
              <ErrorMessage
                condition={!!formik.submitCount && Boolean(errors?.profileImage)}
                errorMsg={errors.profileImage}
              />
            </div>
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
              history.push("/cw/dashboard/managers");
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
    </>
  );
}

export default CreateEditManager;
