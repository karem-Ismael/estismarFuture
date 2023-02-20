/**
 * Form Dialog
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import { Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import CustomMuiInput from "components/Input/CustomMuiInput";
import { CreateMakeMutation } from "gql/mutations/Make.mutations.gql";
import UPLOAD_IMAGE from "gql/mutations/UploadImage.gql";
import ImageCropper from "components/shared/ImageCropper";
import { CreateMakeValidationSchema } from "validations/Make.validations";
import IntlMessages from "util/IntlMessages";

function CreateMake({ requestData }) {
  const [createMakeMutation, { loading }] = useMutation(CreateMakeMutation);
  const [uploadImageMutation, { loading: uploading }] = useMutation(UPLOAD_IMAGE);
  const { formatMessage, messages } = useIntl();
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState("");

  function resetForm() {
    formik.resetForm();
    setLogo("");
  }

  useEffect(() => {
    if (!open) {
      setLogo("");
      ["logo", "arName", "enName"].forEach((prop) => formik.setFieldValue(prop, ""));
    }
  }, [open]);

  React.useEffect(() => {
    if (logo) {
      formik.setFieldValue("logo", logo);
    }
  }, [logo]);

  const formik = useFormik({
    initialValues: {
      arName: "",
      enName: "",
      logo: "",
    },
    validationSchema: CreateMakeValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const { arName, enName } = values;
      if (arName.trim().length === 0 || enName.trim().length === 0) {
        NotificationManager.error(<FormattedMessage id="validation.namesCannotBeBlank" />);
        return;
      }
      const URL = await uploadImageMutation({ variables: { image: values.logo, topic: "make" } });
      await createMakeMutation({
        variables: { arName, enName, logo: URL.data.imageUpload.imageUpload.imageUrl },
      })
        .then(() => {
          setOpen(false);
          NotificationManager.success(formatMessage({ id: "success.create.make" }));
          requestData();
          resetForm();
          setLogo("");
        })
        .catch((err) => {
          NotificationManager.error(err?.message);
        });
    },
  });

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className="mx-sm-15 btn btn-success"
        onClick={() => setOpen(true)}
      >
        <i className="zmdi zmdi-plus" />
        <IntlMessages id="add.something" values={{ something: messages?.make }} />
      </Button>
      <Dialog
        className="client-dialog"
        open={open}
        onClose={() => {
          setOpen(false);
          setLogo("");
        }}
        fullWidth
        maxWidth="lg"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <FormattedMessage
            id="common.addSomething"
            values={{ something: formatMessage({ id: "make" }) }}
          />
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <CustomMuiInput
              fullWidth
              id="arName"
              name="arName"
              label="arName"
              placeholder={formatMessage({ id: "common.arName" })}
              value={formik.values.arName}
              onChange={formik.handleChange}
              error={formik.touched.arName && Boolean(formik.errors.arName)}
              errormsg={formik.touched.arName && formik.errors.arName}
            />
            <CustomMuiInput
              fullWidth
              id="enName"
              name="enName"
              label="enName"
              placeholder={formatMessage({ id: "common.enName" })}
              value={formik.values.enName}
              onChange={formik.handleChange}
              error={formik.touched.enName && Boolean(formik.errors.enName)}
              errormsg={formik.touched.enName && formik.errors.enName}
            />

            <ImageCropper name="logo" setImage={setLogo} image={logo} />

            <div className="pt-25 text-right">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="mr-15"
                disabled={!logo || !formik.isValid || loading || uploading}
              >
                <FormattedMessage id="button.save" />
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
                className="btn-danger mr-15 text-white"
                disabled={loading || uploading}
              >
                <FormattedMessage id="button.cancel" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

CreateMake.propTypes = {
  requestData: PropTypes.func,
};

export default CreateMake;
