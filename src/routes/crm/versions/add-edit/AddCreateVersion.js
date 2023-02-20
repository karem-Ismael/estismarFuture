/* eslint-disable jsx-a11y/control-has-associated-label */
/**
 * Create Version  Page
 */
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import { useFormik } from "formik";
import { CompaniesName } from "gql/queries/GetCompaniesName.gql";
import { TextField, Checkbox, FormControlLabel } from "@material-ui/core";
import { Makes } from "gql/queries/GetAllMake.gql";
import { ModelsOfMake } from "gql/queries/GetModelsOfMake.gql";
import { FileUploader } from "components/ImageUploader";
import { Autocomplete } from "@material-ui/lab";
import Paper from "@material-ui/core/Paper";
import { ImageUpload } from "gql/mutations/UploadImage.gql";
import { CreateCarVersion } from "gql/mutations/CreateVersion.gql";
import { NotificationManager } from "react-notifications";
import AsyncLoader from "components/AutoComplete/AsyncLoader";
import VehicleTypes from "gql/queries/GetAllVehicleType.gql";
import Features from "gql/queries/FeaturesList.gql";
import { CarVersion } from "gql/queries/GetCarVersion.gql";
import { AddEditVersion } from "validations/Version.validation";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import { UpdateCarVersion } from "gql/mutations/UpdateVersion.gql";
import { addEditVersionInitValues } from "./AddEditversion.model";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import "./style.css";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
export default function CreateEditVersion() {
  const classes = useStyles();
  const { locale, formatMessage } = useIntl();
  const history = useHistory();
  const { versionid } = useParams();
  const [images, setImage] = useState([""]);
  const [Carinsuranceimage, setCarInsuranceImage] = useState();
  const [page] = useState(1);
  const [limit] = useState(500);
  const [loader, setLoader] = useState([false]);
  const [imageUpload] = useMutation(ImageUpload);
  const [makeid, setMakeID] = useState();
  const [year, setYear] = useState();
  const [allfeatures, setFeatures] = useState([]);
  const [selectedfeature, setSelectedfeature] = useState([]);
  const [transmissionvalue, setTransmissionvalue] = useState();
  const [updateVersion] = useMutation(UpdateCarVersion);
  const [modelval, setModelVal] = useState(false);
  const { loading: getCompanies } = useQuery(CompaniesName, {
    variables: {
      limit,
      page,
    },
  });
  const { data: vehicleRes, loading: gettingvehicles } = useQuery(VehicleTypes, {});
  const { data: makes, loading: loadingMakes } = useQuery(Makes, {
    variables: {
      limit,
      page,
    },
  });
  const { data: features, loadingFeatures } = useQuery(Features, {
    variables: {
      limit,
      page,
      isChildren: true,
      isActive: true,
      category: "car_version",
    },
  });

  const { data: models, refetch: getModels } = useQuery(ModelsOfMake, {
    skip: !makeid,
    variables: {
      id: makeid,
    },
  });
  const { data: carVersion, refetch: refetchcarversion } = useQuery(CarVersion, {
    skip: !versionid,
    variables: {
      id: versionid,
    },
  });

  const [createversion] = useMutation(CreateCarVersion);

  const addImage = () => {
    const cloneimages = [...images, ""];
    const loaders = [...loader, false];
    setImage(cloneimages);
    setLoader(loaders);
  };
  const handelremove = (images, index) => {
    const imagesfilter = images.filter((image, idx) => +idx !== +index);
    setImage(imagesfilter);
  };
  const handelFeatures = (newfeatures, id) => {
    let AllFeatures = [];
    if (newfeatures.length > 1) {
      const lastfeature = newfeatures[newfeatures.length - 1]?.parent?.id;
      const duplicatedfeatures = newfeatures.filter((feature) => feature.parent?.id == lastfeature);
      const notduplicatedfeature = newfeatures.filter(
        (feature) => feature.parent?.id != lastfeature,
      );
      if (duplicatedfeatures.length >= 1) {
        AllFeatures = [duplicatedfeatures[duplicatedfeatures.length - 1], ...notduplicatedfeature];
        setFeatures(AllFeatures);
      }
    } else {

      setFeatures(newfeatures);
    }

    if (features.length == 0) {
      setFeatures([]);
    }

    const featuresids = AllFeatures.length ?AllFeatures.map((feature) => feature.id) :
    newfeatures.map((feature)=>feature.id)
    setFieldValue("features", featuresids);
  };
  const showimage = (file, index) => {
    const Allimages = [...images];
    const loads = [...loader];
    loads[index] = true;
    setLoader(loads);

    imageUpload({
      variables: {
        image: file,
        topic: "Car images ",
      },
    })
      .then((res) => {
        loads[index] = false;
        setLoader(loads);
        Allimages[index] = `${res.data.imageUpload.imageUpload.imageUrl}`;
        setImage(Allimages);
        setFieldValue("images", Allimages);
      })
      .catch((error) => NotificationManager.error(error?.message));
  };
  const uploadcarinsuranceImage = (file) => {
    imageUpload({
      variables: {
        image: file,
        topic: "Car Thumb Image ",
      },
    })
      .then((res) => {
        setCarInsuranceImage(res.data.imageUpload.imageUpload.imageUrl);
      })
      .catch((error) => NotificationManager.error(error?.message));
  };
  const handelSaveCar = () => {
    const geterrors = {};
    if (!makeid) {
      geterrors.Make = "thisfieldisrequired";
    }
    if (!modelId) {
      geterrors.Model = "thisfieldisrequired";
    }
    if (!transmissionvalue) {
      geterrors.transmissionvalue = "thisfieldisrequired";
    }
    if (!year) {
      geterrors.year = "thisfieldisrequired";
    }
    if (!images[0].length) {
      geterrors.carimage = "thisfieldisrequired";
    }
    if (!Object.keys(geterrors).length) {
      createversion({
        variables: {
          carModelId: +modelId,
          image: Carinsuranceimage,
          images,
          transmission: transmissionvalue,
          year,
        },
      })
        .then(() => {
          NotificationManager.success(<FormattedMessage id="versionaddedsuccessfully" />);
          versionsfetch();
        })
        .then(() => history.push("/cw/dashboard/versions"))
        .catch((err) => NotificationManager.error(err?.message));
    } else {
      setErrors(geterrors);
    }
  };
  const generateArrayOfYears = () => {
    const max = new Date().getFullYear() + 2;
    const min = max - 23;
    const years = [];
    for (let i = max; i >= min; i -= 1) {
      years.push(i.toString());
    }
    return years;
  };

  const formik = useFormik({
    initialValues: addEditVersionInitValues,
    validationSchema: AddEditVersion,
    onSubmit: async (values) => {
      const variables = { ...values };
      if (!versionid) {
        await createversion({
          variables: {
            ...variables,
          },
        })
          .then(() => {
            NotificationManager.success(<FormattedMessage id="versionaddedsuccessfully" />);
            history.push("/cw/dashboard/versions");
          })
          .catch((err) => {
            NotificationManager.error(err?.message);
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator?.message);
            }
          });
      } else {
        updateVersion({
          variables: {
            ...variables,
            carVersionId: +versionid,
          },
        })
          .then(() => {
            NotificationManager.success(<FormattedMessage id="versioneditedsuccessfully" />);
            refetchcarversion();
          })
          .then(() => history.push("/cw/dashboard/versions"))
          .catch((err) => NotificationManager.error(err?.message));
      }
    },
  });
  const { values, setFieldValue, submitCount, handleChange: handleFormikChange, errors } = formik;
  useEffect(() => {
    if (carVersion) {
      if (features) {
        const existfeatures = features?.features?.collection.filter((feature) =>
          carVersion.carVersion.features.map((cf) => cf.id).includes(feature.id),
        );
        setFeatures([...existfeatures]);
        setFieldValue("features",existfeatures.map(feature=>feature.id))
      }

      setFieldValue(
        "makeId",
        carVersion.carVersion.carModel.make.id || addEditVersionInitValues.makeId,
      );
      setFieldValue("year", carVersion.carVersion.year);
      setFieldValue("carModelId", carVersion.carVersion.carModel.id);
      setFieldValue("vehicleTypeId", carVersion.carVersion.vehicleType.id);
      setFieldValue("isActive", carVersion.carVersion.isActive);
      setFieldValue("makeId", +carVersion.carVersion.carModel.make.id);
      setMakeID(+carVersion.carVersion.carModel.make.id);
      setImage(carVersion.carVersion.images);
      setCarInsuranceImage(carVersion.carVersion.image);
    }
  }, [carVersion, features]);

  useEffect(() => {
    setFieldValue("image", Carinsuranceimage);
  }, [Carinsuranceimage]);
  useEffect(() => {
    setFieldValue("images", images);
  }, [images]);
  useEffect(() => {
    if (models) {
      setModelVal(true);
    }
  }, [models]);
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>
          {formatMessage({
            id: versionid ? "EditVersion" : "AddVersion",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={versionid ? "EditVersion" : "AddVersion"} />}
        match={location}
        lastElement={versionid ? versionid : <IntlMessages id={"AddVersion"} />}
        enableBreadCrumb
      />
      {(!versionid || (versionid && carVersion)) && (
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="row mt-3">
            <div className="col-md-3">
              {((makes?.makes?.collection?.length && values.makeId) || !versionid) && (
                <Autocomplete
                  id="=make name"
                  name="carmake"
                  options={makes?.makes.collection || []}
                  className="mt-2 mb-2"
                  getOptionLabel={(option) => option?.[`${locale}Name`]}
                  value={makes?.makes.collection.find((make) => make.id == makeid)}
                  disableClearable
                  onChange={(e, newValue) => {
                    setMakeID(newValue.id);
                    setFieldValue("makeId", newValue.id);
                  }}
                  loading={loadingMakes}
                  renderInput={(p) => (
                    <AsyncLoader
                      error={
                        submitCount &&
                        errors?.makeId && <FormattedMessage id="thisfieldisrequired" />
                      }
                      params={p}
                      labelId="carmake"
                    />
                  )}
                />
              )}
            </div>
            <div className="col-md-3">
              {((modelval && values?.carModelId) || !versionid) && (
                <Autocomplete
                  id="=Model name"
                  name="modelId"
                  options={models?.make.carModels || []}
                  className="mt-2 mb-2"
                  getOptionLabel={(option) => option?.[`${locale}Name`]}
                  value={models?.make.carModels.find((model) => +model.id == +values?.carModelId)}
                  disableClearable
                  onChange={(e, newvalue) => {
                    setFieldValue("carModelId", +newvalue.id);
                  }}
                  loading={getCompanies}
                  renderInput={(p) => (
                    <AsyncLoader
                      error={
                        submitCount &&
                        errors?.carModelId && <FormattedMessage id="thisfieldisrequired" />
                      }
                      params={p}
                      labelId="carmodel"
                    />
                  )}
                />
              )}
            </div>
            <div className="col-md-3" style={{ marginTop: "0px" }}>
              {((vehicleRes?.vehicleTypes.length && values?.vehicleTypeId) || !versionid) && (
                <Autocomplete
                  id="city-dd"
                  className="mt-2 mb-2"
                  options={vehicleRes?.vehicleTypes || []}
                  getOptionLabel={(option) => option[`${locale}Name`]}
                  value={vehicleRes?.vehicleTypes.find(
                    (vehicle) => vehicle.id == values?.vehicleTypeId,
                  )}
                  disableClearable
                  onChange={(e, val) => {
                    setFieldValue("vehicleTypeId", val.id);
                  }}
                  renderInput={(p) => (
                    <AsyncLoader
                      error={submitCount && Boolean(errors?.vehicleTypeId)}
                      params={p}
                      labelId="vehicle.type"
                    />
                  )}
                />
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              {(values?.year || !versionid) && (
                <Autocomplete
                  id="city-dd"
                  className="mt-2 mb-2"
                  options={generateArrayOfYears() || []}
                  getOptionLabel={(option) => option}
                  value={generateArrayOfYears().find((year) => +year == +values?.year)}
                  disableClearable
                  onChange={(e, val) => {
                    setYear(+val);
                    setFieldValue("year", +val);
                  }}
                  renderInput={(p) => (
                    <AsyncLoader
                      params={p}
                      labelId="car.year"
                      error={submitCount && Boolean(errors?.year)}
                    />
                  )}
                />
              )}
            </div>
            <div className="col-md-3" style={{ marginTop: "5px" }}>
              {allfeatures ? (
                <Autocomplete
                  id="features"
                  multiple
                  options={features?.features?.collection || []}
                  groupBy={(option) =>
                    option.parent?.[`name${locale.charAt(0).toUpperCase() + locale.charAt(1)}`]
                  }
                  getOptionLabel={(option) =>
                    option[`name${locale.charAt(0).toUpperCase() + locale.charAt(1)}`]
                  }
                  renderOption={(option, { selected, inputValue }) => (
                    <>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      <img src={option?.icon} style={{ width: "30px" }} />
                      {option[`name${locale.charAt(0).toUpperCase() + locale.charAt(1)}`]}
                    </>
                  )}
                  value={
                    features?.features?.collection.find((feature) => allfeatures?.includes(feature))
                      ? allfeatures
                      : []
                  }
                  onChange={(id, newValue) => handelFeatures(newValue, id)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<FormattedMessage id="carfeature" />}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              ) : (
                "0"
              )}
            </div>

            <div className="col-md-3">
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
          </div>
          <div className="row mt-4">
            <div className="col-md-3">
              <FileUploader
                titleId="CarThumbimage"
                imgheight={180}
                imgwidth={300}
                image={Carinsuranceimage}
                setImage={(file) => {
                  uploadcarinsuranceImage(file);
                }}
              />
            </div>
            {images.map((image, index) => (
              <div className="col-md-3">
                <FileUploader
                  titleId="carimage"
                  imgremove={index}
                  remove={() => handelremove(images, index)}
                  image={image}
                  imgwidth={1104}
                  imgheight={596}
                  loader={loader[index]}
                  setImage={(file) => {
                    // setImage(());
                    showimage(file, index);
                  }}
                />
                {!index && submitCount && errors?.images ? (
                  <helperText className="text-danger">
                    <FormattedMessage id="thisfieldisrequired" />
                  </helperText>
                ) : null}
              </div>
            ))}

            {images.length < 10 && images[0]?.length > 0 && (
              <Paper
                className="col-md-2 "
                style={{
                  alignItems: "center",
                  minHeight: "200px",
                  textAlign: "center",
                  cursor: "pointer",
                  maxHeight: "200px",
                  marginTop: "30px",
                }}
                elevation={1}
                disabled
              >
                <i className="fas fa-plus" onClick={() => addImage()}></i>
              </Paper>
            )}
          </div>
          <div className="row justify-content-end">
            <div className="col-md-6">
              <div className="row justify-content-center">
                <div className="col-md-3 mt-2">
                  <button type="submit" className="btn btn-primary text-center text-white">
                    <FormattedMessage id="save" />
                  </button>{" "}
                </div>
                <div className="col-md-3 mt-2">
                  <button
                    onClick={() => history.goBack()}
                    type="button"
                    className="btn btn-danger text-white text-center"
                  >
                    <FormattedMessage id="cancel" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
