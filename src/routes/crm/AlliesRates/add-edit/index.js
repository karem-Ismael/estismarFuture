/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable radix */
/* eslint-disable no-undefined */
/* eslint-disable prettier/prettier */
import React, { useEffect, useLayoutEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import UpdateRate from "gql/mutations/UpdateAlliesRate.gql";
import Rate from "gql/queries/AlliesRateDetails.gql";
import { AddEditRate } from "validations/Rate.validations";
import CustomTextField from "components/Input/CustomTextField";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import CreateRate from "gql/mutations/CreateAlliesRate.gql";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { initValues } from "./AddEdit.model";
function AddEdit() {
  const { alliesRateId } = useParams();
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [createRate] = useMutation(CreateRate);
  const [updateRate] = useMutation(UpdateRate);
  const [fetchRates, { refetch: refetchRates, data: ratesData }] = useLazyQuery(Rate, {
    variables: { skip: !alliesRateId, id: alliesRateId },
  });

  useEffect(() => {
    if (alliesRateId) fetchRates();
  }, [alliesRateId]);

  useLayoutEffect(() => {
    setFieldValue("nameAr", ratesData?.rate?.arName);
    setFieldValue("nameEn", ratesData?.rate?.enName);
    setFieldValue("displayOrder", ratesData?.rate?.displayOrder);
    setFieldValue("isActive", ratesData?.rate?.isActive || false);
    setFieldValue("isBarq", ratesData?.rate?.isBarq || false);
    setFieldValue("isInstantConfirmation", ratesData?.rate?.isInstantConfirmation || false);
  }, [ratesData]);
  // END EDIT PROCESS

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: AddEditRate,
    onSubmit: async (values) => {
      if (!alliesRateId) {
        await createRate({
          variables: {
            arName: values.nameAr,
            enName: values.nameEn,
            isActive: values.isActive,
            displayOrder: Number(values.displayOrder),
            isBarq: values.isBarq,
            isInstantConfirmation: values.isInstantConfirmation,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.create.alliesRate" }));
            history.push("/cw/dashboard/allies-rates");
          })
          .catch((err) => {
            NotificationManager.error(err?.message);
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator?.message);
            }
          });
      } else {
        await updateRate({
          variables: {
            arName: values.nameAr,
            enName: values.nameEn,
            isActive: values.isActive,
            displayOrder: Number(values.displayOrder),
            rateId: alliesRateId,
            isBarq: values.isBarq,
            isInstantConfirmation: values.isInstantConfirmation,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.edit.rate" }));
            async function refetch() {
              const res = await refetchRates();
              if (res) {
                history.push("/cw/dashboard/allies-rates");
              }
            }
            refetch();
          })
          .catch((err) => {
            NotificationManager.error(err.message);
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
            id: alliesRateId ? "EditRate" : "AddRate",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={alliesRateId ? "EditRate" : "AddRate"} />}
        match={location}
        lastElement={alliesRateId || <IntlMessages id="AddRate" />}
        enableBreadCrumb
      />
      <form onSubmit={formik.handleSubmit}>
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
                placeholder=""
                label={formatMessage({ id: "RateAr" })}
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
                placeholder=""
                label={formatMessage({ id: "RateEn" })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6" style={{ marginTop: "8px" }}>
              <CustomTextField
                fullWidth
                required
                name="displayOrder"
                value={values.displayOrder}
                inputProps={{ maxLength: 9 }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                onChange={handleChange}
                error={!!submitCount && Boolean(errors.displayOrder)}
                errormsg={!!submitCount && errors.displayOrder}
              />
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.isBarq}
                  onChange={(e) => setFieldValue("isBarq", e.target.checked)}
                  name="isBarq"
                  color="primary"
                />
              }
              label={formatMessage({ id: "isBarq" })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.isInstantConfirmation}
                  onChange={(e) => setFieldValue("isInstantConfirmation", e.target.checked)}
                  name="isInstantConfirmation"
                  color="primary"
                />
              }
              label={formatMessage({ id: "isInstantConfirmation" })}
            />
          </div>

          <div className="pt-25 text-right">
            <button
              variant="contained"
              color="primary"
              className="btn btn-primary mr-4"
              type="submit"
              onMouseDown={(e) => e.preventDefault()}
              onClick={formik.handleSubmit}
            >
              <FormattedMessage id="button.save" />
            </button>
            <button
              type="button"
              className="btn btn-danger mr-15 text-white"
              onClick={() => {
                history.push("/cw/dashboard/allies-rates");
                formik.resetForm();
              }}
            >
              <FormattedMessage id="button.cancel" />
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddEdit;
