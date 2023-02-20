/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable import/order */
import React, { useState, useEffect, useRef, memo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { NotificationManager } from "react-notifications";
import { useSnackbar } from "notistack";

import { CreateNewBranch, EditBranch } from "gql/mutations/Branches.mutations.gql";
import { GetBranchDetails } from "gql/queries/Branches.queries.gql";
import UPLOAD_IMAGE from "gql/mutations/UploadImage.gql";
import { AllAreas } from "gql/queries/Areas.queries.gql";
import { Regions } from "gql/queries/GetRegions.gql";
import { Airports } from "gql/queries/GetAirports.gql";
import {
  Tooltip,
  Checkbox,
  FormControlLabel,
  TextField,
  Switch,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@material-ui/core";

import { GetAllyDropDown } from "gql/queries/Ally.queries.gql";
import { Autocomplete } from "@material-ui/lab";
import { AddEditBranch } from "validations/Bnrach.validations";
import CustomTextField from "components/Input/CustomTextField";
import { ErrorMessage } from "components/shared/ErrorMessage";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { CircularProgressWithLabel } from "components/CircularProgressWithLabel";
import Map from "components/Map/MapWithSearch";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import Select from "react-select";
import {
  DeliveryPaymentMethods,
  paytype,
  workingDays,
  workingDaysIndeeces,
} from "constants/constants";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
// import Checkbox from '@material-ui/core/Checkbox';
import AllyExtraService from "gql/queries/AllyExtraService.gql";

import AsyncLoader from "components/AutoComplete/AsyncLoader";

import {
  DeleteForever as DeleteForeverIcon,
  Add as AddIcon,
  ClearAll as ClearIcon,
} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

import IntlTelInput from "react-intl-tel-input/dist/components/IntlTelInput";
import { AllyCompany } from "gql/queries/GetCompanyInList.gql";
import { addEditBranchInitValues } from "./BranchesAddEdit.model";
import moment from "moment";
function CreateEditBranch() {
  // Hooks
  const { enqueueSnackbar } = useSnackbar();
  const { ally_id } = JSON.parse(localStorage.getItem("user_data"));
  const { branchId } = useParams();
  const history = useHistory();
  const mobileReactRef = useRef();

  // State
  const [deliveryGraceTime, setDeliveryGraceTime] = useState("00:00");
  const [centerlat, setCenterlat] = useState();
  const [centerlng, setCenterlng] = useState();
  const { formatMessage, locale } = useIntl();
  const [delivery, SetDelivery] = useState([{ from: 0 }]);
  const [deliveryPaymentMethod, setDeliveryPaymentMethod] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [workingHours, setworkingHours] = useState(
    workingDaysIndeeces.map((d) => [
      {
        isOn: true,
        weekDay: d,
        startTime: "12:00",
        endTime: "13:00",
        is24hAvailable: false,
      },
    ]),
  );

  const [bankCardImage, setBankCardImage] = useState("");
  const [allyExtraservices, setAllyExtraServices] = useState([]);
  const [progress, setProgress] = useState(0);
  const [officeNumberDisplay, setOfficeNumberDisplay] = useState("");
  const [mobileNumberDisplay, setMobileNumberDisplay] = useState("");
  const [description, setDescription] = useState();
  const [phoneValidity, setPhoneValidity] = useState(false);
  const [phoneValidity2, setPhoneValidity2] = useState(false);
  const [ServicesWithTitles, setExtraServicesWithTitles] = useState([]);
  const [mapchange, setMapChange] = useState(false);

  // Form Submit
  const formik = useFormik({
    initialValues: addEditBranchInitValues,
    validationSchema: AddEditBranch,
    onSubmit: async (values) => {
      const variables = {
        ...values,
        deliveryPaymentMethod,
        areaId: values?.areaId?.id,
        airportId: values?.deliverToAirport ? values?.airportId : null, // Sends null airportId if deliverToAirport is unchecked
      };
      if (!branchId) {
        if (delivery.length && Object.keys(delivery[0]).length) {
          let from = false;
          let to = false;
          delivery.map((oneDeliver) => {
            if ((oneDeliver.from == null || oneDeliver.from == undefined) && values.canDelivery) {
              from = true;
            }
            if ((oneDeliver.to == null || oneDeliver.to == undefined) && values.canDelivery) {
              to = true;
            }
          });
          if (to) {
            NotificationManager.error(<FormattedMessage id="To.kilometer.need" />);
            return;
          }
          if (from) {
            NotificationManager.error(<FormattedMessage id="from.kilometer.need" />);
            return;
          }
        }
        const servicesForCreate = allyExtraservices.map((service) => ({
          allyExtraServiceId: service.allyExtraServiceId,
          isActive: service.isActive,
          isRequired: service.isRequired,
          payType: service.payType,
          serviceValue: service.serviceValue,
        }));
        const branchDelivery = delivery?.map((dd) => ({
          from: dd.from,
          to: dd.to,
          deliveryPrice: dd.deliveryPrice ? parseFloat(dd.deliveryPrice) : 0,
          handoverPrice: dd.handoverPrice ? parseFloat(dd.handoverPrice) : undefined,
        }));
        await CreateBranchMutation({
          variables: {
            ...variables,
            deliveryGraceTime: deliveryGraceTime || undefined,
            allyCompanyId: values.allyCompanyId.id || +ally_id,
            fixedDeliveryFees: Number(values.fixedDeliveryFees),
            description,
            branchDeliveryPriceAttributes:
              Object.keys(delivery[0]).length && values.canDelivery ? branchDelivery : [],
            canHandover: values.handover,
            branchExtraServicesAttributes: servicesForCreate,
          },
        })
          .then(() => {
            setProgress(100);
            NotificationManager.success(formatMessage({ id: "success.create.branch" }));
            history.push("/cw/dashboard/branches");
          })
          .catch((err) => {
            NotificationManager.error(err?.message);
            for (const iterator of JSON.parse(err?.message)) {
              NotificationManager.error(iterator?.message);
            }
          });
      } else {
        if (delivery.length && Object.keys(delivery[0]).length) {
          let from = false;
          let to = false;
          delivery.map((oneDeliver) => {
            if ((oneDeliver.from == undefined || oneDeliver.from == null) && values.canDelivery) {
              from = true;
              0;
            }
            if ((oneDeliver.to == undefined || oneDeliver.to == null) && values.canDelivery) {
              to = true;
            }
          });
          if (to) {
            NotificationManager.error(<FormattedMessage id="To.kilometer.need" />);
            return;
          }
          if (from) {
            NotificationManager.error(<FormattedMessage id="from.kilometer.need" />);
            return;
          }
        }
        const services = allyExtraservices.map((service) => ({
          allyExtraServiceId: service.allyExtraServiceId,
          isActive: service.isActive,
          isRequired: service.isRequired,
          payType: service.payType,
          serviceValue: service.serviceValue,
        }));
        const branchDelivery = delivery?.map((dd) => ({
          from: dd.from,
          to: dd.to,

          deliveryPrice: dd.deliveryPrice ? parseFloat(dd.deliveryPrice) : 0,
          handoverPrice: dd.handoverPrice ? parseFloat(dd.handoverPrice) : undefined,
        }));

        await EditBranchMutation({
          variables: {
            ...variables,
            branchId,
            deliveryGraceTime: deliveryGraceTime || undefined,
            allyCompanyId: values.allyCompanyId.id || +ally_id,
            fixedDeliveryFees: Number(values.fixedDeliveryFees),
            description,
            branchDeliveryPriceAttributes:
              Object.keys(delivery[0]).length && values.canDelivery ? branchDelivery : [],
            canHandover: values.handover,
            branchExtraServicesAttributes: services,
          },
        })
          .then(() => {
            NotificationManager.success(formatMessage({ id: "success.edit.branch" }));
            refetch();
            setTimeout(() => {
              history.push("/cw/dashboard/branches");
            }, 3000),
              setProgress(100);
          })
          .catch((err) => NotificationManager.error(err?.message));
      }
    },
  });
  const { values, setFieldValue, submitCount, handleChange: handleFormikChange, errors } = formik;

  // GQL
  const [CreateBranchMutation, { loading: creatingBranch, error: CreateError }] = useMutation(
    CreateNewBranch,
  );
  const [EditBranchMutation, { loading: EditingBranch, error: EditError }] = useMutation(
    EditBranch,
  );
  const [uploadImageMutation, { loading: uploading, UploadError }] = useMutation(UPLOAD_IMAGE);
  const { data: AreasRes, loading: gettingAreas } = useQuery(AllAreas);
  const { data: RegionsRes, loading: gettingRegions } = useQuery(Regions);

  const { data: AllyDropDownRes, loading: gettingAllies } = useQuery(GetAllyDropDown);

  const { data: CompanyName, loading: getCompanyName } = useQuery(AllyCompany, {
    skip: !ally_id,
    variables: { id: ally_id },
  });

  const { data: branchDetailsRes, refetch } = useQuery(GetBranchDetails, {
    skip: !branchId,
    variables: { id: +branchId },
  });
  const [getServices, { data: allyExtraServices }] = useLazyQuery(AllyExtraService);

  const { data: AirportsRes, loading: gettingAirports } = useQuery(Airports, {
    variables: { areaId: +values?.areaId?.id },
  });

  // Functions
  function handleChange(e) {
    e.target.value = e.target.value.trimStart();
    handleFormikChange(e);
  }

  function clearInputs(delivery, index) {
    const filtered = delivery.filter((br, deindex) => deindex !== index);
    filtered.push({
      from: index == 0 ? 0 : undefined,
      to: null,
      deliveryPrice: null,
      handoverPrice: null,
    });
    SetDelivery(filtered);
  }

  function handleTime(value, type) {
    const numericValue = Number(value);
    const hrs = deliveryGraceTime.split(":")[0];
    const mins = deliveryGraceTime.split(":")[1];
    if (type === "hrs") {
      if (numericValue < 10) {
        setDeliveryGraceTime(`0${numericValue}:${mins}`);
      } else {
        setDeliveryGraceTime(`${numericValue}:${mins}`);
      }
    } else if (type === "mins") {
      if (numericValue < 10) {
        setDeliveryGraceTime(`${hrs}:0${numericValue}`);
      } else {
        setDeliveryGraceTime(`${hrs}:${numericValue}`);
      }
    }
  }

  // Components
  function ValidateShift({ startTime, endTime, is24hAvailable }) {
    const shiftStart = moment(startTime, "HH:mm");
    const shiftEnd = moment(endTime, "HH:mm");
    const differenceBtwShiftsInMinutes = moment.duration(shiftEnd.diff(shiftStart)).asMinutes();
    const graceTimeInMinutes = moment.duration(deliveryGraceTime).asMinutes();
    if (is24hAvailable) {
      return ""; // Skips validation if shift is 24hrs
    }
    if (differenceBtwShiftsInMinutes <= graceTimeInMinutes * 2) {
      setIsDisabled(true);
      return <p style={{ color: "red" }}>{formatMessage({ id: "shifts_grace_validation" })}</p>;
    }
    setIsDisabled(false);
    return "";
  }

  // LifeCycle
  useEffect(() => {
    if (branchId) refetch();
  }, [branchId]);
  useEffect(() => {
    if (ally_id) {
      setFieldValue("allyCompanyId", +ally_id);
    }
  }, [ally_id]);

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
    setFieldValue("branchWorkingDayAttributes", workingHours.flat());
  }, [workingHours]);
  useEffect(() => {
    if (branchDetailsRes) {
      const extraServices = branchDetailsRes?.branch?.allyCompany?.allyExtraServices.map(
        (service) => service.extraService,
      );
      setExtraServicesWithTitles(extraServices);
    }
    if (branchDetailsRes?.branch.branchExtraServices.length) {
      const services = branchDetailsRes?.branch.branchExtraServices.map((service) => ({
        allyExtraServiceId: service.allyExtraServiceId,
        id: service.allyExtraService.extraServiceId,
        isActive: service.isActive,
        isRequired: service.isRequired,
        payType: service.payType,
        serviceValue: service.serviceValue,
      }));

      setAllyExtraServices(services);
      return;
    }
    if (allyExtraServices) {
      const services = allyExtraServices.allyExtraServices.filter(
        (service) => service.showFor == "branch",
      );
      const servicesIds = services.map((service) => service.extraServiceId);
      const ExtraServices = services.map((service) => ({
        allyExtraServiceId: service.id,
        id: service.extraServiceId,
        isActive: false,
        isRequired: service.isRequired,
        payType: service.payType,
        serviceValue: service.serviceValue,
        arTitle: service.extraService.arTitle,
        enTitle: service.extraService.enTitle,
      }));
      setAllyExtraServices(ExtraServices);
    }
  }, [allyExtraServices, branchDetailsRes]);
  useEffect(() => {
    if (branchDetailsRes?.branch) {
      if (branchDetailsRes.branch.branchDeliveryPrices.length) {
        const branchdelivery = branchDetailsRes.branch.branchDeliveryPrices.map((bDelivery) => ({
          from: bDelivery.from,
          to: bDelivery.to,
          deliveryPrice: bDelivery.deliveryPrice,
          handoverPrice: bDelivery.handoverPrice,
        }));
        SetDelivery(branchdelivery);
      } else {
        SetDelivery([{ from: 0 }]);
      }
      const { branch = {} } = branchDetailsRes;
      setFieldValue("managerName", branch.managerName || addEditBranchInitValues.managerName);
      setFieldValue("handover", branchDetailsRes.branch.canHandover);
      setFieldValue("arName", branch.arName || addEditBranchInitValues.arName);
      setFieldValue("enName", branch.enName || addEditBranchInitValues.enName);
      setFieldValue("description", branch.description || addEditBranchInitValues.description);
      setFieldValue("lat", branch.lat || addEditBranchInitValues.lat);
      setFieldValue("lng", branch.lng || addEditBranchInitValues.lng);
      setFieldValue("regionId", +branch.regionId);
      setFieldValue("referenceCode", branch?.referenceCode);
      setDeliveryPaymentMethod(branch?.deliveryPaymentMethod);
      setDeliveryGraceTime(branch?.deliveryGraceTime);
      setFieldValue(
        "phoneNumber",
        branch?.phoneNumber?.slice(3) || addEditBranchInitValues.phoneNumber,
      ); // works for numers start with 966 & won't be suitable for numbers from other countries
      const branchOfficeNumber = branch?.officeNumber;
      const branchMobileNumber = branch?.mobileNumber;

      let newBranchOfficeNumber;
      let newbranchMobileNumber;
      if (branchOfficeNumber?.startsWith("966")) {
        newBranchOfficeNumber = branchOfficeNumber.slice(3);
      } else if (branchOfficeNumber?.startsWith("+966")) {
        newBranchOfficeNumber = branchOfficeNumber.slice(4);
      } else {
        newBranchOfficeNumber = branch?.officeNumber;
      }
      if (branchMobileNumber?.startsWith("966")) {
        newbranchMobileNumber = branchMobileNumber.slice(3);
      } else if (branchMobileNumber?.startsWith("+966")) {
        newbranchMobileNumber = branchMobileNumber.slice(4);
      } else {
        newbranchMobileNumber = branch?.mobileNumber;
      }
      setOfficeNumberDisplay(newBranchOfficeNumber);
      setMobileNumberDisplay(newbranchMobileNumber || "");
      setFieldValue("officeNumber", branch?.officeNumber || addEditBranchInitValues.officeNumber); // works for numers start with 966 & won't be suitable for numbers from other countries
      setFieldValue("mobileNumber", branch?.mobileNumber || addEditBranchInitValues.mobileNumber);
      setFieldValue("email", branch.email || addEditBranchInitValues.email);
      setFieldValue(
        "paymentMethod",
        branch?.paymentMethod || addEditBranchInitValues.paymentMethod,
      );
      setFieldValue("districtNameEn", branch.districtNameEn);
      setFieldValue("districtNameAr", branch.districtNameAr);
      setFieldValue("addressAr", branch.districtNameAr);
      setFieldValue("addressEn", branch.districtNameEn);
      setFieldValue("isActive", branch.isActive || false);
      setFieldValue("fixedDeliveryFees", branch.fixedDeliveryFees || "");
      setFieldValue("canDelivery", branch.canDelivery || false);
      setFieldValue("deliverToAirport", !!branch.deliverToAirport || false);
      setFieldValue("airportId", branch?.airport?.id);
      setFieldValue("lat", branch.lat || false);
      setFieldValue("lng", branch.lng || false);
      const workingHourss = workingDaysIndeeces.map((day) => [
        ...branch?.branchWorkingDays
          .filter((d) => +d.weekDay === +day)
          .map((day) => ({
            isOn: day.isOn,
            weekDay: day.weekDay,
            endTime: day.endTime,
            startTime: day.startTime,
            is24hAvailable: day.is24hAvailable,
          })),
      ]);
      if (workingHourss[0].length) {
        setworkingHours(workingHourss);
      }
      setFieldValue("areaId", branch.area);
      getServices({ variables: { allyCompanyId: +branch.allyCompany.id } });

      setBankCardImage(branch.bankCardImage);
      setFieldValue(
        "allyCompanyId",
        AllyDropDownRes?.allyCompanies?.collection.find(
          (ally) => +ally.id === +branch.allyCompany.id,
        ) || "",
      );
    }

    return () => {
      setBankCardImage("");
    };
  }, [branchDetailsRes, AllyDropDownRes]);
  // END EDIT PROCESS

  useEffect(() => {
    if (bankCardImage) setFieldValue("bankCardImage", bankCardImage);
  }, [bankCardImage]);
useEffect(()=>{
  if (values.lat) {
    console.log(values.lat)
    const area = AreasRes?.areas.filter(
      (area) =>
        Number.parseFloat(area?.centerLat).toFixed(2) <=
          Number.parseFloat(values.lat).toFixed(2) &&
        Number.parseInt(area?.centerLat) == Number.parseInt(values.lat),
    );
    setFieldValue("areaId", area?.[0]);
   
  }

},[values.lat])
  return (
    <>
      <Helmet>
        <title>
          {formatMessage({
            id: branchId ? "EditBranch" : "AddBranch",
          })}
        </title>
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id={branchId ? "EditBranch" : "AddBranch"} />}
        match={location}
        lastElement={branchId || <IntlMessages id="AddBranch" />}
        enableBreadCrumb
      />
      <Tabs>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
          <TabList>
            <Tab>
              <FormattedMessage id="basicinformation" />
            </Tab>
            <Tab>
              <FormattedMessage id="delivery" />
            </Tab>
            <Tab>
              <FormattedMessage id="mapandlocation" />
            </Tab>
            <Tab>
              <FormattedMessage id="working.days" />
            </Tab>

            <Tab>
              <FormattedMessage id="extraservice" />
            </Tab>
          </TabList>
        </div>
        <TabPanel>
          {AllyDropDownRes && (
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <CustomTextField
                    fullWidth
                    name="arName"
                    value={values.arName}
                    onChange={handleChange}
                    error={!!submitCount && Boolean(errors.arName)}
                    errormsg={!!submitCount && errors.arName}
                  />
                </div>
                <div className="col-md-6">
                  <CustomTextField
                    fullWidth
                    name="enName"
                    value={values.enName}
                    onChange={handleChange}
                    error={!!submitCount && Boolean(errors.enName)}
                    errormsg={!!submitCount && errors.enName}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Autocomplete
                    id="ally-companies-dd"
                    className="mt-2 mb-2"
                    options={
                      !ally_id
                        ? AllyDropDownRes?.allyCompanies?.collection
                        : [
                            AllyDropDownRes?.allyCompanies?.collection.find(
                              (c) => +c.id == +ally_id,
                            ),
                          ] || []
                    }
                    getOptionLabel={(option) => option?.[`${locale}Name`]}
                    value={
                      ally_id
                        ? AllyDropDownRes?.allyCompanies?.collection.find((c) => +c.id == +ally_id)
                        : values?.allyCompanyId
                    }
                    disableClearable
                    onChange={(e, val) => {
                      getServices({ variables: { allyCompanyId: val.id } });
                      setFieldValue("allyCompanyId", val);
                    }}
                    loading={gettingAllies}
                    // disabled={!AllyDropDownRes?.allyCompanies?.collection}
                    renderInput={(p) => (
                      <AsyncLoader
                        error={submitCount && Boolean(errors?.allyCompanyId)}
                        params={p}
                        labelId="bookings.list.allyName"
                        loading={gettingAllies}
                      />
                    )}
                  />
                  <ErrorMessage
                    condition={!!submitCount && Boolean(errors?.allyCompanyId)}
                    errorMsg={errors.allyCompanyId}
                  />
                </div>
                <div className="col-md-6" dir="ltr">
                  <IntlTelInput
                    style={{ maxHeight: "37px", marginTop: "5px" }}
                    fieldId="input-tel"
                    inputClassName={
                      !phoneValidity && (values.mobile > 0 || !!submitCount) ? "input-error" : ""
                    }
                    separateDialCode
                    telInputProps={{ pattern: "[0-9]*" }}
                    ref={mobileReactRef}
                    preferredCountries={["sa"]}
                    containerClassName="intl-tel-input"
                    placeholder="512345678*"
                    value={officeNumberDisplay}
                    onPhoneNumberFocus={(isValid) => setPhoneValidity(isValid)}
                    onPhoneNumberChange={(isValid, num, obj, fullNum) => {
                      if (/^[0-9]+$/.test(num.toString()) || num === "") {
                        setFieldValue("officeNumber", fullNum.replace(/\D/gm, ""));
                        setFieldValue("officeNumber", num);
                        setOfficeNumberDisplay(num);
                      } else {
                        setFieldValue("officeNumber", values.officeNumber);
                      }
                      setPhoneValidity(isValid);
                    }}
                  />
                </div>
                <div className="col-md-6" dir="ltr">
                  <IntlTelInput
                    style={{ maxHeight: "37px", marginTop: "5px" }}
                    fieldId="input-tel"
                    inputClassName={
                      !phoneValidity2 && (values?.mobile > 0 || !!submitCount) ? "input-error" : ""
                    }
                    separateDialCode
                    telInputProps={{ pattern: "[0-9]*" }}
                    ref={mobileReactRef}
                    preferredCountries={["sa"]}
                    containerClassName="intl-tel-input"
                    placeholder="mobileNumber"
                    value={mobileNumberDisplay}
                    onPhoneNumberFocus={(isValid) => setPhoneValidity2(isValid)}
                    onPhoneNumberChange={(isValid, num, obj, fullNum) => {
                      if (/^[0-9]+$/.test(num?.toString()) || num === "") {
                        setFieldValue("mobileNumber", fullNum.replace(/\D/gm, ""));
                        setFieldValue("mobileNumber", num);
                        setMobileNumberDisplay(num);
                      } else {
                        setFieldValue("mobileNumber", values.mobileNumber);
                      }
                      setPhoneValidity2(isValid);
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <CustomTextField
                    onInput={(e) => {
                      e.target.value = e.target.value.toString().slice(0, 10);
                    }}
                    fullWidth
                    name="referenceCode"
                    value={values.referenceCode}
                    onChange={handleChange}
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
                      checked={values.deliverToAirport}
                      onChange={(e) => setFieldValue("deliverToAirport", e.target.checked)}
                      name="deliverToAirport"
                      color="primary"
                    />
                  }
                  label={formatMessage({ id: "deliverToAirport" })}
                />
              </div>

              <div>
                <div className="row">
                  <div className="col-md-4">
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        <FormattedMessage id="paymentmethod" />
                      </FormLabel>
                      <RadioGroup
                        aria-label="isActive"
                        name="payment"
                        value={values.paymentMethod}
                        onChange={handleChange}
                        row
                      >
                        {["cash", "online", "both"].map((state) => (
                          <FormControlLabel
                            key={state}
                            value={state == "both" ? "cash_and_online" : state}
                            control={<Radio row />}
                            label={formatMessage({ id: state })}
                            onChange={(e) => setFieldValue("paymentMethod", e.target.value)}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <ErrorMessage
                      // condition={!!touched.is_active && !!errors.is_active}
                      errorMsg={errors.is_active}
                    />
                  </div>
                </div>
              </div>
              <div></div>
            </form>
          )}
        </TabPanel>
        <TabPanel>
          <div className="row">
            <div className="px-3">
              <FormLabel component="legend">
                <FormattedMessage id="Car_delivery_service" />
              </FormLabel>
            </div>
            {["canDelivery", "handover"].map((state) => (
              <div className="col-md-4">
                <FormControlLabel
                  className={
                    state == "handover" && !values.handover && !values.canDelivery ? "d-none" : null
                  }
                  control={<Checkbox row />}
                  checked={
                    !!(state == "handover" && values?.handover) ||
                    !!(state == "canDelivery" && values?.canDelivery)
                  }
                  label={formatMessage({ id: state })}
                  onChange={(e) => {
                    if (state == "handover") {
                      if (!e.target.checked) {
                        const deliverd = [...delivery];
                        const UpdateDeliverd = deliverd.map((one) => ({
                          from: one.from,
                          to: one.to,
                          deliveryPrice: one.deliveryPrice,
                        }));
                        SetDelivery(UpdateDeliverd);
                      }
                      setFieldValue("handover", !values.handover);
                    } else {
                      if (!e.target.checked) {
                        SetDelivery([{ from: 0 }]);
                        setFieldValue("handover", false);
                      }
                      setFieldValue("canDelivery", !values.canDelivery);
                    }
                  }}
                />
              </div>
            ))}
          </div>
          {delivery.map((dd, index) => (
            <div className="row">
              <div className="col-md-2">
                <CustomTextField
                  fullWidth
                  disabled={!values.canDelivery || index == 0}
                  name="from.km"
                  value={
                    delivery[index]?.from?.toString().length || delivery[index]?.from?.length
                      ? delivery[index]?.from
                      : ""
                  }
                  onChange={(e) => {
                    const deliverd = [...delivery];

                    if (e.target.value.length) {
                      deliverd[index].from = parseFloat(e.target.value);
                      SetDelivery(deliverd);
                    } else {
                      delete deliverd[index].from;
                      SetDelivery(deliverd);
                    }
                  }}
                />
              </div>
              <div className="col-md-2">
                <CustomTextField
                  fullWidth
                  name="to.km"
                  disabled={!values.canDelivery}
                  value={delivery[index]?.to || ""}
                  onChange={(e) => {
                    const deliverd = [...delivery];

                    if (e.target.value.length) {
                      deliverd[index].to = parseFloat(e.target.value);
                      SetDelivery(deliverd);
                    } else {
                      delete deliverd[index].to;
                      SetDelivery(deliverd);
                    }
                  }}
                />
              </div>
              <div className="col-md-2">
                <CustomTextField
                  fullWidth
                  disabled={!values.canDelivery}
                  name="deliveryPrice"
                  value={delivery[index]?.deliveryPrice ? delivery[index]?.deliveryPrice : ""}
                  onChange={(e) => {
                    const deliverd = [...delivery];
                    if (e.target.value.length) {
                      deliverd[index].deliveryPrice = e.target.value;
                      SetDelivery(deliverd);
                    } else {
                      delete deliverd[index].deliveryPrice;
                      SetDelivery(deliverd);
                    }
                  }}
                />
              </div>
              <div className="col-md-2">
                <CustomTextField
                  fullWidth
                  name="handoverprice"
                  disabled={!values.handover}
                  value={delivery[index]?.handoverPrice ? delivery[index]?.handoverPrice : null}
                  onChange={(e) => {
                    const deliverd = [...delivery];
                    if (e.target.value.length) {
                      deliverd[index].handoverPrice = e.target.value;
                      SetDelivery(deliverd);
                    } else {
                      delete deliverd[index].handoverPrice;
                      SetDelivery(deliverd);
                    }
                  }}
                />
              </div>
              <div className="col-md-2" style={{ marginTop: "10px" }}>
                <div className="d-flex pointer" style={{ gap: "10px" }}>
                  <Tooltip title={formatMessage({ id: "AddRow" })} placement="top">
                    <AddIcon
                      className="pointer"
                      onClick={() => {
                        if (!values.canDelivery) {
                          return;
                        }
                        SetDelivery([...delivery, { from: delivery[index].to }]);
                      }}
                    />
                  </Tooltip>
                  {delivery.length > 1 && index != 0 && (
                    <Tooltip title={formatMessage({ id: "DeleteRow" })} placement="top">
                      <DeleteForeverIcon
                        className="pointer"
                        onClick={() =>
                          SetDelivery([...delivery].filter((br, deindex) => deindex !== index))
                        }
                      />
                    </Tooltip>
                  )}
                  {index === delivery.length - 1 && (
                    <Tooltip title={formatMessage({ id: "Clearvaluesofrow" })} placement="top">
                      <ClearIcon className="pointer" onClick={() => clearInputs(delivery, index)} />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          ))}
          <FormLabel component="legend" className="mt-4 mb-4">
            <FormattedMessage id="Delivery Payment Method" />
          </FormLabel>
          <div className="d-flex" style={{ gap: "10px" }}>
            {DeliveryPaymentMethods(formatMessage)?.map((item) => (
              <div>
                <input
                  name="delivey-methods"
                  id={item.label}
                  defaultChecked={deliveryPaymentMethod === item.value}
                  type="radio"
                  value={item.value}
                  onClick={(e) => setDeliveryPaymentMethod(e.target.value)}
                />
                <label htmlFor={item.label}>{item.label}</label>
              </div>
            ))}
          </div>
          <div className="row">
            <div className="col-md-6 mt-4 pt-2">
              {values.canDelivery && (
                <CustomTextField
                  fullWidth
                  name="fixedDeliveryFees"
                  value={values.fixedDeliveryFees}
                  onChange={(e) => {
                    const price = e.target.value;
                    if (/^[0-9]+(\.)?[0-9]*$/.test(price.toString()) || price === "") {
                      setFieldValue("fixedDeliveryFees", price);
                    } else {
                      setFieldValue("fixedDeliveryFees", values.fixedDeliveryFees);
                    }
                  }}
                />
              )}
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="d-inline">
            <Autocomplete
              id="city-dd"
              className="mt-2 mb-2"
              options={AreasRes?.areas || []}
              getOptionLabel={(option) => option?.[`${locale}Name`]}
              value={values?.areaId}
              disableClearable
              onChange={(e, val) => {
                setCenterlat(val.centerLat);
                setCenterlng(val.centerLng);
                setFieldValue("areaId", val);
                setFieldValue("airportId", "");
              }}
              loading={gettingAreas}
              disabled={!AreasRes?.areas}
              renderInput={(p) => (
                <AsyncLoader
                  error={submitCount && Boolean(errors?.areaId)}
                  params={p}
                  labelId="components.city"
                  loading={gettingAreas}
                />
              )}
            />
            <ErrorMessage
              condition={!!submitCount && Boolean(errors?.areaId)}
              errorMsg={errors.areaId}
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <CustomTextField
                fullWidth
                name="districtNameEn"
                value={values.districtNameEn}
                onChange={(e) => setFieldValue("districtNameEn", e.target.value)}
                error={!!submitCount && Boolean(errors.districtNameEn)}
                errormsg={!!submitCount && errors.districtNameEn}
              />
            </div>
            <div className="col-md-6">
              <CustomTextField
                fullWidth
                name="districtNameAr"
                value={values.districtNameAr}
                onChange={(e) => setFieldValue("districtNameAr", e.target.value)}
                error={!!submitCount && Boolean(errors.districtNameAr)}
                errormsg={!!submitCount && errors.districtNameAr}
              />
            </div>
            <div className="col-md-6">
              <CustomTextField
                fullWidth
                name="description"
                value={values.description}
                onChange={(e) => {
                  setFieldValue("description", e.target.value);
                  setDescription(e.target.value);
                }}
              />
            </div>
            <div className="col-md-6">
              <Autocomplete
                id="regionid"
                className="mb-2"
                options={RegionsRes?.regions || []}
                getOptionLabel={(option) => option?.[`${locale}Name`]}
                value={RegionsRes?.regions.find((region) => +region.id == +values?.regionId)}
                disableClearable
                onChange={(e, val) => {
                  setFieldValue("regionId", +val.id);
                }}
                loading={gettingRegions}
                disabled={!RegionsRes?.regions}
                renderInput={(p) => (
                  <AsyncLoader params={p} labelId="components.region" loading={gettingRegions} />
                )}
              />
            </div>
            {values.deliverToAirport && values?.areaId ? (
              <div className="col-md-6">
                <Autocomplete
                  key={values?.airportId}
                  id="airports"
                  className="mb-2"
                  options={AirportsRes?.airports || []}
                  getOptionLabel={(option) => option?.[`${locale}Name`]}
                  value={AirportsRes?.airports?.find(
                    (airport) => +airport.id == +values?.airportId,
                  )}
                  disableClearable
                  onChange={(e, val) => {
                    setFieldValue("airportId", +val.id);
                  }}
                  loading={gettingAirports}
                  disabled={!AirportsRes?.airports}
                  renderInput={(p) => (
                    <AsyncLoader params={p} labelId="Airports" loading={gettingAirports} />
                  )}
                />
              </div>
            ) : null}
          </div>
          <div
            className="m-4 p-4"
            style={{ minHeight: "300px", width: "90%", position: "relative" }}
          >
            <Map
              setDistrictNameAr={(districtnameAr) => {
                if (!mapchange && branchId) {
                  const { branch = {} } = branchDetailsRes;
                  setFieldValue("districtNameAr", branch.districtNameAr);
                  setFieldValue("addressAr", branch.districtNameAr);
                  setMapChange(true);
                  return;
                }
                setFieldValue("districtNameAr", districtnameAr);
                setFieldValue("addressAr", districtnameAr);
              }}
              setDistrictNameEn={(districtnameEn) => {
                if (!mapchange && branchId) {
                  const { branch = {} } = branchDetailsRes;
                  setFieldValue("districtNameEn", branch.districtNameEn);
                  setFieldValue("addressEn", branch.districtNameEn);

                  setMapChange(true);
                  return;
                }
                setFieldValue("addressEn", districtnameEn);

                setFieldValue("districtNameEn", districtnameEn);
              }}
              latitude={values.lat}
              longitude={values.lng}
              setLatitude={(lat) => setFieldValue("lat", lat)}
              setLongitude={(lng) => setFieldValue("lng", lng)}
              centerlat={centerlat}
              centerlng={centerlng}
              isBranch
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="row">
            <div className="w-50">
              {workingDaysIndeeces.map((day, dayIndex) => (
                <div className="mx-4 px-4">
                  <strong>{formatMessage({ id: workingDays[dayIndex] })}</strong>
                  <FormControlLabel
                    control={<Checkbox name="jason" />}
                    label={<FormattedMessage id="24.hours" />}
                    style={{ minWidth: "100px", marginLeft: "10px" }}
                    checked={workingHours[dayIndex][0]?.is24hAvailable}
                    onChange={(e) => {
                      const obj = {
                        isOn: e.target.checked,
                        weekDay: day,
                        startTime: "00:00",
                        endTime: "00:00",
                        is24hAvailable: e.target.checked,
                      };

                      const update = [...workingHours];
                      if (e.target.checked) {
                        const updated = update.map((updateone, index) =>
                          dayIndex == index ? [updateone[0]] : updateone,
                        );
                        updated[dayIndex][0] = obj;
                        setworkingHours([...updated]);
                      } else {
                        update[dayIndex][0] = obj;
                        setworkingHours(update);
                      }
                    }}
                  />
                  {workingHours?.[dayIndex].map((workTimes, index, arr) => (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="w-60 ">
                          <TextField
                            disabled={workTimes.is24hAvailable}
                            id="time"
                            label={formatMessage({ id: "starttime" })}
                            type="time"
                            dir="ltr"
                            value={workTimes.is24hAvailable ? "00:00" : workTimes.startTime}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => {
                              const a = moment(e.target.value, "HH:mm");
                              const b = moment(workTimes.endTime, "HH:mm");
                              const prevShiftEnd = moment(
                                workingHours[dayIndex][index - 1]?.endTime,
                                "HH:mm",
                              );
                              if (
                                workingHours.length > 0 &&
                                prevShiftEnd &&
                                a.diff(prevShiftEnd) < 0
                              ) {
                                enqueueSnackbar(
                                  formatMessage({
                                    id:
                                      "Time overlapping is not allowed for different shifts on a day",
                                  }),
                                  {
                                    preventDuplicate: true,
                                    variant: "info",
                                  },
                                );

                                return;
                              }
                              if (b.diff(a, "minutes") <= 0) {
                                enqueueSnackbar(
                                  formatMessage({
                                    id: "Start time of the shift must be before the end time",
                                  }),
                                  {
                                    preventDuplicate: true,
                                    variant: "info",
                                  },
                                );

                                return;
                              }
                              const obj = { ...workTimes, startTime: e.target.value };
                              const update = [...workingHours];
                              update[dayIndex][index] = obj;
                              setworkingHours(update);
                            }}
                            inputProps={{ step: 1800 }}
                          />
                        </div>
                        {workTimes?.startTime && (
                          <div className="w-60">
                            <TextField
                              disabled={workingHours[dayIndex][index]?.is24hAvailable}
                              id="time"
                              label={formatMessage({ id: "endtime" })}
                              type="time"
                              dir="ltr"
                              value={workTimes.is24hAvailable ? "23:59" : workTimes.endTime}
                              InputLabelProps={{ shrink: true }}
                              onChange={(e) => {
                                const a = moment(e.target.value, "HH:mm");
                                const b = moment(workTimes.startTime, "HH:mm");
                                const nextShiftStart = moment(
                                  workingHours[dayIndex][index + 1]?.startTime,
                                  "HH:mm",
                                );
                                if (
                                  workingHours.length > 0 &&
                                  nextShiftStart &&
                                  nextShiftStart.diff(a) <= 0
                                ) {
                                  enqueueSnackbar(
                                    formatMessage({
                                      id:
                                        "Time overlapping is not allowed for different shifts on a day",
                                    }),
                                    {
                                      preventDuplicate: true,
                                      variant: "info",
                                    },
                                  );
                                  return;
                                }
                                if (a.diff(b, "minutes") <= 0) {
                                  enqueueSnackbar(
                                    formatMessage({
                                      id: "Start time of the shift must be before the end time",
                                    }),
                                    {
                                      preventDuplicate: true,
                                      variant: "info",
                                    },
                                  );
                                  return;
                                }
                                const obj = { ...workTimes, endTime: e.target.value };
                                const update = [...workingHours];
                                update[dayIndex][index] = obj;
                                setworkingHours(update);
                              }}
                              inputProps={{ step: 1800 }}
                            />
                          </div>
                        )}
                        {workTimes?.endTime && (
                          <div className="d-flex align-items-center mt-4">
                            {/* disables delete if there is only one shift */}
                            {workingHours?.[dayIndex].filter((i) => i.startTime && i.endTime)
                              ?.length > 1 && (
                              <DeleteForeverIcon
                                className="mr-3 ml-3 pointer"
                                onClick={() => {
                                  const update = [...workingHours];
                                  update[dayIndex] = [...update[dayIndex]].filter(
                                    (a, idx) => idx !== index,
                                  );
                                  setworkingHours(update);
                                }}
                              />
                            )}

                            <IconButton
                              color="secondary "
                              onClick={() => {
                                const update = [...workingHours].map((arr, idx) =>
                                  +idx === +dayIndex
                                    ? [
                                        ...arr,
                                        {
                                          isOn: true,
                                          weekDay: day,
                                          endTime: "",
                                          startTime: "",
                                          is24hAvailable:
                                            workingHours[dayIndex][index]?.is24hAvailable,
                                        },
                                      ]
                                    : arr,
                                );

                                setworkingHours(update);
                              }}
                              disabled={workingHours[dayIndex][index]?.is24hAvailable}
                              aria-label="upload picture"
                              component="span"
                            >
                              <AddIcon className="mr-3 ml-3 pointer" />
                            </IconButton>
                            <Switch
                              className="mr-2 ml-2"
                              color="primary"
                              checked={workTimes.isOn}
                              onChange={(e) => {
                                const obj = { ...workTimes, isOn: e.target.checked };
                                const update = [...workingHours];
                                update[dayIndex][index] = obj;
                                setworkingHours(update);
                              }}
                              name="toggle"
                              inputProps={{ "aria-label": "toggle" }}
                            />
                          </div>
                        )}
                      </div>
                      <ValidateShift
                        startTime={workTimes?.startTime}
                        endTime={workTimes?.endTime}
                        is24hAvailable={workTimes?.is24hAvailable}
                      />
                    </>
                  ))}
                </div>
              ))}
              <div className="row m-4 px-4">
                <FormLabel component="legend">
                  <FormattedMessage id="Delivery Grace Time" />
                </FormLabel>
                <div className="mt-2">
                  <div className="d-flex" style={{ gap: "10px" }}>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={deliveryGraceTime.split(":")[0]}
                      onChange={(e) => handleTime(e.target.value, "hrs")}
                      onKeyPress={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                    <span>:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={deliveryGraceTime.split(":")[1]}
                      onChange={(e) => handleTime(e.target.value, "mins")}
                      onKeyPress={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  {["isActive", "isRequired", "arTitle", "enTitle", "paytype", "servicevalue"].map(
                    (data) => (
                      <TableCell>
                        <FormattedMessage id={data} />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              </TableHead>
              <TableBody style={{ maxHeight: 400, overflow: "auto" }}>
                {allyExtraservices.length
                  ? allyExtraservices.map((service, index) => (
                      <TableRow key={service.enName}>
                        <TableCell>
                          <FormControlLabel
                            control={<Checkbox row />}
                            checked={allyExtraservices[index].isActive}
                            onChange={(e) => {
                              const services = [...allyExtraservices];

                              services[index].isActive = !services[index].isActive;
                              setAllyExtraServices(services);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={<Checkbox row />}
                            checked={allyExtraservices[index].isRequired}
                            onChange={(e) => {
                              const services = [...allyExtraservices];
                              services[index].isRequired = !services[index].isRequired;
                              setAllyExtraServices(services);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {ServicesWithTitles.find((cservice) => +cservice.id == +service.id)
                            ?.arTitle || service.arTitle}
                        </TableCell>
                        <TableCell>
                          {ServicesWithTitles.find((cservice) => +cservice.id == +service.id)
                            ?.enTitle || service.enTitle}
                        </TableCell>

                        <TableCell>
                          <Select
                            className="dropdown-select mb-4"
                            options={paytype(formatMessage)}
                            placeholder={formatMessage({ id: "paytype" })}
                            onChange={(selection) => {
                              const services = [...allyExtraservices];
                              services[index].payType = selection.value;
                              setAllyExtraServices(services);
                            }}
                            defaultValue={paytype(formatMessage).find(
                              (paytype) => paytype.value === service.payType,
                            )}
                          />
                        </TableCell>

                        <TableCell>
                          <CustomTextField
                            style={{ width: "150px" }}
                            fullWidth
                            name="serviceValue"
                            defaultValue={service.serviceValue}
                            onChange={(e) => {
                              const services = [...allyExtraservices];
                              services[index].serviceValue = +e.target.value;
                              setAllyExtraServices(services);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
            {!allyExtraservices.length && (
              <div className="row justify-content-center m-0">
                <p style={{ marginTop: "20px" }}>
                  {" "}
                  <FormattedMessage id="No data found" />{" "}
                </p>
              </div>
            )}
          </TableContainer>
        </TabPanel>
      </Tabs>
      <div className="pt-25 text-right d-flex justify-content-end">
        <div
          title={
            values?.deliverToAirport && !values?.airportId
              ? formatMessage({ id: "Choose Airport" })
              : ""
          }
        >
          <button
            variant="contained"
            color="primary"
            className="btn btn-primary mr-4"
            type="submit"
            disabled={
              creatingBranch ||
              uploading ||
              EditingBranch ||
              isDisabled ||
              (values?.deliverToAirport && !values?.airportId)
            }
            onMouseDown={(e) => e.preventDefault()}
            onClick={formik.handleSubmit}
          >
            <FormattedMessage id="button.save" />
          </button>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-danger mr-15 text-white"
            onClick={() => {
              history.push("/cw/dashboard/branches");
              formik.resetForm();
            }}
            disabled={creatingBranch || uploading || EditingBranch}
          >
            <FormattedMessage id="button.cancel" />
          </button>
        </div>
        {progress === 100 ||
          ((uploading || creatingBranch) && progress > 0 && progress <= 100 && (
            <CircularProgressWithLabel value={progress} />
          ))}
      </div>
    </>
  );
}

export default memo(CreateEditBranch);
