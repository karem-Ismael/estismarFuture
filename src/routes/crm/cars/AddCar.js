/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undefined */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
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
import { AllyCompany } from "gql/queries/GetCompanyInList.gql";
import { Branches } from "gql/queries/AllBranches.gql";
import { makeStyles } from "@material-ui/core/styles";
import store from "../../../store";
import "./style.css";

const { ally_id } = store.getState()?.authUser.user;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
export default function AddCar() {
  const [errors, setErrors] = useState();
  const { locale, formatMessage } = useIntl();
  const [allbranches, setAllBranches] = useState([]);
  const history = useHistory();
  const { higherUnlimited, defaultPage } = persist;
  const [refrenceCode, setRefrenceCode] = useState();
  const [distancepermonth, setDistanceperMonth] = useState();
  const [distanceperday, setDistanceperDay] = useState();
  const [distanceperweek, setDistanceperWeek] = useState();
  const [, setrentperweek] = useState();
  const [rentperday, setRentPerDay] = useState();
  const [, setRentPerMonth] = useState();
  const [id, setID] = useState();
  const [makeid, seMakeID] = useState();
  const [deliverytocustomer, setDelevieryTocustomer] = useState();
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [branchesCount, setBranchesCount] = useState([]);
  const [modelId, setModelID] = useState();
  const [insuranceValues, setInsuranceValues] = useState([
    { insuranceId: "1", value: undefined },
    { insuranceId: "2", value: undefined, monthlyValue: undefined },
  ]);
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
  const [standardChecked, setStandardChecked] = useState();
  const [fullChecked, setFullChecked] = useState();
  const [insuranceValidation, setInsuranceValidation] = useState({
    standard: null,
    daily: null,
    monthly: null,
  });

  const classes = useStyles();
  const { data, loading: getCompanies } = useQuery(CompaniesName, {
    skip: ally_id,
    variables: { limit: 500, page: defaultPage },
  });
  const { data: CompanyName, loading: getCompanyName } = useQuery(AllyCompany, {
    skip: !ally_id,
    variables: { id: ally_id },
  });
  const { data: carfeatures } = useQuery(Features, {
    variables: { isParent: true, isActive: true, category: "car" },
  });
  const [companyName, setCompanyNameList] = useState([]);
  const { data: makes, loadingMakes } = useQuery(Makes, {
    variables: { limit: higherUnlimited, page: defaultPage },
  });
  const { data: vtypes, loading: vhecilesloading } = useQuery(VehicleTypes);
  const { data: insuraceType } = useQuery(Insurances);
  const [Allmodels, { data: models }] = useLazyQuery(ModelsOfMake, { variables: { id: makeid } });

  const [allyCompany, { data: branches, loading: loadingbranches }] = useLazyQuery(Branches, {
    variables: { allyCompanyIds: id, limit: higherUnlimited },
  });
  const { data: carversions, refetch: fetchversions, loading: getcarversions } = useQuery(
    CarVersions,
    {
      variables: {
        carModelId: modelId,
        limit: higherUnlimited,
        sortBy: "asc",
        page: defaultPage,
      },
    },
  );
  useEffect(() => {
    if (CompanyName) {
      setCompanyNameList([CompanyName.allyCompany]);
    }
  }, [CompanyName]);

  useEffect(() => {
    if (CompanyName) {
      setCompanyNameList([CompanyName.allyCompany]);
    }
  }, [CompanyName]);

  const [createCar] = useMutation(CreateCar);

  const handleChange = (event) => {
    const data = [];
    for (let i = 0; i < event?.length; i += 1) {
      data.push(+event?.[i]?.id);
    }
    setFeaturesData(data);
    setFeatures(event);
  };
  useEffect(() => {
    if (branches?.branches?.collection.length) {
      setAllBranches([
        {
          enName: "All",
          arName: "الكل",
          value: "all",
        },
        ...branches?.branches?.collection,
      ]);
    }
  }, [branches?.branches?.collection]);

  const handelSaveCar = () => {
    const geterrors = {};
    if (companyname?.length === 0 || !companyname) {
      geterrors.companyname = "thisfieldisrequired";
    }
    if (!selectedBranches.length) {
      geterrors.brnachname = "thisfieldisrequired";
    }
    if (!makeid) {
      geterrors.Make = "thisfieldisrequired";
    }
    if (!modelId) {
      geterrors.Model = "thisfieldisrequired";
    }
    if (!transmissionvalue) {
      geterrors.transmissionvalue = "thisfieldisrequired";
    }
    if (!rentperday) {
      geterrors.rentperday = "thisfieldisrequired";
    }
    if (!versionID) {
      geterrors.versionID = "thisfieldisrequired";
    }
    if (!insuranceValues[0].value && !insuranceValues[1]?.value) {
      geterrors.insurance = "thisfieldisrequired";
    }
    if (!weeklyprice || Number.isNaN(weeklyprice) || !weeklyprice) {
      geterrors.weeklyprice = "thisfieldisrequired";
    }
    if (!monthlyprice) {
      geterrors.monthlyprice = "thisfieldisrequired";
    }
    if (
      fullChecked &&
      insuranceValidation.daily &&
      insuranceValidation.monthly &&
      !errors?.insurance
    ) {
      NotificationManager.error(formatMessage({ id: "Please enter a daily or monthly value!" }));
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
      createCar({
        variables: {
          additionalDistanceCost: additionaldistancecost || 0,
          branches: branchesCount.map((branch) => ({
            branchId: branch.id,
            count: branch.count,
            availableCount: branch.availableCount,
          })),
          carFeatureAttributes: featuresData,
          carInsuranceAttributes:
            standardChecked && fullChecked
              ? insuranceValues
              : !standardChecked
              ? fullInsurancePayload
              : !fullChecked
              ? standardInsurancePayload
              : insuranceValues,
          carModelId: modelId,
          carVersionId: versionID,
          dailyPrice: rentperday,
          deliverToCustomerLocationCost: deliverytocustomer,
          accidentPenalty: 0.0,
          distanceByDay: !isUnlimited && !isUnlimitedFree ? distanceperday : undefined,
          makeId: makeid,
          monthlyPrice: monthlyprice,
          transmission: transmissionvalue,
          weeklyPrice: weeklyprice,
          isUnlimited,
          isUnlimitedFree,
          unlimitedFeePerDay: Number(unlimitedFeePerDay),
          monthsPrice: !Object.keys(monthsprice).length ? undefined : monthsprice,
          availabilityStatus,
          referenceCode: refrenceCode,
        },
      })
        .then(() => {
          NotificationManager.success(<FormattedMessage id="caraddedsuccessfully" />);
          history.push("/cw/dashboard/cars");
        })
        .catch((err) => NotificationManager.error(err.message));
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
          : { id: br?.id, count: 1, arName: br.arName, enName: br.enName, availableCount: 1 };
      });
      setBranchesCount(newBranchesCount);
    } else {
      setBranchesCount([]);
    }
  }, [selectedBranches]);
  const handelMonthsprice = (value, month) => {
    const cmonths = { ...monthsprice };

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
        <title>{formatMessage({ id: "sidebar.addcar" })}</title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="sidebar.addcar" />}
        match={location}
        enableBreadCrumb
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        autoComplete="off"
      >
        <fieldset className="w-100" style={{ border: "1px solid ", padding: "10px" }}>
          <legend style={{ width: "60px" }}>
            <FormattedMessage id="branch" />
          </legend>
          <div className="row">
            <div className="col-md-3">
              <Autocomplete
                id="company name"
                options={data?.allyCompanies.collection || companyName || []}
                className="mt-2 mb-2"
                getOptionLabel={(option) => option?.[`${locale}Name`]}
                value={companyname}
                disableClearable
                onChange={(_, newValue) => {
                  setCompanyName(newValue);
                  setID(newValue.id);
                  setSelectedBranches([]);
                  allyCompany();
                }}
                loading={getCompanies}
                renderInput={(params) => (
                  <>
                    <TextField
                      error={Boolean(errors?.companyname)}
                      {...params}
                      label={<FormattedMessage id="companyName" />}
                      variant="outlined"
                      fullWidth
                      helperText={
                        errors?.companyname ? <FormattedMessage id="thisfieldisrequired" /> : null
                      }
                    />
                  </>
                )}
              />
            </div>
            <div className="col-md-9 align-items-center">
              <Autocomplete
                id="branches-autocomplete"
                multiple
                options={allbranches || []}
                className="mt-2 mb-2"
                getOptionLabel={(option) => option?.[`${locale}Name`]}
                value={selectedBranches}
                disableClearable
                onChange={(_, newValue) => {
                  if (
                    newValue[0]?.value == "all" ||
                    newValue[newValue.length - 1]?.value == "all"
                  ) {
                    setSelectedBranches([...branches?.branches?.collection]);
                    return;
                  }
                  if (!newValue.length) {
                    setSelectedBranches([]);
                  }
                  setSelectedBranches([...newValue]);
                }}
                loading={loadingbranches}
                noOptionsText={<FormattedMessage id="No.branches.found" />}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(errors?.brnachname)}
                    {...params}
                    label={<FormattedMessage id="branchName" />}
                    variant="outlined"
                    fullWidth
                    helperText={
                      errors?.brnachname ? <FormattedMessage id="thisfieldisrequired" /> : null
                    }
                  />
                )}
              />
            </div>
          </div>

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
        </fieldset>

        <fieldset style={{ border: "1px solid ", padding: "10px" }}>
          <legend style={{ width: "60px" }}>
            <FormattedMessage id="car" />
          </legend>

          <div className="row mt-3">
            <div className="col-md-3">
              <Autocomplete
                id="=make name"
                options={makes?.makes.collection || []}
                className="mt-2 mb-2"
                getOptionLabel={(option) => option?.[`${locale}Name`]}
                value={companyname}
                disableClearable
                onChange={(e, newValue) => {
                  seMakeID(newValue.id);
                  Allmodels();
                }}
                loading={loadingMakes}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(errors?.Make)}
                    {...params}
                    label={<FormattedMessage id="Make" />}
                    variant="outlined"
                    fullWidth
                    helperText={errors?.Make ? <FormattedMessage id="thisfieldisrequired" /> : null}
                  />
                )}
              />
            </div>
            <div className="col-md-3">
              <Autocomplete
                id="=Model name"
                options={models?.make.carModels || []}
                className="mt-2 mb-2"
                getOptionLabel={(option) => option?.[`${locale}Name`]}
                value={companyname}
                disableClearable
                onChange={(_, newvalue) => {
                  setModelID(+newvalue.id);
                  fetchversions({
                    variables: {
                      modelId: +newvalue.id,
                      limit: higherUnlimited,
                      sortBy: "asc",
                    },
                  });
                }}
                noOptionsText={<FormattedMessage id="No.model.found" />}
                loading={getCompanies}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(errors?.Model)}
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
            <div className="col-md-3">
              <Autocomplete
                id="=Model name"
                options={carversions?.carVersions.collection || []}
                className="mt-2 mb-2"
                getOptionLabel={(option) => option?.[`${locale}Name`] + option.year}
                value={companyname}
                disableClearable
                onChange={(_, newvalue) => {
                  setVersionID(+newvalue.id);
                }}
                loading={getcarversions}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(errors?.versionID)}
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
              <Autocomplete
                id="features"
                multiple
                options={carfeatures?.features.collection || []}
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
                // value={features}
                onChange={(_, newvalue) => handleChange(newvalue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={<FormattedMessage id="feature" />}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="col-md-3">
              <Autocomplete
                id="=Model name"
                options={transmissions || []}
                className="mt-2 mb-2"
                getOptionLabel={(option) => formatMessage({ id: option.label })}
                disableClearable
                onChange={(e, trans) => setTransmissionvalue(trans.value)}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(errors?.transmissionvalue)}
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
                id="=Model name"
                options={carStatus(formatMessage) || []}
                className="mt-2 mb-2"
                getOptionLabel={(option) => option.label}
                disableClearable
                onChange={(e, status) => {
                  +status.value == 1 ? SetAvailabilityStatus(true) : SetAvailabilityStatus(false);
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
            {}
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
                error={Boolean(errors?.monthlyprice)}
                helperText={
                  errors?.monthlyprice ? <FormattedMessage id="thisfieldisrequired" /> : null
                }
                type="number"
                InputProps={{ inputProps: { minLength: 1, maxLength: 5 } }}
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
                  label={<FormattedMessage id={month.label} />}
                  onChange={(e) => handelMonthsprice(e.target.value, month.value)}
                />
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset style={{ border: "1px solid ", padding: "10px" }}>
          <legend style={{ width: locale == "ar" ? "95px" : "100px" }}>
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
            <div className="col-md-2 ">
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
                  value={unlimitedFeePerDay}
                  variant="outlined"
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
                  inputProps={{
                    step: "0.1",
                  }}
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
                      errors?.distanceperday ? <FormattedMessage id="thisfieldisrequired" /> : null
                    }
                    type="number"
                    InputProps={{ inputProps: { maxLength: 6, id: "distanceperday" } }}
                    label={<FormattedMessage id="Distanceperday" />}
                    variant="outlined"
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
                    value={distanceperweek}
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
                    value={distancepermonth}
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
          <legend style={{ width: "120px" }}>
            <FormattedMessage id="insurance" />
          </legend>

          <div className="row mt-3 mb-3 grid-insurance-cars">
            {[
              { id: "1", name: "standard", localizedName: formatMessage({ id: "Standard" }) },
              {
                id: "2",
                name: "daily",
                localizedName: formatMessage({ id: "Daily insurance value" }),
              },
              { id: "2", name: "monthly", localizedName: "Monthly insurance value" },
            ].map((item, index) => (
              <div className="col-md-12 col-lg-4" key={JSON.stringify(index)}>
                <div className="row" style={{ gap: "10px" }}>
                  <div className={`${item.name === "monthly" ? "d-none" : false} col-md-4`}>
                    <FormControlLabel
                      control={
                        <Checkbox
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
        </fieldset>

        <div className="row justify-content-end mt-3">
          <div className="col-md-6">
            <div className="row justify-content-end">
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
  }
}
