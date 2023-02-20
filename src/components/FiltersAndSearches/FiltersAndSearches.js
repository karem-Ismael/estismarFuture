/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable radix */
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import { Alert } from "constants/constants";
import { TextField, Button } from "@material-ui/core";
import DatePicker from "react-modern-calendar-datepicker";
import { MakesDropDown, CitiesDropDown, StatusDropDown } from "components/DropDowns";
import AreasDropDown from "components/DropDowns/AreasDropDown";
import ModelDropDown from "components/DropDowns/ModelDropDown";
import AvailabillityStatueDropDown from "components/DropDowns/AvailabillityStatueDropDown";
import TransmissionDropDown from "components/DropDowns/TransmissionDropDown";
import YearDropDown from "components/DropDowns/YearDropDown";
import MakesIdDropDown from "components/DropDowns/MakesIdDropDown";
import IntlTelInput from "react-intl-tel-input";
import { ActiveInActiveSelect } from "components/DropDowns/ActiveInActiveSelect";
import { useHistory, useLocation } from "react-router";
import BranchesDropDown from "components/DropDowns/BranchesDropDown";
import BookingStatusDropDown from "components/DropDowns//BookingStatusDropDown";
import FeatureParentDropDown from "components/DropDowns/FeatureParentDropDown";
import VehicleTypeDropDown from "components/DropDowns/VehicleTypeDropDown";
import AllyName from "components/DropDowns/AllyName";
import PaymentDropDown from "components/DropDowns/PaymentDropDown";
import PaymentStatusDropDown from "components/DropDowns/PaymentStatusDropDown";
import { BranchesStatusDeleted } from "components/DropDowns/BranchesStatusDeleted";
import CustomerStatusDropDown from "components/DropDowns/BlockStatusDropDown";
import store from "../../store";

const trimFields = ["email", "nid"];
const { ally_id } = store.getState()?.authUser.user;

export function FiltersAndSearches({
  fields,
  filters,
  refetch,
  submitbtnid,
  setQuery,
  minimumDate,
  maximumDate,
  extraButtons,
  mobile,
  mobileRef,
  setPage,
  is_active,
  make,
  model,
  car,
  multi,
  manager,
  branch,
  branchmanager,
  coupoun,
  branchesDeletedFilter,
  isDeltedFilterSelected,
  setValue,
  setIsDeltedFilterSelected,
  pickupDateFilter,
  dropoffDateFilter,
}) {
  const mobileReactRef = useRef();
  const submitBtnRef = useRef();
  const history = useHistory();
  const location = useLocation();
  const { formatMessage } = useIntl();
  const [collectedQuery, setcollectedQuery] = useState({});
  // NOTE: Mobile number is set twice.
  const [mobileNumber, setMobileNumber] = useState("");
  const [makeId, setMakeId] = useState();
  const [allyId, setAllyId] = useState();

  const [pickupDate, setPickupDate] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);

  const onChangeMakeId = (id) => {
    setMakeId(+id);
  };
  const changeAlly = (id) => {
    setAllyId(id);
  };
  /**
   * depends on history location search on mount
   * if we have values this function should pass all values to the corresponding field
   */
  useEffect(() => {
    if (history?.location?.search) {
      const oldSearch = JSON.parse(decodeURI(history.location.search.slice(1)));
      setcollectedQuery(oldSearch);
      setTimeout(() => {
        submitBtnRef.current.click();
      }, 100);
    }
  }, [history?.location?.search]);

  useEffect(() => {
    if (pickupDate) {
      setcollectedQuery({
        ...collectedQuery,
        pickUpDateFrom: `${pickupDate.day < 10 ? `0${pickupDate.day}` : pickupDate.day}/${
          pickupDate.month < 10 ? `0${pickupDate.month}` : pickupDate.month
        }/${pickupDate.year}`,
      });
    }
  }, [pickupDate]);

  useEffect(() => {
    if (dropoffDate) {
      setcollectedQuery({
        ...collectedQuery,
        dropOffDateTo: `${dropoffDate.day < 10 ? `0${dropoffDate.day}` : dropoffDate.day}/${
          dropoffDate.month < 10 ? `0${dropoffDate.month}` : dropoffDate.month
        }/${dropoffDate.year}`,
      });
    }
  }, [dropoffDate]);

  function clearInputs() {
    setMobileNumber("");
    setValue ? setValue(0) : null;
    const query = {};
    setPickupDate(null);
    setDropoffDate(null);
    setPage(1);
    setcollectedQuery(query);
    setQuery(query);
  }

  const pickupDatePickerCustomInput = ({ ref }) => (
    <TextField
      className="custom-textfield fit-available"
      label={formatMessage({ id: `pick_up_date` })}
      fullWidth={false}
      variant="outlined"
      ref={ref}
      value={
        pickupDate
          ? `${pickupDate.day < 10 ? `0${pickupDate.day}` : pickupDate.day}/${
              pickupDate.month < 10 ? `0${pickupDate.month}` : pickupDate.month
            }/${pickupDate.year}`
          : ""
      }
    />
  );
  const dropoffDatePickerCustomInput = ({ ref }) => (
    <TextField
      className="custom-textfield fit-available"
      label={formatMessage({ id: `drop_off_date` })}
      fullWidth={false}
      variant="outlined"
      ref={ref}
      value={
        dropoffDate
          ? `${dropoffDate.day < 10 ? `0${dropoffDate.day}` : dropoffDate.day}/${
              dropoffDate.month < 10 ? `0${dropoffDate.month}` : dropoffDate.month
            }/${dropoffDate.year}`
          : ""
      }
    />
  );

  return (
    <form className="w-100" onSubmit={(e) => e.preventDefault()}>
      <div className="row grid-gap-10 w-100 m-0">
        {fields
          ?.filter((field) => field?.type === "search")
          .map((field) => {
            if (!field.name) return Alert("Please Provide a name");
            return (
              <div className="col-sm-12 col-md-3 mt-1" key={field?.name}>
                <TextField
                  inputProps={{
                    type: "text",
                  }}
                  label={field?.placeholder || formatMessage({ id: `${field?.name}.placeholder` })}
                  className="custom-textfield"
                  fullWidth={false}
                  variant="outlined"
                  id={field?.name}
                  value={collectedQuery?.[field?.name] || ""}
                  onChange={(e) => {
                    setcollectedQuery({
                      ...collectedQuery,
                      [field?.name]: trimFields.includes(field.name)
                        ? e.target.value.trim()
                        : e.target.value.trimStart(),
                    });
                  }}
                  placeholder={
                    field?.placeholder || formatMessage({ id: `${field?.name}.placeholder` })
                  }
                />
              </div>
            );
          })}
        {filters?.includes("ally") && !ally_id && (
          <div className="col-md-2 mt-1">
            <AllyName
              valueAttribute="id"
              selectedAlly={
                manager
                  ? collectedQuery.allyIds
                  : branch
                  ? collectedQuery.allyCompanyIds
                  : collectedQuery?.allyId
              }
              onAllyChange={changeAlly}
              setSelectedAlly={(Id) => {
                if (manager) {
                  return setcollectedQuery({ ...collectedQuery, allyIds: Id });
                }
                if (branch) {
                  return setcollectedQuery({ ...collectedQuery, allyCompanyIds: Id });
                }
                return setcollectedQuery({ ...collectedQuery, allyId: Id });
              }}
            />
          </div>
        )}
        {filters?.includes("branch") && (
          <div className="col-md-2 mt-1">
            <BranchesDropDown
              allyId={allyId}
              manageradd={branchmanager}
              isAlly={ally_id}
              valueAttribute="id"
              selectedBranch={manager ? collectedQuery.branches : collectedQuery?.branchId}
              setSelectedBranch={(Id) => {
                if (manager) {
                  return setcollectedQuery({ ...collectedQuery, branches: Id });
                }
                return setcollectedQuery({
                  ...collectedQuery,
                  branchId: Id != "null" ? Id : "null",
                });
              }}
            />
          </div>
        )}

        {filters?.includes("makes") && (
          <div className="col-md-3 mt-1">
            <MakesDropDown
              selectedMake={collectedQuery?.makeName}
              setSelectedMake={(name) => setcollectedQuery({ ...collectedQuery, makeName: name })}
            />
          </div>
        )}
        {filters?.includes("makeId") && (
          <div className="col-md-2 mt-1">
            <MakesIdDropDown
              valueAttribute="id"
              selectedMake={collectedQuery?.makeId}
              onMakeChange={onChangeMakeId}
              setSelectedMake={(Id) => setcollectedQuery({ ...collectedQuery, makeId: Id?.value })}
            />
          </div>
        )}
        {filters?.includes("makesId") && (
          <div className="col-md-2 mt-1">
            <MakesIdDropDown
              valueAttribute="id"
              selectedMake={make ? collectedQuery?.make : collectedQuery.carMakeId}
              onMakeChange={onChangeMakeId}
              setSelectedMake={(Id) => {
                if (make) {
                  return setcollectedQuery({ ...collectedQuery, make: Id?.value });
                }
                return setcollectedQuery({ ...collectedQuery, carMakeId: Id?.value });
              }}
            />
          </div>
        )}
        {filters?.includes("model") && (
          <div className="col-md-2 mt-1">
            <ModelDropDown
              makeId={makeId}
              valueAttribute="id"
              selectedModel={model ? collectedQuery?.model : collectedQuery?.carModelId}
              setSelectedModel={(Id) => {
                if (model) {
                  return setcollectedQuery({ ...collectedQuery, model: Id });
                }
                return setcollectedQuery({ ...collectedQuery, carModelId: Id });
              }}
            />
          </div>
        )}
        {filters?.includes("vehicle") && (
          <div className="col-md-2 mt-1">
            <VehicleTypeDropDown
              valueAttribute="id"
              selectedVehicle={car ? collectedQuery.vehicleType : collectedQuery?.vehicleTypeId}
              setSelectedVehicle={(Id) => {
                if (car) {
                  return setcollectedQuery({ ...collectedQuery, vehicleType: Id });
                }
                return setcollectedQuery({ ...collectedQuery, vehicleTypeId: Id });
              }}
            />
          </div>
        )}

        {filters?.includes("parent") && (
          <div className="col-md-3 mt-1">
            <FeatureParentDropDown
              valueAttribute="id"
              selectedParent={collectedQuery?.parentId}
              setSelectedParent={(Id) => {
                setcollectedQuery({ ...collectedQuery, parentId: Id });
                console.log(Id, "karem");
              }}
            />
          </div>
        )}
        {filters?.includes("payment") && (
          <div className="col-md-3 mt-1">
            <PaymentDropDown
              valueAttribute="id"
              selectedPayment={collectedQuery?.paymentMethod}
              setSelectedPayment={(payment) => {
                const query = collectedQuery;
                if (payment === "CASH") {
                  delete query.paymentStatusFilter;
                }
                setcollectedQuery({ ...query, paymentMethod: payment });
              }}
            />
          </div>
        )}
        {filters?.includes("paymentStatusFilter") &&
          collectedQuery?.paymentMethod?.toLowerCase() === "online" && (
            <div className="col-md-3 mt-1">
              <PaymentStatusDropDown
                valueAttribute="id"
                selectedPaymentStatus={collectedQuery?.paymentStatusFilter}
                setSelectedPaymentStatus={(paymentStatusFilter) => {
                  if (collectedQuery.paymentMethod === "ONLINE") {
                    setcollectedQuery({ ...collectedQuery, paymentStatusFilter });
                  }
                }}
              />
            </div>
          )}
        {filters?.includes("pickUpCityId") && (
          <div className={car ? "col-md-2" : "col-md-3 mt-1"}>
            <CitiesDropDown
              valueAttribute="enName"
              selectedCity={collectedQuery?.pickUpCityId}
              setSelectedCity={(area) =>
                setcollectedQuery({ ...collectedQuery, pickUpCityId: +area?.id })
              }
            />
          </div>
        )}
        {filters?.includes("cities") && (
          <div className={car ? "col-md-2" : "col-md-3 mt-1"}>
            <CitiesDropDown
              valueAttribute="enName"
              selectedCity={
                coupoun
                  ? collectedQuery?.cityId
                  : car
                  ? collectedQuery?.pickUpLocationId
                  : collectedQuery?.cityName
              }
              setSelectedCity={(area) => {
                if (car) {
                  return setcollectedQuery({ ...collectedQuery, pickUpLocationId: +area?.id });
                }
                if (coupoun) {
                  return setcollectedQuery({ ...collectedQuery, cityId: +area?.id });
                }
                return setcollectedQuery({ ...collectedQuery, cityName: area?.value });
              }}
            />
          </div>
        )}
        {filters?.includes("areas") && (
          <div className="col-md-2 mt-1">
            <AreasDropDown
              valueAttribute="id"
              selectedCity={collectedQuery?.areaIds}
              setSelectedCity={(ids) => setcollectedQuery({ ...collectedQuery, areaIds: ids })}
              multiple={multi}
            />
          </div>
        )}

        {filters?.includes("trans") && (
          <div className="col-md-2 mt-1">
            <TransmissionDropDown
              selectedTransmission={collectedQuery?.transmission}
              setSelectedTransmission={(transmission) =>
                setcollectedQuery({ ...collectedQuery, transmission })
              }
            />
          </div>
        )}
        {filters?.includes("availabillity_status") && (
          <div className="col-md-2 mt-1">
            <AvailabillityStatueDropDown
              selectedAvailabilityStatus={collectedQuery?.availabilityStatus}
              setSelectedAvailabilityStatus={(AvailabilityStatus) =>
                setcollectedQuery({ ...collectedQuery, availabilityStatus: AvailabilityStatus })
              }
            />
          </div>
        )}
        {filters?.includes("cutomer_status") && (
          <div className="col-md-2 mt-1">
            <CustomerStatusDropDown
              selectedCustomerStatus={collectedQuery?.blockingStatus}
              setSelectedCustomerStatus={(status) =>
                setcollectedQuery({ ...collectedQuery, blockingStatus: status })
              }
            />
          </div>
        )}

        {filters?.includes("booking") && (
          <div className="col-md-2 mt-1">
            <BookingStatusDropDown
              selectedBookingStatus={collectedQuery?.bookingStatus}
              setSelectedBookingStatus={(bookingStatus) =>
                setcollectedQuery({ ...collectedQuery, bookingStatus })
              }
            />
          </div>
        )}

        {filters?.includes("year") && (
          <div className="col-md-2 mt-1">
            <YearDropDown
              selectedYear={collectedQuery?.year}
              setSelectedYear={(year) => setcollectedQuery({ ...collectedQuery, year })}
            />
          </div>
        )}
        {(filters?.includes("status") || filters?.includes("businessStatus")) && (
          <div className="col-md-3 mt-1">
            <StatusDropDown
              type="status"
              selectedStatus={collectedQuery?.status}
              isBusiness={filters?.includes("businessStatus")}
              setSelecteStatus={(status) =>
                status?.length
                  ? setcollectedQuery({ ...collectedQuery, status })
                  : setcollectedQuery((prev) => {
                      const newQ = { ...prev };
                      delete newQ.status;
                      return newQ;
                    })
              }
            />
          </div>
        )}
        {filters?.includes("substatus") && (
          <div className="col-md-3 mt-1">
            <StatusDropDown
              type="substatus"
              selectedStatus={collectedQuery?.subStatus}
              setSelecteStatus={(subStatus) =>
                subStatus?.length
                  ? setcollectedQuery({ ...collectedQuery, subStatus })
                  : setcollectedQuery((prev) => {
                      const newQ = { ...prev };
                      delete newQ.subStatus;
                      return newQ;
                    })
              }
            />
          </div>
        )}
        {filters?.includes("dailyprice") && (
          <div className="col-sm-12 col-md-2 mt-1">
            <TextField
              inputProps={{
                type: "number",
                step: "0.1",
              }}
              label={formatMessage({ id: `car.dailyprice` })}
              className="custom-textfield"
              fullWidth={false}
              variant="outlined"
              value={collectedQuery?.dailyPrice || ""}
              onChange={(e) => {
                setcollectedQuery({
                  ...collectedQuery,
                  dailyPrice: e.target.value ? +e.target.value : null,
                });
              }}
              placeholder={formatMessage({ id: `car.dailyprice` })}
            />
          </div>
        )}
        {pickupDateFilter && (
          <div className="col-md-3 mt-1">
            <DatePicker
              calendarPopperPosition="bottom"
              renderInput={pickupDatePickerCustomInput} // render a custom input
              value={pickupDate || ""}
              onChange={setPickupDate}
            />
          </div>
        )}
        {dropoffDateFilter && (
          <div className="col-md-3 mt-1">
            <DatePicker
              calendarPopperPosition="bottom"
              renderInput={dropoffDatePickerCustomInput} // render a custom input
              value={dropoffDate || ""}
              onChange={setDropoffDate}
            />
          </div>
        )}
        {mobile && (
          <div className="col-md-3 mt-1" dir="ltr">
            <IntlTelInput
              fieldId="input-tel"
              separateDialCode
              telInputProps={{ pattern: "[0-9]*" }}
              ref={mobileReactRef}
              preferredCountries={["sa"]}
              containerClassName="intl-tel-input"
              value={mobileNumber}
              onPhoneNumberChange={(isValid, num, countryObject, fullNum) => {
                if (/^[0-9]+$/.test(num.toString()) || num === "") {
                  setMobileNumber(num);
                  setcollectedQuery({
                    ...collectedQuery,
                    [mobileRef]: num === "" ? null : fullNum.replace(/\D/gm, ""),
                  });
                } else {
                  setMobileNumber(mobileNumber);
                }
              }}
            />
          </div>
        )}
        {is_active === "isActive" && (
          <div className="col-md-3 mt-1">
            <ActiveInActiveSelect
              selectedStatus={collectedQuery?.[is_active]}
              setSelecteStatus={(value) => {
                setcollectedQuery({ ...collectedQuery, [is_active]: value });
              }}
            />
          </div>
        )}
        {branchesDeletedFilter && (
          <div className="col-md-3 mt-1">
            <BranchesStatusDeleted
              setIsDeltedFilterSelected={setIsDeltedFilterSelected}
              isDeletedSelected={collectedQuery?.isDeleted}
              selectedStatus={collectedQuery?.isDeleted || collectedQuery?.isActive}
              setSelecteStatus={(value) => {
                if (value === "isDeleted") {
                  delete collectedQuery.isActive;
                  setcollectedQuery({ ...collectedQuery, isDeleted: value });
                } else if (value === "-1") {
                  delete collectedQuery.isDeleted;
                  setcollectedQuery({ ...collectedQuery, isActive: value });
                } else {
                  delete collectedQuery.isDeleted;
                  setcollectedQuery({ ...collectedQuery, isActive: value });
                }
              }}
            />
          </div>
        )}
        <div className="mt-1 d-flex flex-row justify-content-end">
          <Button
            variant="contained"
            color="primary"
            className="mx-smt-15 btn btn-primary mr-1 ml-1"
            type="submit"
            ref={submitBtnRef}
            onClick={() => {
              const trimmedQuery = {};
              sessionStorage.setItem(location.pathname, JSON.stringify(collectedQuery));
              Object.entries(collectedQuery).forEach(([key, val]) => {
                trimmedQuery[key] = typeof val === "string" ? val?.trim() : val;
              });
              if (trimmedQuery?.is_active === -1) {
                trimmedQuery.is_active = null;
              }
              if (trimmedQuery[mobileRef] === "") {
                trimmedQuery.mobile = null;
              }
              history.replace({ search: JSON.stringify(trimmedQuery) });
              setPage(1);
              setQuery(trimmedQuery);
              refetch();
            }}
          >
            <span className="mr-1 ml-1">
              <FormattedMessage id={submitbtnid} />
            </span>
            <i className="zmdi zmdi-search mr-1 ml-1" />
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="mx-smt-15 btn btn-danger mr-1 ml-1"
            onClick={() => {
              clearInputs();
              history.replace({ search: "" });
            }}
          >
            <span className="mr-1 ml-1">
              <FormattedMessage id="clear" />
            </span>
            <i className="zmdi zmdi-delete ml-1 mr-1" />
          </Button>
          {extraButtons}
        </div>
      </div>
    </form>
  );
}

FiltersAndSearches.propTypes = {
  setPage: PropTypes.func,
  setQuery: PropTypes.func,
  submitbtnid: PropTypes.string,
  maximumDate: PropTypes.string,
  minimumDate: PropTypes.string,
  mobileRef: PropTypes.string,
  mobile: PropTypes.bool,
  fields: PropTypes.array,
  filters: PropTypes.array,
  is_active: PropTypes.string,
  multi: PropTypes.bool,
  model: PropTypes.string,
  make: PropTypes.string,
  refetch: PropTypes.func.isRequired,
  extraButtons: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};
