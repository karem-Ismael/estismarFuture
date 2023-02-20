/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable eqeqeq */
/* eslint-disable react/button-has-type */
/**
 * Bookings/Rentals Page
 */
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
// page title bar
import { AllPrivileges } from "gql/queries/GetPrivileges.gql";
// rct card box

// intl messages

import { NotificationManager } from "react-notifications";
import { useFormik } from "formik";
// component
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import CustomTextField from "components/Input/CustomTextField";
import { addRoleInitValues } from "./RoleAdd.model";
import { CreateRoleValidation } from "validations/Role.validations";

import { Helmet } from "react-helmet";
import { AddRole } from "gql/mutations/AddRole.gql";
import "./style.css";
import { ErrorMessage } from "components/shared/ErrorMessage";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
export default function AddRoles() {
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();
  const { formatMessage, messages } = useIntl();
  const { data } = useQuery(AllPrivileges);
  const [ids, setDataids] = useState([]);
  const [addRole] = useMutation(AddRole);
  const header = [...new Set(data?.privileges?.map((priv) => priv.name.split(".")[1]))];
  const col = [...new Set(data?.privileges?.map((priv) => priv.name.split(".")[0]))];
  const GetChangeData = (data) => {
    if (ids.length <= 0) {
      setDataids([...ids, data.id]);
      return;
    }
    if (ids.includes(data.id)) {
      const idsExist = ids.filter((id) => id != data.id);
      setDataids([idsExist]);
    } else {
      setDataids([...ids, data.id]);
    }
  };
  const handelAddRole = (values) => {
    if (Object.keys(errors).length) {
      return;
    }
    if (ids.length <= 0) {
      NotificationManager.error(<FormattedMessage id="youmustselectrole" />);
      return;
    }
    addRole({
      variables: {
        ...values,
        privileges: ids,
      },
    })
      .then((res) => {
        if (res.data.addRole.errors.length != 0) {
          NotificationManager.error(res.data.addRole.errors);
        } else {
          NotificationManager.success(<FormattedMessage id="RoleAddSuccessfully" />);
          setTimeout(() => {
            history.push("/cw/dashboard/roles");
          }, 1000);
        }
      })
      .catch((err) => NotificationManager.error(err?.message));
  };

  const formik = useFormik({
    initialValues: addRoleInitValues,
    validationSchema: CreateRoleValidation,

    onSubmit: async (values) => {
      const variables = {
        ...values,
      };
      handelAddRole(variables);
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
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.addRole" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.addRole" />}
        match={location}
        lastElement={<IntlMessages id="sidebar.addRole" />}
        enableBreadCrumb
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // handelAddRole();
          handleSubmit();
        }}
        autoComplete="off"
      >
        <div className="row">
          <div className="col-md-4 align-items-center">
            <CustomTextField
              onblur={(e) => {
                setFieldValue("arName", e.target.value);
              }}
              label={<FormattedMessage id="arabicnamerole" />}
              variant="outlined"
              InputProps={{ inputProps: { minlength: 1, maxlength: 150 } }}
              fullWidth
              name="arabicnamerole"
              error={!!formik.submitCount && errors.arName}
              errormsg={!!formik.submitCount && errors.arName}
            />
          </div>
          <div className="col-md-4">
            <TextField
              label={<FormattedMessage id="arabicdescription" />}
              multiline
              rows={4}
              variant="outlined"
              onblur={(e) => {
                setFieldValue("arDescription", e.target.value);
              }}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-4 align-items-center">
            <CustomTextField
              onblur={(e) => {
                setFieldValue("enName", e.target.value);
              }}
              label={<FormattedMessage id="englishrolename" />}
              variant="outlined"
              InputProps={{ inputProps: { minlength: 1, maxlength: 150 } }}
              fullWidth
              name="englishrolename"
              error={!!formik.submitCount && errors.enName}
              errormsg={!!formik.submitCount && errors.enName}
            />
          </div>
          <div className="col-md-4">
            <TextField
              label={<FormattedMessage id="englishroledescription" />}
              multiline
              rows={4}
              variant="outlined"
              onblur={(e) => {
                setFieldValue("enDescription", e.target.value);
              }}
            />
          </div>

          <div className="col-md-4 align-items-center">
            <div className="row">
              <div className="col-lg-6 col-md-12 mt-2">
                <button type="submit" className="btn btn-primary text-white">
                  <FormattedMessage id="save" />
                </button>
              </div>
              <div className="col-lg-6 col-md-12 mt-2">
                <button
                  onClick={() => history.push("/cw/dashboard/roles")}
                  className="btn btn-danger text-white"
                >
                  <FormattedMessage id="cancel" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="row">
        <div className="col-12">
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormattedMessage id="name" />
                  </TableCell>
                  {header.map((data) => (
                    <TableCell>
                      <FormattedMessage id={data} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {col.map((col) => (
                  <TableRow>
                    <TableCell>
                      <FormattedMessage id={col} />
                    </TableCell>
                    {header.map((head) => (
                      <TableCell>
                        {data?.privileges
                          .filter((data) => data.name.split(".")[0] == col)
                          .find((data) => data.name == `${col}.${head}`) ? (
                          <>
                            <Checkbox
                              onChange={() =>
                                GetChangeData(
                                  data?.privileges.find((data) => data.name == `${col}.${head}`),
                                )
                              }
                              inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                            />
                          </>
                        ) : (
                          <Checkbox
                            disabled
                            inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
