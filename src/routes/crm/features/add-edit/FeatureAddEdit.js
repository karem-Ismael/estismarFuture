import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import UpdateFeature from "gql/mutations/UpdateFeature.gql";
import Feature from "gql/queries/FeatureDetails.gql";
import UPLOAD_IMAGE from "gql/mutations/UploadImage.gql";
import { Autocomplete } from "@material-ui/lab";
import { AddEditFeature } from "validations/Feature.validations";
import CustomTextField from "components/Input/CustomTextField";
import { ErrorMessage } from "components/shared/ErrorMessage";
import { FileUploader } from "components/ImageUploader";
import { CircularProgressWithLabel } from "components/CircularProgressWithLabel";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import AsyncLoader from "components/AutoComplete/AsyncLoader";
import CreateFeature from "gql/mutations/CreateFeature.gql";
import { Features } from "gql/queries/getParent.gql";
import { FeatureType } from "constants/constants";
import TextField from "@material-ui/core/TextField";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { addEditFeatureInitValues } from "./FeatureAddEdit.model";
function CreateEditFeature() {
  const { featureId } = useParams();
  const history = useHistory();
  const { formatMessage, locale } = useIntl();
  const [icon, setIcon] = useState("");
  const [progress, setProgress] = useState(0);
  const [createfeature, { loading: creatingBranch, error: CreateError }] = useMutation(
    CreateFeature,
  );
  const { data: allfeatures, loading: gettingFeatures } = useQuery(Features, {
    skip: featureId,
    variables: { isParent: true, isActive: true },
  });
  const [updateFeature, { loading: EditingBranch, error: EditError }] = useMutation(UpdateFeature);
  const [uploadImageMutation, { loading: uploading, UploadError }] = useMutation(UPLOAD_IMAGE);
  const { data: featureDetailsRes, refetch } = useQuery(Feature, {
    skip: !featureId,
    variables: { id: +featureId },
  });

  useEffect(() => {
    refetch();
  }, [featureId]);

  useEffect(() => {
    if (CreateError?.message) {
      NotificationManager.error(CreateError?.message);
    }
    if (EditError?.message) {
      NotificationManager.error(EditError?.message);
    }
    if (UploadError?.message) {
      NotificationManager.error(UploadError?.message);
    }
  }, [EditError, UploadError]);

  useEffect(() => {
    if (featureDetailsRes?.feature) {
      if (featureDetailsRes.feature.parentId) {
        setFieldValue("isParent", true);
      }
      const { feature = {} } = featureDetailsRes;
      setFieldValue("nameAr", feature.nameAr || addEditFeatureInitValues.nameAr);
      setFieldValue("nameEn", feature.nameEn || addEditFeatureInitValues.nameEN);
      setFieldValue("displayOrder", feature.displayOrder);
      setFieldValue("parentId", feature.parentId || addEditFeatureInitValues.parentId);
      setFieldValue("category", feature.category || addEditFeatureInitValues.category);
      setFieldValue("isActive", feature.isActive || false);
      setIcon(feature.icon);
    }
    return () => {
      setIcon("");
    };
  }, [featureDetailsRes]);
  // END EDIT PROCESS

  useEffect(() => {
    if (icon) setFieldValue("icon", icon);
  }, [icon]);

  const formik = useFormik({
    initialValues: addEditFeatureInitValues,
    validationSchema: AddEditFeature,
    onSubmit: async (values) => {
      if (!values.icon.startsWith("http")) {
        await uploadImageMutation({
          variables: { image: values.icon, topic: "featureicon" },
        })
          .then((res) => {
            values.icon = res.data.imageUpload.imageUpload.imageUrl;
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
      const variables = { ...values };
      if (!featureId) {
        await createfeature({
          variables: {
            ...variables,
            parentId: !values?.isParent ? +values.parentId.id : undefined,
            displayOrder:
              typeof values?.displayOrder === "string" ? undefined : values?.displayOrder,
            // category: values.category.value,
          },
        })
          .then(() => {
            setProgress(100);
            NotificationManager.success(formatMessage({ id: "success.create.feature" }));
            history.push("/cw/dashboard/features");
          })
          .catch((err) => {
            NotificationManager.error(err?.message);
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator?.message);
            }
          });
      } else {
        await updateFeature({
          variables: {
            ...variables,
            featureId,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.edit.feature" }));
            refetch().then(() =>
              setTimeout(() => {
                history.push("/cw/dashboard/features");
              }, 3000),
            );
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

  const { values, setFieldValue, submitCount, handleChange: handleFormikChange, errors } = formik;

  function handleChange(e) {
    e.target.value = e.target.value.trimStart();
    handleFormikChange(e);
  }

  return (
    <>
      <Helmet>
        <title>
          {formatMessage({
            id: featureId ? "EditFeature" : "AddFeature",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={featureId ? "EditFeature" : "AddFeature"} />}
        match={location}
        lastElement={featureId || <IntlMessages id="AddFeature" />}
        enableBreadCrumb
      />
      <form onSubmit={formik.handleSubmit}>
        {!featureId && (
          <div className="d-flex mb-3" style={{ gap: "20px" }}>
            <div style={{ alignSelf: "center", minWidth: "150px", textAlign: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.isParent}
                    onChange={(e) => setFieldValue("isParent", e.target.checked)}
                    name="isParent"
                    color="primary"
                  />
                }
                label={formatMessage({ id: "isParent" })}
              />
            </div>
            <div className="w-100">
              <Autocomplete
                id="parent-dd"
                className="mt-2 mb-2"
                options={allfeatures?.features?.collection || []}
                getOptionLabel={(option) =>
                  option[`name${locale.charAt(0).toUpperCase() + locale.charAt(1)}`]
                    ?.charAt(0)
                    .toUpperCase() +
                  option[`name${locale.charAt(0).toUpperCase() + locale.charAt(1)}`]?.slice(1)
                }
                value={values.parentId}
                disableClearable
                onChange={(e, val) => {
                  setFieldValue("parentId", val);
                }}
                loading={gettingFeatures}
                disabled={values.isParent}
                renderInput={(p) => (
                  <AsyncLoader
                    error={submitCount && Boolean(errors?.parentId)}
                    params={p}
                    labelId="components.parent.feature"
                    loading={gettingFeatures}
                  />
                )}
              />
            </div>
          </div>
        )}
        {((featureId && featureDetailsRes && values?.category) || !featureId) && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <CustomTextField
                  fullWidth
                  required
                  name="nameAr"
                  value={values.nameAr}
                  onChange={handleChange}
                  error={!!submitCount && Boolean(errors.nameAr)}
                  errormsg={!!submitCount && errors.nameAr}
                />
              </div>
              <div className="col-md-6">
                <CustomTextField
                  fullWidth
                  required
                  name="nameEn"
                  value={values.nameEn}
                  onChange={handleChange}
                  error={!!submitCount && Boolean(errors.nameEn)}
                  errormsg={!!submitCount && errors.nameEn}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6" style={{ marginTop: "8px" }}>
                <CustomTextField
                  fullWidth
                  type="number"
                  name="displayOrder"
                  onInput={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6);
                  }}
                  defaultValue={values.displayOrder}
                  onChange={(e) => {
                    setFieldValue("displayOrder", +e.target.value);
                  }}
                />
              </div>
              <div className="col-md-6">
                {((featureId && featureDetailsRes && values?.category) || !featureId) && (
                  <Autocomplete
                    id="city-dd"
                    required
                    className="mt-2 mb-2"
                    options={FeatureType || []}
                    getOptionLabel={(option) => option.label}
                    value={FeatureType.find((feature) => feature.value == values?.category)}
                    disableClearable
                    onChange={(e, val) => {
                      setFieldValue("category", val.value);
                    }}
                    renderInput={(p) => (
                      <AsyncLoader
                        error={submitCount && Boolean(errors?.category)}
                        params={p}
                        labelId="components.category.feature"
                      />
                    )}
                  />
                )}
              </div>
            </div>

            <div className="row">
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
            </div>

            <div className="row">
              <div className="col-md-6">
                <FileUploader
                  error={!!submitCount && Boolean(errors?.icon)}
                  required
                  titleId="feature.icon"
                  image={icon}
                  setImage={setIcon}
                />
                <ErrorMessage
                  condition={!!submitCount && Boolean(errors?.icon)}
                  errorMsg={errors.icon}
                />
              </div>
            </div>

            <div className="pt-25 text-right">
              <button
                variant="contained"
                color="primary"
                className="btn btn-primary mr-4"
                type="submit"
                disabled={uploading || EditingBranch}
                onMouseDown={(e) => e.preventDefault()}
                onClick={formik.handleSubmit}
              >
                <FormattedMessage id="button.save" />
              </button>
              <button
                type="button"
                className="btn btn-danger mr-15 text-white"
                onClick={() => {
                  history.push("/cw/dashboard/features");
                  formik.resetForm();
                }}
                disabled={uploading || EditingBranch}
              >
                <FormattedMessage id="button.cancel" />
              </button>
              {progress === 100 ||
                ((uploading || creatingBranch) && progress > 0 && progress <= 100 && (
                  <CircularProgressWithLabel value={progress} />
                ))}
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default CreateEditFeature;
