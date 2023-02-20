/**
 * Form Dialog
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import { Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import CustomMuiInput from "components/Input/CustomMuiInput";
import { UpdateMakeMutation } from "gql/mutations/Make.mutations.gql";
import UPLOAD_IMAGE from "gql/mutations/UploadImage.gql";
import ImageCropper from "components/shared/ImageCropper";
import { CreateMakeValidationSchema } from "validations/Make.validations";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";

function UpdateMake({ make, handleCloseEdit, refetch }) {
  const [updateMakeMutation, { loading }] = useMutation(UpdateMakeMutation);
  const [uploadImageMutation, { loading: uploading }] = useMutation(UPLOAD_IMAGE);
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(true);
  const [logo, setLogo] = useState("");
  const [updateImage, setUpdateImage] = useState(false);

  function resetForm() {
    formik.resetForm();
    setLogo("");
  }

  React.useEffect(() => {
    if (make?.logo) {
      setLogo(make.logo);
    }
  }, [make]);

  React.useEffect(() => {
    if (logo) {
      formik.setFieldValue("logo", logo);
    }
  }, [logo]);

  const formik = useFormik({
    initialValues: {
      makeId: make.id,
      arName: make.arName,
      enName: make.enName,
      logo: make.logo,
    },
    validationSchema: CreateMakeValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      let URL;
      if (logo !== make.logo) {
        URL = await uploadImageMutation({ variables: { image: values.logo, topic: "make" } });
      }
      const { arName, enName } = values;
      await updateMakeMutation({
        variables: {
          makeId: make.id,
          arName,
          enName,
          logo: logo === make.logo ? make.logo : URL.data.imageUpload.imageUpload.imageUrl,
        },
      })
        .then(() => {
          setOpen(false);
          refetch();
          NotificationManager.success(formatMessage({ id: "success.create.make" }));
          resetForm();
        })
        .catch((err) => {
          NotificationManager.error(err.message);
        })
        .finally(() => {
          handleCloseEdit();
        });
    },
  });

  return (
    <div>
      <Dialog
        className="client-dialog"
        open={open}
        onClose={() => {
          setOpen(false);
          handleCloseEdit();
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
            {!updateImage && (
              <>
                <Button
                  variant="contained"
                  className="mb-2"
                  type="button"
                  onClick={() => {
                    setUpdateImage(true);
                    setLogo("");
                  }}
                >
                  <FormattedMessage id="change.logo" />
                </Button>
                <RctCollapsibleCard
                  colClasses="col-sm-12 col-md-12 col-lg-6"
                  heading={<FormattedMessage id="widgets.preview" />}
                  contentCustomClasses="d-flex"
                >
                  {make.logo && <img style={{ width: "100%" }} src={make.logo} alt="Make logo" />}
                </RctCollapsibleCard>
              </>
            )}
            {updateImage && (
              <Button
                variant="contained"
                className="mb-2"
                type="button"
                onClick={() => {
                  setUpdateImage(false);
                  setLogo(make.logo);
                }}
              >
                <FormattedMessage id="use.original.logo" />
              </Button>
            )}
            {updateImage && <ImageCropper name="logo" setImage={setLogo} image={logo} />}

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
                  handleCloseEdit();
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
    </div>
  );
}

UpdateMake.propTypes = {
  make: PropTypes.object,
  handleCloseEdit: PropTypes.func,
  refetch: PropTypes.func,
};

export default UpdateMake;
