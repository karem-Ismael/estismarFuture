/* eslint-disable no-restricted-globals */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undefined */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { NotificationManager } from "react-notifications";
import {
  InputLabel,
  FormControl,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Helmet } from "react-helmet";
import { CompaniesName } from "gql/queries/GetCompaniesName.gql";
import { Makes } from "gql/queries/GetAllMake.gql";
import { ModelsOfMake } from "gql/queries/GetModelsOfMake.gql";
import { companyBranches } from "gql/queries/GetCompanyBranchs.gql";
import { VehicleTypes } from "gql/queries/GetAllVehiclesType.gql";
import { Insurances } from "gql/queries/GetInsurances.gql";
import { CarVersions } from "gql/queries/GetCarVersions.gql";
import { CreateCar } from "gql/mutations/CreateCar.gql";
import { DeleteForever as DeleteForeverIcon } from "@material-ui/icons";
import { transmissions, persist, rentalMonths, carStatus } from "constants/constants";
import Counter from "components/shared/Counter";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Features } from "gql/queries/getParent.gql";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import IntlMessages from "util/IntlMessages";
import { UpdateCar } from "gql/mutations/UpdatedCar.gql";
import { CarProfile } from "gql/queries/getCarProfile.gql";
import { Branches } from "gql/queries/AllBranches.gql";
import "./style.css";
const { higherUnlimited, defaultPage } = persist;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
export default function EditCar() {
  const [errors, setErrors] = useState();
  const { locale, formatMessage } = useIntl();
  const { id } = useParams();

  const history = useHistory();
  const [distancepermonth, setDistanceperMonth] = useState();
  const [branchesChange, setBranchesChange] = useState(false);
  const [refrenceCode, setRefrenceCode] = useState();

  const [insuranceChange, setInsuranceChange] = useState(false);
  const [insuranceValidation, setInsuranceValidation] = useState({
    standard: null,
    daily: null,
    monthly: null,
  });
  const [distanceperday, setDistanceperDay] = useState();
  const [distanceperweek, setDistanceperWeek] = useState();
  const [, setrentperweek] = useState();
  const [rentperday, setRentPerDay] = useState();
  const [, setRentPerMonth] = useState();
  const [cid, setID] = useState();
  const [makeid, seMakeID] = useState();
  const [gurarante, setGuaranteAmount] = useState();
  const [deliverytocustomer, setDelevieryTocustomer] = useState();
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [branchesCount, setBranchesCount] = useState([]);
  const [modelId, setModelID] = useState();
  const [insuranceValues, setInsuranceValues] = useState([
    { insuranceId: "1", value: "" },
    { insuranceId: "2", value: "", monthlyValue: "" },
  ]);
  const [selectedInsuranceid, setSelectedInsuranceID] = useState();
  const [transmissionvalue, setTransmissionvalue] = useState();
  const [additionaldistancecost, setAdditionalDistanceCost] = useState();
  const [companyname, setCompanyName] = useState();
  const [availabilityStatus, SetAvailabilityStatus] = useState(true);
  const [features, setFeatures] = useState([]);
  const [vhecileId, setVhecileID] = useState();
  const [versionID, setVersionID] = useState();
  const [weeklyprice, setWeeklyprice] = useState();
  const [monthlyprice, setMonthlyprice] = useState();
  const [featuresData, setFeaturesData] = useState([]);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [isUnlimitedFree, setIsUnlimitedFree] = useState(false);
  const [unlimitedFeePerDay, setUnlimitedFeePerDay] = useState("");
  const [monthsprice, SetMonthsPrice] = useState({});
  const [updateCar] = useMutation(UpdateCar);
  const [standardChecked, setStandardChecked] = useState();
  const [fullChecked, setFullChecked] = useState();

  const { data, loading: getCompanies } = useQuery(CompaniesName, {
    variables: { limit: 500, page: defaultPage },
  });
  const { data: carfeatures, refetch, loading } = useQuery(Features, {
    variables: { isParent: true, isActive: true, category: "car" },
  });
  const { data: carprofiledata, loading: getcarprofile } = useQuery(CarProfile, {
    variables: {
      id,
    },
  });

  const { data: makes, loadingMakes } = useQuery(Makes, {
    variables: { limit: higherUnlimited, page: defaultPage },
  });
  const { data: vtypes, loading: vhecilesloading } = useQuery(VehicleTypes);
  const { data: insuraceType } = useQuery(Insurances);

  const { data: models, loading: getmodels, refetch: Allmodels } = useQuery(ModelsOfMake, {
    skip: !carprofiledata?.carProfile?.makeId,

    variables: {
      id: carprofiledata?.carProfile?.makeId,
    },
  });

  const { data: branches2, loading: loadbranches, refetch: refetchBranches } = useQuery(Branches, {
    skip: !carprofiledata?.carProfile?.branch.allyCompanyId,
    variables: {
      allyCompanyIds: carprofiledata?.carProfile?.branch.allyCompanyId,
    },
  });

  const { data: carversions, refetch: fetchversions, loading: getcarversions } = useQuery(
    CarVersions,
    {
      skip: !carprofiledata?.carProfile?.carModelId,
      variables: {
        carModelId: +carprofiledata?.carProfile?.carModelId,
        limit: higherUnlimited,
        page: defaultPage,
      },
    },
  );

  const [createCar] = useMutation(CreateCar);

  const handleChange = (index, event) => {
    const data = event.map((feature) => feature.id);

    setFeaturesData(data);
    setFeatures(event);
  };

  const handelSaveCar = () => {
    const geterrors = {};
    if (!selectedBranches.length) {
      geterrors.brnachname = "thisfieldisrequired";
    }
    if (!transmissionvalue?.length) {
      geterrors.transmissionvalue = "thisfieldisrequired";
    }
    // sets error required of insurance inputs
    if (!insuranceValues[0].value && !insuranceValues[1]?.value) {
      geterrors.insurance = "thisfieldisrequired";
    }
    const standardInsurancePayload = insuranceValues.filter((i) => i.insuranceId !== "2");
    const fullInsurancePayload = insuranceValues.filter((i) => i.insuranceId !== "1");
    if (
      fullChecked &&
      insuranceValidation.daily &&
      insuranceValidation.monthly &&
      !errors?.insurance
    ) {
      NotificationManager.error(formatMessage({ id: "Please enter a daily or monthly value!" }));
    }
    if (
      !Object.keys(geterrors).length &&
      !insuranceValidation.standard &&
      (!insuranceValidation.daily || !insuranceValidation.monthly)
    ) {
      // debugger;
      updateCar({
        variables: {
          additionalDistanceCost: additionaldistancecost || 0,
          carsCount: +branchesCount[0].count,
          availableCarsCount: branchesCount[0].availableCount,
          carFeatureAttributes: featuresData,
          carInsuranceAttributes: insuranceChange
            ? standardChecked && fullChecked
              ? insuranceValues
              : !standardChecked
              ? fullInsurancePayload
              : !fullChecked
              ? standardInsurancePayload
              : insuranceValues
            : undefined,
          carModelId: modelId,
          carVersionId: versionID,
          dailyPrice: rentperday,
          deliverToCustomerLocationCost: deliverytocustomer,
          accidentPenalty: 0.0,
          distanceByDay: distanceperday,
          guaranteeAmount: gurarante,
          makeId: makeid,
          monthlyPrice: monthlyprice,
          transmission: transmissionvalue,
          weeklyPrice: weeklyprice,
          isUnlimited,
          isUnlimitedFree,
          unlimitedFeePerDay: Number(unlimitedFeePerDay),
          monthsPrice: monthsprice?.__typename ? undefined : monthsprice,
          availabilityStatus,
          carId: id,
          referenceCode: refrenceCode,
        },
      })
        .then(() => {
          NotificationManager.success(<FormattedMessage id="careditsuccessfully" />);
          history.push(history.location.state?.detail || history.location);
        })
        .catch((err) => {
          NotificationManager.error(err?.message);
        });
    } else {
      setErrors(geterrors);
    }
  };

  useEffect(() => {
    if (selectedBranches.length > 0) {
      const newBranchesCount = [...selectedBranches].map((br) => {
        const count = [...branchesCount].find((b) => +b?.id === +br?.id);
        return count
          ? { ...count }
          : {
              id: br?.id,
              count: br.count ? br.count : 0,
              arName: br.arName,
              enName: br.enName,
              availableCount: br.availableCount ? br.availableCount : 0,
            };
      });
      setBranchesCount(newBranchesCount);
    } else {
      setBranchesCount([]);
    }
  }, [selectedBranches]);
  useEffect(() => {
    if (carprofiledata) {
      setModelID(+carprofiledata?.carProfile?.carModelId);
      const selectedFeatures = carfeatures?.features.collection.filter((feature) =>
        carprofiledata?.carProfile.features.find((efeature) => efeature.id == feature.id),
      );
      SetAvailabilityStatus(carprofiledata?.carProfile?.availabilityStatus);
      setFeatures(selectedFeatures);
      const data = [
        {
          id: carprofiledata.carProfile.branch.id,
          enName: carprofiledata.carProfile.branch.enName,
          arName: carprofiledata.carProfile.branch.arName,
          count: carprofiledata.carProfile.carsCount,
          availableCount: carprofiledata.carProfile.availableCarsCount,
        },
      ];
      setTransmissionvalue(carprofiledata?.carProfile?.transmission);

      setSelectedBranches(data);
      SetMonthsPrice(carprofiledata.carProfile.monthsPrice);
      if (carprofiledata.carProfile.carInsurances.length) {
        const insurance = carprofiledata.carProfile.carInsurances.map((insurance) => ({
          insuranceId: insurance.insuranceId,
          value: insurance.value,
        }));
        const standard = insurance.find((i) => i.insuranceId === "1");
        const full = insurance.find((i) => i.insuranceId === "2");
        setInsuranceValues([
          { ...insuranceValues[0], value: standard?.value },
          { ...insuranceValues[1], value: full?.value, monthlyValue: full?.monthlyValue },
        ]);
        if (
          carprofiledata?.carProfile.carInsurances.find(
            (insurance) => +insurance.insuranceId == "1",
          )?.value
        ) {
          setStandardChecked(true);
        }
        if (
          carprofiledata?.carProfile.carInsurances.find(
            (insurance) => +insurance.insuranceId == "2",
          )?.value
        ) {
          setFullChecked(true);
        }
      }
      setIsUnlimited(carprofiledata.carProfile.isUnlimited);
      setIsUnlimitedFree(carprofiledata.carProfile.isUnlimitedFree);
      setAdditionalDistanceCost(carprofiledata?.carProfile.additionalDistanceCost);
      setUnlimitedFeePerDay(carprofiledata?.carProfile?.unlimitedFeePerDay);
      setRefrenceCode(carprofiledata?.carProfile?.referenceCode);
    }
  }, [carprofiledata]);
  const handelMonthsprice = (value, month) => {
    const cmonths = { ...monthsprice };
    delete cmonths?.__typename;
    for (const propName in cmonths) {
      if (cmonths[propName] === null || cmonths[propName] === undefined) {
        delete cmonths[propName];
      }
    }
    if (month == 2) {
      cmonths.twoMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 3) {
      cmonths.threeMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 4) {
      cmonths.fourMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 5) {
      cmonths.fiveMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 6) {
      cmonths.sixMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 7) {
      cmonths.sevenMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 8) {
      cmonths.eightMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 9) {
      cmonths.nineMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 10) {
      cmonths.tenMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 11) {
      cmonths.elevenMonths = +value;
      SetMonthsPrice(cmonths);
    } else if (month == 12) {
      cmonths.twelveMonths = +value;
      SetMonthsPrice(cmonths);
    } else {
      cmonths.twentyFourMonths = +value;
      SetMonthsPrice(cmonths);
    }
  };
  const TextFieldGenerator = (insuranceId, insuraceType) => (
    <>
      {((standardChecked && insuranceId == "1") || (fullChecked && insuranceId == "2")) && (
        <TextField
          defaultValue={
            insuraceType === "standard" || insuraceType === "daily"
              ? carprofiledata?.carProfile.carInsurances.find(
                  (insurance) => +insurance.insuranceId == +insuranceId,
                )?.value
              : carprofiledata?.carProfile.carInsurances.find(
                  (insurance) => +insurance.insuranceId == +insuranceId,
                )?.monthlyValue
          }
          error={Boolean(errors?.insurance)}
          helperText={errors?.insurance ? <FormattedMessage id="thisfieldisrequired" /> : null}
          type="number"
          InputProps={{ inputProps: { maxLength: 5 } }}
          variant="outlined"
          label={
            insuraceType === "standard" ? (
              <FormattedMessage id="insurancevalue" />
            ) : insuraceType === "daily" ? (
              <FormattedMessage id="Daily insurance value" />
            ) : (
              <FormattedMessage id="Monthly insurance value" />
            )
          }
          onChange={(e) => {
            if (Number(e.target.value) > 999999.99) {
              setInsuranceValidation({
                ...insuranceValidation,
                [insuraceType]: formatMessage({ id: "maxout.99" }),
              });
            } else if (e.target.value && Number(e.target.value) < 999999.99) {
              setInsuranceValidation({ ...insuranceValidation, [insuraceType]: null });
            } else {
              setInsuranceValidation({ ...insuranceValidation, [insuraceType]: true });
            }

            setInsuranceChange(true);

            const standard = insuranceValues.find((i) => i.insuranceId === "1");
            const full = insuranceValues.find((i) => i.insuranceId === "2");
            if (insuraceType === "standard") {
              standard.value = e.target.value ? +e.target.value : e.target.value;
              setErrors({ ...errors, insurance: null });
            } else if (insuraceType === "daily") {
              if (e.target.value) {
                full.value = +e.target.value;
                setErrors({ ...errors, insurance: null });
              } else {
                delete full.value;
              }
            } else {
              if (e.target.value) {
                full.monthlyValue = e.target.value ? +e.target.value : e.target.value;
              } else {
                delete full.monthlyValue;
              }
              setErrors({ ...errors, insurance: null });
            }
            setInsuranceValues([standard, full]);
          }}
        />
      )}
    </>
  );
  return (
    <div className="clients-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "sidebar.editcar" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.editcar" />}
        match={location}
        lastElement={id}
        enableBreadCrumb
      />
      {!getcarprofile && !loadbranches && !getmodels && !getcarversions && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          autoComplete="off"
        >
          <fieldset style={{ border: "1px solid ", padding: "10px" }}>
            <legend style={{ width: "40px" }}>
              <FormattedMessage id="branch" />
            </legend>
            <div className="row">
              <div
                className="col-md-2"
                style={{ alignItems: "center", marginTop: "-10px", textAlign: "center" }}
              >
                <span className="text-white " style={{ backgroundColor: "#3e3ec3" }}>
                  {
                    data?.allyCompanies.collection.find(
                      (option) => +option.id == +carprofiledata?.carProfile?.branch.allyCompanyId,
                    )?.[`${locale}Name`]
                  }{" "}
                </span>
              </div>

              <div className="col-md-10 align-items-center">
                <ul>
                  {branchesCount.map((branch, index) => (
                    <div>
                      <div key={branch?.id} className="d-inline">
                        <span className="mr-4 ml-4">
                          <FormattedMessage id="branch" /> {branch?.[`${locale}Name`]} :{" "}
                          <FormattedMessage id="car.count" />
                        </span>
                        <Counter
                          counter={branch.count}
                          setIncOne={(val) => handleCount(index, val)}
                          setDecOne={(val) => handleCount(index, val)}
                        />
                      </div>
                      <div className="d-inline">
                        <span className="mr-4 ml-4">
                          <FormattedMessage id="branch" /> {branch?.[`${locale}Name`]} :{" "}
                          <FormattedMessage id="car.count.ready.rent" />
                        </span>
                        <Counter
                          branchCount={branch.count}
                          counter={branch.availableCount}
                          setIncOne={(val) => handleCount(index, val, "availableCount ")}
                          setDecOne={(val) => handleCount(index, val, "availableCount ")}
                        />
                        {index ? (
                          <DeleteForeverIcon
                            className="mr-3 ml-3 pointer"
                            onClick={() =>
                              setSelectedBranches(
                                [...selectedBranches].filter((br) => +br?.id !== +branch?.id),
                              )
                            }
                          />
                        ) : null}
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </fieldset>

          <fieldset style={{ border: "1px solid ", padding: "10px" }}>
            <legend style={{ width: "70px" }}>
              <FormattedMessage id="car" />
            </legend>
            <div className="row mt-3">
              {/* <div className="col-md-3 align-items-center">
            <Autocomplete
                id="vhecile type"
                options={vtypes?.vehicleTypes || []}
                className="mt-2 mb-2"
                getOptionLabel={(option) => option?.[`${locale}Name`]}
                defaultValue={vtypes?.vehicleTypes.find(
                  (option) =>
                    option[`${locale}Name`] == carprofiledata?.carProfile?.vehicleTypeName,
                )}
                vehicleTypeName
                value={vhecileId}
                disableClearable
                onChange={(e, newvalue) => {
                  setVhecileID(newvalue.id);
                }}
                loading={vhecilesloading}
                renderInput={(params) => (
                  <TextField
                    error={errors?.vehicletype ? true : false}
                    {...params}
                    label={<FormattedMessage id="VechileType" />}
                    variant="outlined"
                    fullWidth
                    helperText={
                      errors?.vehicletype ? <FormattedMessage id="thisfieldisrequired" /> : null
                    }
                  />
                )}
              />
            </div> */}

              <div className="col-md-3">
                <Autocomplete
                  // value={carprofiledata?.carProfile?.make[`${locale}Name`]}
                  defaultValue={makes?.makes.collection.find(
                    (option) => option.id == carprofiledata?.carProfile?.makeId,
                  )}
                  id="=make name"
                  options={makes?.makes.collection || []}
                  className="mt-2 mb-2"
                  getOptionLabel={(option) => option?.[`${locale}Name`]}
                  onChange={(e, newValue) => {
                    seMakeID(newValue.id);
                    setModelID(null);
                    Allmodels({
                      id: +newValue.id,
                    });
                  }}
                  // loading={loadingMakes}
                  renderInput={(params) => (
                    <TextField
                      error={!!errors?.Make}
                      {...params}
                      label={<FormattedMessage id="Make" />}
                      variant="outlined"
                      fullWidth
                      helperText={
                        errors?.Make ? <FormattedMessage id="thisfieldisrequired" /> : null
                      }
                    />
                  )}
                />
              </div>
              {carprofiledata && +carprofiledata?.carProfile?.carModelId && (
                <div className="col-md-3">
                  <Autocomplete
                    id="=Model name"
                    options={models?.make.carModels || []}
                    className="mt-2 mb-2"
                    // defaultValue={models?.make.carModels.find((option) => +option.id == modelId)}
                    getOptionLabel={(option) => option?.[`${locale}Name`]}
                    value={models?.make.carModels.find((option) =>
                      modelId != undefined
                        ? +option.id == modelId
                        : option.id == carprofiledata?.carProfile?.carModelId,
                    )}
                    onChange={(e, newvalue) => {
                      setModelID(+newvalue.id);
                      fetchversions({
                        carModelId: +newvalue.id,
                        limit: higherUnlimited,
                      });
                    }}
                    loading={getCompanies}
                    renderInput={(params) => (
                      <TextField
                        error={!!errors?.Model}
                        {...params}
                        label={<FormattedMessage id="Model" />}
                        variant="outlined"
                        fullWidth
                        helperText={
                          errors?.Model ? <FormattedMessage id="thisfieldisrequired" /> : null
                        }
                      />
                    )}
                  />
                </div>
              )}
              <div className="col-md-3">
                <Autocomplete
                  id="=Model name"
                  options={carversions?.carVersions.collection || []}
                  className="mt-2 mb-2"
                  defaultValue={carversions?.carVersions.collection.find(
                    (option) =>
                      +option.id == +carprofiledata?.carProfile?.carVersionId ||
                      option.year == carprofiledata?.carProfile?.year,
                  )}
                  getOptionLabel={(option) => option?.[`${locale}Name`] + option.year}
                  value={companyname}
                  disableClearable
                  onChange={(e, newvalue) => {
                    setVersionID(parseInt(newvalue.id));
                  }}
                  loading={getcarversions}
                  renderInput={(params) => (
                    <TextField
                      error={!!errors?.versionID}
                      {...params}
                      label={<FormattedMessage id="version" />}
                      variant="outlined"
                      fullWidth
                      helperText={
                        errors?.versionID ? <FormattedMessage id="thisfieldisrequired" /> : null
                      }
                    />
                  )}
                />
              </div>
              <div className="col-md-3 mt-2">
                <TextField
                  value={refrenceCode}
                  variant="outlined"
                  label={<FormattedMessage id="referenceCode" />}
                  onChange={(e) => {
                    setRefrenceCode(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-3">
                {carfeatures && features && (
                  <Autocomplete
                    id="features"
                    multiple
                    options={carfeatures?.features.collection || []}
                    getOptionLabel={(option) =>
                      option?.[`name${locale.charAt(0).toUpperCase() + locale.charAt(1)}`]
                    }
                    value={
                      carfeatures?.features.collection.find((feature) =>
                        features.find((efeature) => efeature.id == feature.id),
                      )
                        ? features
                        : []
                    }
                    renderOption={(option, { selected, inputValue }) => (
                      <>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={!!features.find((feature) => feature.id == option.id)}
                        />
                        <img src={option?.icon} style={{ width: "30px" }} />
                        {option[`name${locale.charAt(0).toUpperCase() + locale.charAt(1)}`]}
                      </>
                    )}
                    onChange={(index, newvalue) => handleChange(index, newvalue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<FormattedMessage id="feature" />}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                )}
              </div>
              <div className="col-md-3">
                <Autocomplete
                  id="=Model name"
                  options={transmissions || []}
                  defaultValue={transmissions.find(
                    (trans) => trans.value == carprofiledata?.carProfile?.transmission,
                  )}
                  className="mt-2 mb-2"
                  getOptionLabel={(option) => formatMessage({ id: option.label })}
                  disableClearable
                  onChange={(e, trans) => setTransmissionvalue(trans.value)}
                  renderInput={(params) => (
                    <TextField
                      error={!!errors?.transmissionvalue}
                      {...params}
                      label={<FormattedMessage id="Transmission" />}
                      variant="outlined"
                      fullWidth
                      helperText={
                        errors?.transmissionvalue ? (
                          <FormattedMessage id="thisfieldisrequired" />
                        ) : null
                      }
                    />
                  )}
                />
              </div>
              <div className="col-md-3">
                <Autocomplete
                  defaultValue={carStatus(formatMessage).find((status) =>
                    status.value && carprofiledata?.carProfile.availabilityStatus == 1
                      ? true
                      : !!(!carprofiledata?.carProfile.availabilityStatus && status.value != 1),
                  )}
                  id="=Model name"
                  options={carStatus(formatMessage) || []}
                  className="mt-2 mb-2"
                  getOptionLabel={(option) => option.label}
                  disableClearable
                  onChange={(e, status) => {
                    console.log(e.target.value, status);
                    status.value == 1 ? SetAvailabilityStatus(true) : SetAvailabilityStatus(false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<FormattedMessage id="car.status" />}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>
          </fieldset>
          <fieldset style={{ border: "1px solid ", padding: "10px" }}>
            <legend style={{ width: "190px" }}>
              <FormattedMessage id="rental.price" />
              <span style={{ fontSize: "10px", color: "blue" }}>
                <FormattedMessage id="withoutTax" />
              </span>
            </legend>
            <div className="row mt-3 rent">
              <div className="col-md-3">
                <TextField
                  error={Boolean(errors?.rentperday)}
                  helperText={
                    errors?.rentperday ? <FormattedMessage id="thisfieldisrequired" /> : null
                  }
                  type="number"
                  InputProps={{ inputProps: { minLength: 1, maxLength: 5 } }}
                  variant="outlined"
                  defaultValue={carprofiledata?.carProfile?.dailyPrice}
                  label={<FormattedMessage id="RentperDay" />}
                  onChange={(e) => {
                    setRentPerDay(+e.target.value);
                    setrentperweek(e.target.value * 7);
                    setRentPerMonth(e.target.value * 30);
                  }}
                />
              </div>
              <div className="col-md-3">
                <TextField
                  error={Boolean(errors?.weeklyprice)}
                  helperText={
                    errors?.weeklyprice ? <FormattedMessage id="thisfieldisrequired" /> : null
                  }
                  type="number"
                  defaultValue={carprofiledata?.carProfile?.weeklyPrice}
                  InputProps={{ inputProps: { minLength: 1, maxLength: 5 } }}
                  variant="outlined"
                  label={<FormattedMessage id="weeklyprice" />}
                  onChange={(e) => {
                    setWeeklyprice(+e.target.value);
                  }}
                />
              </div>
              <div className="col-md-3">
                <TextField
                  type="number"
                  InputProps={{ inputProps: { minLength: 1, maxLength: 5 } }}
                  defaultValue={carprofiledata?.carProfile?.monthlyPrice}
                  variant="outlined"
                  label={<FormattedMessage id="monthlyprice" />}
                  onChange={(e) => {
                    setMonthlyprice(+e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row rent">
              {rentalMonths.map((month) => (
                <div className="col-md-3 mt-2">
                  <TextField
                    type="number"
                    InputProps={{ inputProps: { maxLength: 5 } }}
                    variant="outlined"
                    defaultValue={
                      month.value == 2
                        ? carprofiledata?.carProfile?.monthsPrice?.twoMonths
                        : month.value == 3
                        ? carprofiledata?.carProfile?.monthsPrice?.threeMonths
                        : month.value == 4
                        ? carprofiledata?.carProfile?.monthsPrice?.fourMonths
                        : month.value == 5
                        ? carprofiledata?.carProfile?.monthsPrice?.fiveMonths
                        : month.value == 6
                        ? carprofiledata?.carProfile?.monthsPrice?.sixMonths
                        : month.value == 7
                        ? carprofiledata?.carProfile?.monthsPrice?.sevenMonths
                        : month.value == 8
                        ? carprofiledata?.carProfile?.monthsPrice?.eightMonths
                        : month.value == 9
                        ? carprofiledata?.carProfile?.monthsPrice?.nineMonths
                        : month.value == 10
                        ? carprofiledata?.carProfile?.monthsPrice?.tenMonths
                        : month.value == 11
                        ? carprofiledata?.carProfile?.monthsPrice?.elevenMonths
                        : month.value == 12
                        ? carprofiledata?.carProfile?.monthsPrice?.twelveMonths
                        : carprofiledata?.carProfile?.monthsPrice?.twentyFourMonths
                    }
                    label={<FormattedMessage id={month.label} />}
                    onChange={(e) => handelMonthsprice(e.target.value, month.value)}
                  />
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset style={{ border: "1px solid ", padding: "10px" }}>
            <legend style={{ width: "100px" }}>
              <FormattedMessage id="kilometers" />
            </legend>

            <div className="row mt-3 kilo">
              <div className="col-md-2">
                <FormControlLabel
                  control={<Checkbox name="checkedB" color="primary" />}
                  label={formatMessage({ id: "isUnlimited" })}
                  checked={isUnlimited}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setIsUnlimitedFree(false);
                    }
                    setIsUnlimited(e.target.checked);
                  }}
                />
              </div>
              <div className="col-md-2">
                {isUnlimited && (
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    checked={isUnlimitedFree}
                    label={formatMessage({ id: "isUnlimitedFree" })}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setUnlimitedFeePerDay("0");
                      }
                      setIsUnlimitedFree(e.target.checked);
                    }}
                  />
                )}
              </div>
              {isUnlimited && !isUnlimitedFree && (
                <div className="col-md-3 kiloper" style={{ padding: 0 }}>
                  <TextField
                    fullWidth
                    name="unlimitedFeePerDay"
                    label={<FormattedMessage id="unlimitedFeePerDay" />}
                    // value={carprofiledata?.carProfile.unlimitedFeePerDay}
                    variant="outlined"
                    defaultValue={carprofiledata?.carProfile.unlimitedFeePerDay}
                    onChange={(e) => {
                      const fee = e.target.value;
                      if (/^[0-9]+(\.)?[0-9]*$/.test(fee.toString()) || fee === "") {
                        setUnlimitedFeePerDay(fee);
                      } else {
                        setUnlimitedFeePerDay(unlimitedFeePerDay);
                      }
                    }}
                  />
                </div>
              )}
              {!isUnlimitedFree && (
                <div className="col-md-3">
                  <TextField
                    type="number"
                    error={Boolean(errors?.additionaldistancecost)}
                    helperText={
                      errors?.additionaldistancecost ? (
                        <FormattedMessage id="thisfieldisrequired" />
                      ) : null
                    }
                    defaultValue={carprofiledata?.carProfile.additionalDistanceCost}
                    InputProps={{ inputProps: { maxLength: 5 } }}
                    variant="outlined"
                    onChange={(e) => setAdditionalDistanceCost(parseFloat(e.target.value))}
                    label={<FormattedMessage id="AdditionalDistanceCost" />}
                  />
                </div>
              )}
            </div>

            <div className="row mt-3 kiloperday">
              {!isUnlimitedFree && (
                <>
                  <div className="col-md-3">
                    <TextField
                      error={Boolean(errors?.distanceperday)}
                      helperText={
                        errors?.distanceperday ? (
                          <FormattedMessage id="thisfieldisrequired" />
                        ) : null
                      }
                      type="number"
                      InputProps={{ inputProps: { maxLength: 6, id: "distanceperday" } }}
                      label={<FormattedMessage id="Distanceperday" />}
                      variant="outlined"
                      defaultValue={carprofiledata?.carProfile.distanceByDay}
                      onChange={(e) => {
                        setDistanceperDay(+e.target.value);
                        setDistanceperMonth(+e.target.value * 30);
                        setDistanceperWeek(+e.target.value * 7);
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <TextField
                      type="number"
                      InputProps={{ inputProps: { minLength: 1, maxLength: 2 } }}
                      variant="outlined"
                      label={<FormattedMessage id="Disnatceperweek" />}
                      value={distanceperweek || carprofiledata?.carProfile.distanceByDay * 7}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                    />
                  </div>
                  <div className="col-md-3">
                    <TextField
                      type="number"
                      InputProps={{ inputProps: { minLength: 1, maxLength: 2 } }}
                      variant="outlined"
                      label={<FormattedMessage id="DistanceperMonth" />}
                      value={distancepermonth || carprofiledata?.carProfile.distanceByDay * 30}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                    />
                  </div>
                </>
              )}
            </div>
          </fieldset>
          <fieldset style={{ border: "1px solid ", padding: "10px" }}>
            <legend style={{ width: "70px" }}>
              <FormattedMessage id="insurance" />
            </legend>

            {carprofiledata && (
              <div className="row mt-3 mb-3">
                {[
                  { id: "1", name: "standard", localizedName: formatMessage({ id: "Standard" }) },
                  {
                    id: "2",
                    name: "daily",
                    localizedName: formatMessage({ id: "Daily insurance value" }),
                  },
                  { id: "2", name: "monthly", localizedName: "Monthly insurance value" },
                ].map((item) => (
                  <div className="col-md-4">
                    <div className="row">
                      <div className={`${item.name === "monthly" ? "d-none" : false} col-md-4`}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked={
                                !!carprofiledata?.carProfile.carInsurances.find(
                                  (insurance) => +insurance.insuranceId == +item.id,
                                )?.value
                              }
                              name="checkedB"
                              color="primary"
                              onChange={(e) => {
                                if (item.id === "1") {
                                  setStandardChecked(e.target.checked);
                                  setInsuranceValidation({
                                    ...insuranceValidation,
                                    standard: e.target.checked,
                                  });
                                } else {
                                  setFullChecked(e.target.checked);
                                  setInsuranceValidation({
                                    ...insuranceValidation,
                                    daily: e.target.checked,
                                    monthly: e.target.checked,
                                  });
                                }
                              }}
                            />
                          }
                          label={
                            item.id == 1
                              ? formatMessage({ id: "Standard" })
                              : formatMessage({ id: "Full" })
                          }
                        />
                      </div>
                      <div className="col-md-7" style={{ padding: 0 }}>
                        {TextFieldGenerator(item.id, item.name)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
          <div className="row justify-content-end mt-3">
            <div className="col-md-6">
              <div className="row justify-content-center">
                <div className="col-md-3 mt-2">
                  <button
                    type="button"
                    onClick={() => handelSaveCar()}
                    className="btn btn-primary text-center text-white"
                  >
                    <FormattedMessage id="save" />
                  </button>{" "}
                </div>
                <div className="col-md-3 mt-2">
                  <button
                    onClick={() => history.push(history.location.state.detail)}
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

  function handleCount(index, val, avcount = undefined) {
    const newBranchesCount = [...branchesCount];
    if (avcount) {
      newBranchesCount[index].availableCount = val;
    } else {
      newBranchesCount[index].count = val;
    }
    setBranchesCount(newBranchesCount);
    setBranchesChange(true);
  }
}
