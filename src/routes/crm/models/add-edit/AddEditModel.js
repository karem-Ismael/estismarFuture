import React, { useEffect } from "react";
import { MakesDropDown } from "components/DropDowns";
import CustomTextField from "components/Input/CustomTextField";
import { useFormik } from "formik";
import { CreateModelMutation, EditModelMutation } from "gql/mutations/Model.mutations.gql";
import { CarModelById } from "gql/queries/AllModels.gql";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "components/shared/ErrorMessage";
import { CreateMakeValidationSchema } from "validations/Modle.validations";
import { useHistory, useParams } from "react-router";
import { NotificationManager } from "react-notifications";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
function AddEditModel() {
  const history = useHistory();
  const { modelId } = useParams();
  const { formatMessage } = useIntl();
  const [CreateNewModelMutation, { loading: creatingModel }] = useMutation(CreateModelMutation);
  const [EditNewModelMutation, { loading: editingModel }] = useMutation(EditModelMutation);
  const { data, loading: gettingData } = useQuery(CarModelById, {
    skip: !modelId,
    variables: { id: +modelId },
  });

  useEffect(() => {
    if (data?.carModel) {
      const details = data.carModel;
      setFieldValue("modelArName", details.arName);
      setFieldValue("modelEnName", details.enName);
      setFieldValue("make", details?.make?.id);
    }
  }, [data]);

  const formik = useFormik({
    initialValues: {
      modelArName: "",
      modelEnName: "",
      make: "",
    },
    validationSchema: CreateMakeValidationSchema,
    onSubmit: async (values) => {
      if (!modelId) {
        CreateNewModelMutation({
          variables: {
            arName: values.modelArName,
            enName: values.modelEnName,
            makeId: +values.make,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.create.model" }));
            formik.resetForm();
          })
          .catch((err) => {
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator);
            }
          });
      } else {
        EditNewModelMutation({
          variables: {
            id: +modelId,
            arName: values.modelArName,
            enName: values.modelEnName,
            makeId: +values.make,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.edit.model" }));
            formik.resetForm();
            history.push("/cw/dashboard/models");
          })
          .catch((err) => {
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator);
            }
          });
      }
    },
  });

  const { values, touched, handleChange, errors, setFieldValue, handleSubmit } = formik;

  return (
    <>
      <Helmet>
        <title>
          {formatMessage({
            id: modelId ? "EditModel" : "AddModel",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={modelId ? "EditModel" : "AddModel"} />}
        match={location}
        lastElement={modelId ? modelId : <IntlMessages id={"AddModel"} />}
        enableBreadCrumb
      />
      <form onSubmit={() => {}}>
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <CustomTextField
              fullWidth
              required
              name="modelArName"
              value={values.modelArName}
              onChange={handleChange}
              error={!!formik.submitCount && Boolean(errors.modelArName)}
              errormsg={touched.modelArName && errors.modelArName}
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <CustomTextField
              fullWidth
              required
              name="modelEnName"
              value={values.modelEnName}
              onChange={handleChange}
              error={!!formik.submitCount && Boolean(errors.modelEnName)}
              errormsg={touched.modelEnName && errors.modelEnName}
            />
          </div>
        </div>
        <MakesDropDown
          valueAttribute="id"
          setSelectedMake={(value) => setFieldValue("make", value)}
          selectedMake={values?.make}
          error={!!formik.submitCount && Boolean(errors.make)}
        />

        <ErrorMessage
          condition={!!formik.submitCount && Boolean(errors.make)}
          errorMsg={errors.make}
        />
        <div className="pt-25 text-right">
          <button
            variant="contained"
            color="primary"
            className="btn btn-primary mr-4"
            type="submit"
            disabled={creatingModel || editingModel || gettingData}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSubmit}
          >
            <FormattedMessage id="button.save" />
          </button>
          <button
            type="button"
            className="btn btn-danger mr-15 text-white"
            onClick={() => {
              history.push("/cw/dashboard/models");
              formik.resetForm();
            }}
            disabled={creatingModel || editingModel || gettingData}
          >
            <FormattedMessage id="button.cancel" />
          </button>
        </div>
      </form>
    </>
  );
}

export default AddEditModel;
