/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import QueueAnim from "rc-queue-anim";
import {
  AppBar,
  Toolbar,
  Button,
  LinearProgress,
  Input,
  InputAdornment,
  IconButton,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { Visibility, VisibilityOff, Email } from "@material-ui/icons";
import jwt_decode from "jwt-decode";
import { useMutation } from "@apollo/client";
import AppConfig from "constants/AppConfig";
import { FormattedMessage, useIntl } from "react-intl";
import { useFormik } from "formik";
import CustomMuiInput from "components/Input/CustomMuiInput";
import { LoginDashboardMutation, LogoutMutation } from "gql/mutations/Authentication.mutations.gql";
import LanguageProvider from "components/Header/LanguageProvider";
import { useDispatch } from "react-redux";
import { signUserIn } from "actions/AuthActions";
import { useRemember } from "react-remember";
import { lognValidationSchema } from "validations/SignIn.validations";

function SignIn() {
  const [logoutDashboard] = useMutation(LogoutMutation);

  const history = useHistory();
  const dispatch = useDispatch();
  const { formatMessage, locale } = useIntl();
  const [loginDashboard, { loading }] = useMutation(LoginDashboardMutation);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [checked, setChecked] = React.useState(true);

  // const [recaptchaPass, setRecaptchaPass] = useState(false);
  const [the, remember] = useRemember();

  useEffect(() => {
    if (the.rememberMe == true && the["persist:root"] && !sessionStorage.getItem("persist:root")) {
      sessionStorage.setItem("persist:root", the["persist:root"]);
      dispatch(signUserIn({ token: { ...the.user }, history }));
    }
    if (the.rememberMe == false && the["persist:root"] && !sessionStorage.getItem("persist:root")) {
      if (JSON.parse(localStorage.getItem("user_data")).token)
        logoutDashboard({
          variables: { clientMutationId: JSON.parse(localStorage.getItem("user_data")).token },
        })
          .then(() => localStorage.clear())
          .catch((error) => console.error(error));
    }
  }, [the]);

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: lognValidationSchema,
    onSubmit: (values) => {
      const { email, password } = values;
      loginDashboard({ variables: { email, password } }).then((res) => {
        const { token, errors } = res.data.loginDashboard;
        if (errors.length > 0) {
          setLoginError(errors[0]);
        } else if (token) {
          const decodedHeader = jwt_decode(token);
          dispatch(signUserIn({ token: { ...decodedHeader, token }, history }));
          if (checked) {
            remember({ rememberMe: true, user: { ...decodedHeader, token } });
          } else {
            remember({ rememberMe: false, user: { ...decodedHeader, token } });
          }
        }
      });
    },
  });

  return (
    <QueueAnim type="bottom" duration={2000}>
      <div className="rct-session-wrapper">
        {loading && <LinearProgress />}
        <AppBar position="static" className="session-header">
          <Toolbar>
            <div className="container">
              <div className="pt-4 d-flex justify-content-between">
                <div className="session-logo pt-4">
                  <Link to="#">
                    <img
                      src={AppConfig.appLogo}
                      alt="session-logo"
                      className="img-fluid m5"
                      width="80"
                      height="35"
                    />
                  </Link>
                </div>
                <div style={{ marginTop: "4em" }}>
                  <LanguageProvider />
                </div>
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <div className="session-inner-wrapper">
          <div className="container">
            <div className="d-flex justify-content-around">
              <div className="col-sm-7 col-md-7 col-lg-8 mt-4">
                <div className="session-body text-center">
                  <div className="session-head mb-30">
                    <h2 className="font-weight-bold">
                      <FormattedMessage id="login.header" />
                    </h2>
                  </div>
                  <form
                    onSubmit={formik.handleSubmit}
                    className={locale === "ar" ? "text-right" : "text-left"}
                  >
                    <CustomMuiInput
                      disableRipple
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      placeholder={formatMessage({ id: "email.address" })}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      errormsg={formik.touched.email && formik.errors.email}
                      // icon={<Email disableRipple={true} />}
                      endAdornment={
                        <InputAdornment position="end" disableRipple>
                          <IconButton
                            style={{ pointerEvents: "none" }}
                            disableRipple={true}
                            disableFocusRipple={true}
                          >
                            {<Email />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormControl fullWidth className="has-wrapper">
                      <Input
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        placeholder={formatMessage({ id: "placeholder.password" })}
                        className="has-input input-lg"
                        type={showPassword ? "text" : "password"}
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
                    <p className="text-danger mt-1 text-left">
                      {formik.touched.password && formik.errors.password && (
                        <FormattedMessage id={formik.errors.password} />
                      )}
                      {loginError && <FormattedMessage id="errors.login" />}
                    </p>
                    {/* <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA} onChange={onChange} /> */}
                    <FormControlLabel
                      style={{
                        float: locale == "ar" ? "right" : "left",
                        marginRight: "0px",
                      }}
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={handleCheckChange}
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label={formatMessage({ id: "labels.rememberMe" })}
                    />
                    <Button
                      disabled={loading}
                      color="primary"
                      variant="contained"
                      fullWidth
                      type="submit"
                    >
                      <FormattedMessage id="btn.signin" />
                    </Button>
                  </form>
                  <p className="mb-0 mt-3">
                    {/* TODO: forget password task */}
                    {/* <a target="_blank" href="#/forget-password" className="text-muted">
                      <FormattedMessage id="forgotPassword" />
                    </a> */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueueAnim>
  );
}

export default SignIn;
