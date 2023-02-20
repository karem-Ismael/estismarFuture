/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import UpdateExtraService from "gql/mutations/EditExtraService.gql";
import ExtraService from "gql/queries/GetExtraService.gql";
import { ErrorMessage } from "components/shared/ErrorMessage";
import { FileUploader } from "components/ImageUploader";
import { ImageUpload } from "gql/mutations/UploadImage.gql";
import TextField from "@material-ui/core/TextField";
import { AddEditExtraService } from "validations/ExtraServiceValidation";
import CustomTextField from "components/Input/CustomTextField";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import CreateExtraService from "gql/mutations/AddExtraService.gql";
import Select from "react-select";
import { paytype } from "constants/constants";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { addEditExtraServiceInitValues } from "./ExtraServiceModal";
import "./style.css";
function CreateEditExtraService() {
  const { id } = useParams();
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [createExtraService] = useMutation(CreateExtraService);
  const [loader, setLoader] = useState(false);
  const [iconloader, setIconloser] = useState(false);
  const [iconUrl, setIconUrl] = useState();
  const [homepageIconUrl, setHomepageIconUrl] = useState();

  const [imageUpload] = useMutation(ImageUpload);

  const [updateExtraService, { loading: EditingBranch }] = useMutation(UpdateExtraService);
  const { data: extraservicedetails, refetch } = useQuery(ExtraService, {
    skip: !id,
    variables: { id: +id },
  });

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  // END EDIT PROCESS

  useEffect(() => {
    if (extraservicedetails?.extraService) {
      const {
        enDescription,
        arDescription,
        enTitle,
        arTitle,
        payType,
        iconUrl,
        isActive,
        isDisplayed,
        isSpecial,
        homepageIconUrl,
      } = extraservicedetails.extraService;
      setFieldValue("arDescription", arDescription);
      setFieldValue("enDescription", enDescription);

      setFieldValue("enTitle", enTitle);
      setFieldValue("arTitle", arTitle);
      setFieldValue("payType", payType);

      setFieldValue("isActive", isActive);
      setFieldValue("isDisplayed", isDisplayed);
      setFieldValue("isSpecial", isSpecial);
      setIconUrl(iconUrl);
      setHomepageIconUrl(homepageIconUrl);
      setFieldValue("homepageIconUrl",homepageIconUrl)
    }
  }, [extraservicedetails]);
  const uploadImage = (file) => {
    setLoader(true);
    imageUpload({
      variables: {
        image: file,
        topic: "Extra service   Image ",
      },
    }).then((res) => {
      setLoader(false);
      setIconUrl(res.data.imageUpload.imageUpload.imageUrl);
    });
  };
  const UploadHomeIcon = (file) => {
    setIconloser(true);
    imageUpload({
      variables: {
        image: file,
        topic: "Extra service   Icon ",
      },
    }).then((res) => {
      setIconloser(false);
      setHomepageIconUrl(res.data.imageUpload.imageUpload.imageUrl);
      setFieldValue("homepageIconUrl",res.data.imageUpload.imageUpload.imageUrl)
    });
  };

  const formik = useFormik({
    initialValues: addEditExtraServiceInitValues,
    validationSchema: AddEditExtraService,
    onSubmit: async (values) => {
      const variables = { ...values };
      if (!id) {
        await createExtraService({
          variables: {
            ...variables,
            iconUrl,
            homepageIconUrl,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.create.service" }));
            history.push("/cw/dashboard/extraservice");
          })
          .catch((err) => {
            NotificationManager.error(err?.message);
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator?.message);
            }
          });
      } else {
        await updateExtraService({
          variables: {
            ...variables,
            extraServiceId: id,
            iconUrl,
            homepageIconUrl,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.edit.extraservice" }));
            refetch().then(() =>
              setTimeout(() => {
                history.push("/cw/dashboard/extraservice");
              }, 3000),
            );
          })
          .catch((err) => {
            NotificationManager.error(err?.message);
          });
      }
    },
  });

  const { values, setFieldValue, submitCount, handleChange: handleFormikChange, errors } = formik;
  function handleChange(e) {
    e.target.value = e.target.value.trimStart();
    handleFormikChange(e);
  }
  console.log(errors,"errors")
  return (
    <>
      <Helmet>
        <title>
          {formatMessage({
            id: id ? "EditExtraService" : "AddExtraService",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={id ? "EditExtraService" : "AddExtraService"} />}
        match={location}
        lastElement={id || <IntlMessages id="AddExtraService" />}
        enableBreadCrumb
      />
      <form onSubmit={formik.handleSubmit}>
        {((id && extraservicedetails) || !id) && (
          <div>
            <div className="row">
              <div className="col-md-6 entitle">
                <CustomTextField
                  fullWidth
                  required
                  name="enTitle"
                  value={values.enTitle}
                  onChange={handleChange}
                  error={!!submitCount && Boolean(errors.enTitle)}
                  errormsg={!!submitCount && errors.enTitle}
                />
              </div>
              <div className="col-md-6">
                <CustomTextField
                  fullWidth
                  required
                  name="arTitle"
                  value={values.arTitle}
                  onChange={handleChange}
                  error={!!submitCount && Boolean(errors.arTitle)}
                  errormsg={!!submitCount && errors.arTitle}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <TextField
                  label={<FormattedMessage id="enDescription" />}
                  name="enDescription"
                  required
                  multiline
                  value={values.enDescription}
                  rows={4}
                  variant="outlined"
                  onChange={handleChange}
                  error={!!submitCount && Boolean(errors.enDescription)}
                  errormsg={!!submitCount && errors.enDescription}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  label={<FormattedMessage id="arDescription" />}
                  name="arDescription"
                  required
                  multiline
                  value={values.arDescription}
                  rows={4}
                  variant="outlined"
                  onChange={handleChange}
                  error={!!submitCount && Boolean(errors.arDescription)}
                  errormsg={!!submitCount && errors.arDescription}
                />
              </div>
            </div>
            <div className="row mt-2 mb-3">
              <div className="col-md-6">
                <div className="">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isActive}
                        onChange={(e) => setFieldValue("isActive", e.target.checked)}
                        name="isActive"
                        color="primary"
                      />
                    }
                    label={formatMessage({ id: "active" })}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isDisplayed}
                        onChange={(e) => setFieldValue("isDisplayed", e.target.checked)}
                        name="isDisplayed"
                        color="primary"
                      />
                    }
                    label={formatMessage({ id: "isDisplayed" })}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isSpecial}
                        onChange={(e) => setFieldValue("isSpecial", e.target.checked)}
                        name="isSpecial"
                        color="primary"
                      />
                    }
                    label={formatMessage({ id: "Show on main page" })}
                  />
                </div>
                <div className="row"></div>
              </div>
              <div className="col-md-6">
                <Select
                  className="dropdown-select mb-4"
                  options={paytype(formatMessage)}
                  placeholder={formatMessage({ id: "paytype" })}
                  required
                  onChange={(selection) => {
                    setFieldValue("payType", selection.value);
                  }}
                  value={paytype(formatMessage).find((paytype) => paytype.value == values.payType)}
                />
                <ErrorMessage
                  condition={!!formik.submitCount && Boolean(errors?.payType)}
                  errorMsg={errors.payType}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <FileUploader
                  loader={loader}
                  titleId="ExtraserviceIcon"
                  image={iconUrl}
                  setImage={(file) => {
                    uploadImage(file);
                  }}
                  setLoader={setLoader}
                />
              </div>
              <div className="col-md-6">
                <FileUploader
                  loader={iconloader}
                  required={values.isSpecial}
                  titleId="Extraservice-Icon"
                  image={homepageIconUrl}
                  setImage={(file) => {
                    UploadHomeIcon(file);
                  }}
                  // setLoader={setLoader}
                />
                <ErrorMessage
                  condition={!!formik.submitCount && Boolean(errors?.homepageIconUrl)}
                  errorMsg={errors.homepageIconUrl}
                />
                
              </div>
            </div>

            <div className="pt-25 text-right">
              <button
                variant="contained"
                color="primary"
                className="btn btn-primary mr-4"
                type="submit"
                disabled={EditingBranch}
                onMouseDown={(e) => e.preventDefault()}
                onClick={formik.handleSubmit}
              >
                <FormattedMessage id="button.save" />
              </button>
              <button
                type="button"
                className="btn btn-danger mr-15 text-white"
                onClick={() => {
                  history.push("/cw/dashboard/extraservice");
                  formik.resetForm();
                }}
                disabled={EditingBranch}
              >
                <FormattedMessage id="button.cancel" />
              </button>
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default CreateEditExtraService;
