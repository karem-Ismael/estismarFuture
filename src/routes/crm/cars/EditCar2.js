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
  const [insurance, setInsurance] = useState([]);
  const [insuranceid, setInsuranceID] = useState();
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
    if (!insurance[0].value?.toString().length && !insurance[1]?.value.toString().length) {
      geterrors.insurance = "thisfieldisrequired";
    }
    if (!Object.keys(geterrors).length) {
      updateCar({
        variables: {
          additionalDistanceCost: additionaldistancecost || 0,
          carsCount: +branchesCount[0].count,
          availableCarsCount: branchesCount[0].availableCount,
          carFeatureAttributes: featuresData,
          carInsuranceAttributes: insuranceChange
            ? !insurance[0]?.value.toString().length
              ? insurance[1]
              : !insurance[1]?.value.toString().length
              ? insurance[0]
              : insurance
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
        setInsurance(insurance);
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
                  onInput={(e) => {
                    e.target.value = e.target.value.toString().slice(0, 10);
                  }}
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

            {carprofiledata && insuraceType?.insurances && (
              <div className="row mt-3 mb-3">
                {insuraceType?.insurances.map((insurancetype) => (
                  <div className="col-md-4">
                    <div className="row">
                      <div className="col-md-4">
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked={
                                !!carprofiledata?.carProfile.carInsurances.find(
                                  (insurance) => +insurance.insuranceId == +insurancetype.id,
                                )?.value
                              }
                              name="checkedB"
                              color="primary"
                            />
                          }
                          label={insurancetype[`${locale}Name`]}
                          onChange={() => {
                            setInsuranceID(insurancetype.id);
                          }}
                        />
                      </div>
                      <div className="col-md-7" style={{ padding: 0 }}>
                        <TextField
                          defaultValue={
                            carprofiledata?.carProfile.carInsurances.find(
                              (insurance) => +insurance.insuranceId == +insurancetype.id,
                            )?.value
                          }
                          error={!!errors?.insurance}
                          helperText={
                            errors?.insurance ? <FormattedMessage id="thisfieldisrequired" /> : null
                          }
                          type="number"
                          InputProps={{ inputProps: { maxlength: 5 } }}
                          variant="outlined"
                          label={<FormattedMessage id="insurancevalue" />}
                          onChange={(e) => {
                            setInsuranceChange(true);
                            const insuranceexist = insurance.filter(
                              (insurance) =>
                                +insurance.insuranceId == +insuranceid ||
                                +insurance.insuranceId == +insurancetype.id,
                            );
                            if (insuranceexist.length) {
                              const notupdatedinsurance = insurance.filter(
                                (insurance) => +insurance.insuranceId !== +insuranceid,
                              );
                              insuranceexist[0].value = e.target.value.length
                                ? +e.target.value
                                : e.target.value;
                              setInsurance([...insuranceexist[0], ...notupdatedinsurance]);
                              setInsuranceChange(true);
                            } else {
                              setInsurance([
                                ...insurance,
                                {
                                  insuranceId: +insuranceid ? +insuranceid : +insurancetype.id,
                                  value: e.target.value.length ? +e.target.value : e.target.value,
                                },
                              ]);
                              setInsuranceChange(true);
                              return;
                            }
                            const insurancefound = carprofiledata?.carProfile.carInsurances.find(
                              (insurance) =>
                                insurance.insuranceName?.toLowerCase() ==
                                insurancetype[`${locale}Name`]?.toLowerCase(),
                            );
                            const insurancefound2 = insurance.find(
                              (insurance) => insurance.insuranceId == insurancefound?.insuranceId,
                            );

                            if (insurancefound2) {
                              const updatedinsurance = [...insurance].filter(
                                (insurance) =>
                                  +insurance.insuranceId !== +insurancefound2.insuranceId,
                              );
                              insurancefound2.value = e.target.value.length
                                ? +e.target.value
                                : e.target.value;
                              setInsurance([...updatedinsurance, insurancefound2]);
                              setInsuranceChange(true);
                            } else {
                              setInsurance([
                                ...insurance,
                                {
                                  insuranceId: +insuranceid ? +insuranceid : +insurancetype.id,
                                  value: e.target.value.length ? +e.target.value : e.target.value,
                                },
                              ]);
                              setInsuranceChange(true);
                            }
                          }}
                        />
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
