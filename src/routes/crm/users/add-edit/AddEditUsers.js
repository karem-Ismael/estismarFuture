/**
 * Add/Edit User
 */
import React, { useState, useRef, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import { AddUser, EditUser } from "gql/mutations/User.mutations.gql";
import IntlTelInput from "react-intl-tel-input";
import { CreateUserValidation, EditUserValidation } from "validations/User.validations";
import CustomTextField from "components/Input/CustomTextField";
import { RolesList } from "gql/queries/GetRoles.gql";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { ErrorMessage } from "components/shared/ErrorMessage";
import { GetUserDetailsQuery } from "gql/queries/Users.queries.gql";
import { CircularProgressWithLabel } from "components/CircularProgressWithLabel";
import { persist } from "constants/constants";
import { Autocomplete } from "@material-ui/lab";
import {
  Input,
  InputAdornment,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
} from "@material-ui/core";
import { addUserInitValues } from "./AddEditUser.model";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
function CreateEditUser() {
  const history = useHistory();
  const mobileReactRef = useRef();
  const { userId } = useParams();
  const { formatMessage, locale } = useIntl();
  const [mobileDisplay, setMobileDisplay] = useState("");
  const [phoneValidity, setPhoneValidity] = useState(false);
  const [progress, setProgress] = useState(0);
  const [roles, setRoles] = useState([]);
  const [CreateNewUserMutation, { loading: creatingUser }] = useMutation(AddUser);
  const [EditUserMutation, { loading: EditingUser }] = useMutation(EditUser);
  const [showPassword, setShowPassword] = useState(false);
  const [addedUser, setAddedUser] = useState(null);
  const [disableEveryThing, setDisableEveryThing] = useState(false);
  // START EDIT PROCESS
  // FOR EDIT MODE
  const { data: userDetailsRes, refetch, loading: gettingUserDetails } = useQuery(
    GetUserDetailsQuery,
    {
      skip: !addedUser && !userId,
      variables: { id: +addedUser || +userId },
    },
  );

  const { data: RolesRes, loading: gettingRolesList } = useQuery(RolesList, {
    variables: { limit: persist.unlimitedLimit },
  });

  useEffect(() => {
    if (userId) refetch();
  }, [userId]);

  useEffect(() => {
    if (userId && userDetailsRes?.user) {
      const { firstName, lastName, email, mobile, isActive, password } = userDetailsRes?.user;
      setFieldValue("firstName", firstName);
      setFieldValue("lastName", lastName);
      setFieldValue("email", email);
      setFieldValue("isActive", isActive === true ? "active" : "inactive");
      setFieldValue("mobile", mobile); // works for numers start with 966 & won't be suitable for numbers from other countries
      setFieldValue("password", password); // works for numers start with 966 & won't be suitable for numbers from other countries
      setPhoneValidity(true);
      setMobileDisplay(mobile.slice(3));
    }

    if (Array.isArray(userDetailsRes?.user?.roles) && RolesRes?.roles?.collection) {
      const selectedRoles = userDetailsRes?.user?.roles?.map((selectedRole) =>
        RolesRes?.roles?.collection?.find((role) => +role.id === +selectedRole.id),
      );
      setFieldValue(
        "roles",
        selectedRoles?.map((role) => role.id),
      );
      setRoles(selectedRoles);
    }
  }, [userDetailsRes, RolesRes]);

  // END EDIT PROCESS
  const formik = useFormik({
    initialValues: addUserInitValues,
    validationSchema: !userId ? CreateUserValidation : EditUserValidation,

    onSubmit: async (values) => {
      if (!phoneValidity) return;
      setProgress(12 || progress);

      const variables = {
        ...values,
        // eslint-disable-next-line no-unneeded-ternary
        isActive: values.isActive === "active" ? true : false,
      };

      if (!userId) {
        // Create New User/CUSTOMRT
        await CreateNewUserMutation({ variables: { ...variables } })
          .then((res) => {
            setAddedUser(res.data.addUser.user.id);
            setProgress(100);
            setTimeout(() => {
              NotificationManager.success(formatMessage({ id: "success.create.nonCustomerUser" }));
              history.push("/cw/dashboard/users");
            }, 100);
          })
          .catch((err) => {
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator);
            }
          });
      } else {
        // EDIT EXISTIGN User/CUSTOMRT
        await EditUserMutation({ variables: { ...variables, id: +userId } })
          .then(() => {
            refetch();
            NotificationManager.success(formatMessage({ id: "success.edit.nonCustomerUser" }));
            history.push("/cw/dashboard/users");
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
            id: userId ? "EditUser" : "AddUser",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={userId ? "EditUser" : "AddUser"} />}
        match={location}
        lastElement={userId ? userId : <IntlMessages id={"AddUser"} />}
        enableBreadCrumb
      />
      <form onSubmit={handleSubmit}>
        <div className="row">
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
              required
              fullWidth
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              error={touched.lastName && Boolean(errors.lastName)}
              errormsg={touched.lastName && errors.lastName}
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
          <div className="col-md-6" dir="ltr">
            <IntlTelInput
              fieldId="input-tel"
              inputClassName={
                !phoneValidity && (values.mobile > 0 || formik.submitCount > 0) ? "input-error" : ""
              }
              separateDialCode
              telInputProps={{ pattern: "[0-9]*", autoComplete: "off" }}
              ref={mobileReactRef}
              preferredCountries={["sa"]}
              containerClassName="intl-tel-input"
              // NOTE: the next line should be fixed when the user's mobile is editable
              placeholder={userId ? values.mobile.slice(3) : "512345678*"}
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
        <div className="row mb-4">
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

          <div className="col-md-6">
            {!gettingUserDetails && !gettingRolesList && (
              <Autocomplete
                multiple
                disableClearable
                id="tags-standard"
                value={roles}
                onChange={(e, val) => {
                  setRoles(val);
                  setFieldValue(
                    "roles",
                    val?.map((x) => x.id),
                  );
                }}
                options={RolesRes?.roles?.collection}
                getOptionLabel={(option) => option[`${locale}Name`]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={formatMessage({ id: "roles" })}
                    placeholder={formatMessage({ id: "roles" })}
                  />
                )}
              />
            )}
            <ErrorMessage
              condition={!!formik.submitCount && errors.roles}
              errorMsg={errors.roles}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <FormControl component="fieldset">
              <FormLabel component="legend" required>
                <FormattedMessage id="customerStatus" />
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

        <div className="pt-25 text-right">
          <button
            variant="contained"
            color="primary"
            className="btn btn-primary mr-4"
            type="submit"
            disabled={creatingUser || EditingUser || disableEveryThing}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSubmit}
          >
            <FormattedMessage id="button.save" />
          </button>
          <button
            type="button"
            className="btn btn-danger mr-15 text-white"
            onClick={() => {
              resetForm();
              history.push("/cw/dashboard/users");
            }}
            disabled={creatingUser || EditingUser || disableEveryThing}
          >
            <FormattedMessage id="button.cancel" />
          </button>
          {progress === 100 ||
            (creatingUser && progress > 0 && progress <= 100 && (
              <CircularProgressWithLabel value={progress} />
            ))}
        </div>
      </form>
    </>
  );
}

export default CreateEditUser;
