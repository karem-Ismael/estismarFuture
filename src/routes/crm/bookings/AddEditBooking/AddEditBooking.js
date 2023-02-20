/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/* eslint-disable radix */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undefined */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prefer-const */
/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { AllAreas } from "gql/queries/Areas.queries.gql";
import { CreateBooking, EditBooking } from "gql/mutations/Rental.mutations.gql";
import { ResendRentalIntegration } from "gql/mutations/ResendRental.gql";
import { CustomerDataDisplay } from "components/CustomerDataDisplay";
import AsyncLoader from "components/AutoComplete/AsyncLoader";
import { Autocomplete } from "@material-ui/lab";
import { bookingsTypes, persist, MonthsOfRent } from "constants/constants";
import moment from "moment";
import Map from "components/Map/MapWithSearch";
import { NotificationManager } from "react-notifications";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import IntlMessages from "util/IntlMessages";
import Checkbox from "@material-ui/core/Checkbox";

import {
  CircularProgress,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  TextField,
} from "@material-ui/core";
import FormControlLabelContainer from "components/shared/FormControlLabelContainer";
import RadioGroupContainer from "components/shared/containers/RadioGroupContainer";
import { DateTimePickerCustom } from "components/DateTimePickerCustom";
import { GetAvailableCars, GetCarProfile } from "gql/queries/Cars.queries.gql";
import { GetArea } from "gql/queries/GetArea.gql";
import {
  GetRentPrice,
  GetRentalDetailsQuery,
  GetBookingsQuery,
} from "gql/queries/Rental.queries.gql";
import { GetCustomerDetailsQuery } from "gql/queries/Users.queries.gql";
import CustomTextField from "components/Input/CustomTextField";
import { userCan } from "functions/userCan";
import FullPageLogoLoader from "components/shared/FullPageLogoLoader";
import CustomSelect from "components/shared/custom-select/CustomSelect";
import Select from "react-select";
import { Branches } from "gql/queries/AllBranches.gql";
import { AllyCompanies } from "gql/queries/AllCompanies.gql";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import GettingCustomerDetails from "./GettingCustomerDetails";
import BookingPriceSummary from "../booking-details/BookingPriceSummary";
import ChangeStatus from "./ChangeStatus";
import styles from "./_style.module.scss";
import ExtenstionRequests from "./extensionRequests";
import { UserWallet } from "gql/queries/CustomerWalletBalance.gql";

//Custom Styling
const customStyles = {
  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
};

function AddEditBooking() {
  //Utilities
  const { locale, formatMessage, messages } = useIntl();
  const { ally_id } = JSON.parse(localStorage.getItem("user_data"));

  //State
  const { bookingId } = useParams();
  const history = useHistory();
  const [allCompanies, setAllCompanies] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [isPickSameReturn, setIsPickSameReturn] = useState(true);
  const [pickUpCity, setPickUpCity] = useState({});
  const [dropOffCity, setDropOffCity] = useState();
  const [pickUpDate, setPickUpDate] = useState(moment().add(2, "hour"));
  const [dropOffDate, setDropOffDate] = useState(moment().add(3, "day").add(2, "hour"));
  const [selectedCar, setSelectedCar] = useState();
  const [bookingType, setBookingType] = useState("daily");
  const [deliverLat, setDeliverLat] = useState();
  const [deliverLng, setDeliverLng] = useState();
  const [insuranceId, setInsuranceId] = useState();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [suggestedPricePerDay, setSuggestedPricePerDay] = useState("");
  const [deliverAddress, setDeliverAddress] = useState("");
  const [editDatedReady, setEditDatedReady] = useState(false);
  const [months, setMonths] = useState("");
  const [monthTime, setMonthTime] = useState();
  const [changed, setChanged] = useState(false);
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDropoffBranch, setSelectedDropoffBranch] = useState(null);
  const [availableCarsCollection, setAvailableCarsCollection] = useState([]);
  const [avaiableCarsDD, setAvaiableCarsDD] = useState([]);
  const [extraServices, setExtraServices] = useState({});
  const [allyExtraServicesIds, setAllyExtraServicesIds] = useState([]);
  const [branchExtraServicesIds, setBranchExtraServicesIds] = useState([]);
  const [note, setNote] = useState();
  const [extensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [distanceCarUser, setDistanceCarUser] = useState();
  const [deliveryPrice, setDeliveryPrice] = useState();
  const [handoverprice, setHandOverPrice] = useState(null);
  const [handoverChecked, setHandOverChecked] = useState();
  const [handoverlat, setHandoverLat] = useState();
  const [handovderLng, setHandoverLng] = useState();
  const [clicked, setClicked] = useState(false);
  const [copounId, setCopounId] = useState();
  const [unLimited, setunLimited] = useState(false);

  //Variables
  const isDaily = (dropOffDate, pickUpDate) => moment(dropOffDate).diff(pickUpDate, "days") < 25;
  const incPage = () => setPage((pg) => pg + 1);
  const decPage = () => setPage((pg) => pg - 1);

  //GQL
  const [createBookingMutation, { loading: creatingRental }] = useMutation(CreateBooking);
  const [EditBookingMutation, { loading: editingRental }] = useMutation(EditBooking);
  const [resendRental] = useMutation(ResendRentalIntegration);

  const { refetch: refetchAllBookings } = useQuery(GetBookingsQuery, {
    skip: true,
  });

  const { data: rentalDetails, refetch: refetchBooking } = useQuery(GetRentalDetailsQuery, {
    skip: !bookingId,
    variables: { id: bookingId },
    fetchPolicy: "network-only",
    errorPolicy: "all",
    onError(error) {
      NotificationManager.error(error.message);
    },
  });
  const [getAreasQuery, { data: AreasRes, loading: gettingAreas }] = useLazyQuery(AllAreas);

  // Customer Data Request by id for edit mode
  const { data: customerDetailsRes, loading: loadingCustomerDetails } = useQuery(
    GetCustomerDetailsQuery,

    {
      skip: !rentalDetails?.rentalDetails,
      variables: { id: rentalDetails?.rentalDetails?.userId },
      errorPolicy: "all",
      onError(error) {
        NotificationManager.error(error.message);
      },
    },
  );
  const { data: walletBalance } = useQuery(UserWallet, {
    skip: !rentalDetails?.rentalDetails,
    variables: { userId: +rentalDetails?.rentalDetails?.userId },
  });


  const [getBranches, { data: branches }] = useLazyQuery(Branches, { fetchPolicy: "no-cache" });

  // Car Details Request
  const [getCarDetails, { data: carDetailsRes }] = useLazyQuery(GetCarProfile, {
    skip: !rentalDetails?.rentalDetails,
    variables: { id: rentalDetails?.rentalDetails?.carId },
  });

  const { data: BookingPriceRes, loading: calculatingPrice } = useQuery(GetRentPrice, {
    skip: !insuranceId || !selectedCar,
    errorPolicy: "all",
    onError(error) {
      NotificationManager.error(error.message);
    },
    variables: {
      carId: selectedCar?.id,
      isUnlimited: unLimited,
      deliveryPrice,
      handoverPrice:
        !isPickSameReturn ||
        (isPickSameReturn && handoverChecked) ||
        rentalDetails?.rentalDetails?.branchId !== rentalDetails?.rentalDetails?.dropOffBranchId
          ? handoverprice
          : undefined,
      handoverBranch: !isPickSameReturn
        ? selectedDropoffBranch?.value || selectedDropoffBranch
        : undefined,
      deliverLat,
      deliverLng,
      couponId: copounId ? +copounId : undefined,
      deliveryType:
        bookingType == "delivery" && (handoverChecked || selectedBranch?.canHandover)
          ? "two_ways"
          : bookingType == "delivery" && !selectedBranch?.canHandover
          ? "one_way"
          : "no_delivery",
      dropOffDate: moment(dropOffDate).format("DD/MM/YYYY"),
      dropOffTime: `${moment(dropOffDate).format("HH:mm")}:00`,
      insuranceId: +insuranceId || undefined,
      pickUpDate: moment(pickUpDate?._id || pickUpDate).format("DD/MM/YYYY"),
      pickUpTime: `${moment(pickUpDate?._id || pickUpDate).format("HH:mm")}:00`,
      allyExtraServices: allyExtraServicesIds?.length ? [...new Set(allyExtraServicesIds)] : null,
      branchExtraServices: branchExtraServicesIds?.length
        ? branchExtraServicesIds
        : null ||
          rentalDetails?.rentalDetails?.rentalExtraServices
            ?.filter((s) => s.extraServiceType === "branch")
            .map((i) => i.id),
      usedPrice: !changed ? rentalDetails?.rentalDetails?.pricePerDay : undefined,
      withWallet:rentalDetails?.rentalDetails?.walletTransactions ? true :false
    },
  });

  // Request => Available Cars
  const requestCarsvariables = {
    pickStartDate:
      rentalDetails?.rentalDetails && bookingId
        ? moment(pickUpDate?._id || pickUpDate).format("DD/MM/YYYY")
        : moment(pickUpDate?._id || pickUpDate).format("DD/MM/YYYY"),

    pickEndDate:
      moment(dropOffDate?._id || dropOffDate).diff(moment(), "days") < 0
        ? null
        : moment(dropOffDate?._id || dropOffDate).format("DD/MM/YYYY"),
    pickUpLocationId: +pickUpCity?.id,
    dropOffLocationId: isPickSameReturn ? +pickUpCity?.id : +dropOffCity?.id,
    isActive: true,
    limit: persist.unlimitedLimit,
    page,
  };
  const allBranches =
    branches?.branches.collection.map((branch) => ({
      value: branch?.id,
      label: branch?.[`${locale}Name`],
      canHandover: branch.canHandover,

      branchDeliveryPrices: [...branch?.branchDeliveryPrices],
    })) || [];

  const { data: allyCompanies, loading: loadingAllyCompanies } = useQuery(AllyCompanies, {
    variables: {
      limit: 1000,
      pickupCityId: !isPickSameReturn
        ? +pickUpCity?.id || +rentalDetails?.rentalDetails?.pickUpCityId
        : undefined,
      dropoffCityId: !isPickSameReturn
        ? +dropOffCity?.id || +rentalDetails?.rentalDetails?.dropOffCityId
        : undefined,
      cityId: isPickSameReturn
        ? +pickUpCity?.id || +rentalDetails?.rentalDetails?.pickUpCityId
        : undefined,
    },
  });
  const [getCars, { data: CarsRes, loading: gettingCars }] = useLazyQuery(GetAvailableCars);
  const [getArea, { data: area }] = useLazyQuery(GetArea);
  const [mapChange, setMapChange] = useState(false);

  //Functions
  const clearBranchSelection = () => {
    setSelectedBranch(null);
    setInsuranceId(null);
    setSelectedDropoffBranch(null);
    setAllyExtraServicesIds([]);
    setBranchExtraServicesIds([]);
  };

  //LifeCycle
  useEffect(() => {
    const AreaData = async () => {
      if (bookingId) {
        await refetchBooking();
        await getCarDetails();
        await getAreasQuery();
      } else {
        await getAreasQuery();
      }
    };
    AreaData();
  }, []);

  useEffect(() => {
    if (allyCompanies?.allyCompanies?.collection?.length) {
      const formattedList =
        allyCompanies.allyCompanies.collection.map((item) => ({
          value: item?.id,
          label: item?.[`${locale}Name`],
        })) || [];
      setAllCompanies(formattedList);
    } else {
      setAllCompanies([]);
    }
  }, [allyCompanies]);

  useEffect(() => {
    if (area && changed) {
      setPickUpCity(area.area);
    }
  }, [area]);

  useEffect(() => {
    if (CarsRes?.cars?.collection?.length) {
      let availableCars = [...CarsRes?.cars?.collection];
      setAvailableCarsCollection(availableCars);
      setAvaiableCarsDD(
        availableCars?.map((car) => ({
          label: carName(car),
          value: car.id,
          isUnlimited: car.isUnlimited,
          unlimitedFeePerDay: car.unlimitedFeePerDay,
        })),
      );
    } else {
      setAvailableCarsCollection([]);
      setAvaiableCarsDD([]);
    }
  }, [CarsRes, carDetailsRes]);

  useEffect(() => {
    // Calculate months on pickUpDate & dropOffDate change
    if (bookingType === "daily") {
      if (dropOffDate && pickUpDate) {
        setMonths(
          `${
            isDaily(dropOffDate, pickUpDate) ? "0" : moment(dropOffDate).diff(pickUpDate, "months")
          }`,
        );
        setMonthTime(moment(dropOffDate).add(1, "day").format("HH:mm"));
      }
    }
  }, [pickUpDate, dropOffDate]);

  useEffect(() => {
    if (bookingType === "daily" && bookingId) {
      setDropOffDate(
        moment(
          `${rentalDetails?.rentalDetails.dropOffDate}T${rentalDetails?.rentalDetails.dropOffTime}Z`,
        ).subtract(Math.abs(new Date().getTimezoneOffset() / 60), "hours"),
      );
    } else if (bookingType === "monthly" && bookingId) {
      setDropOffDate(
        moment(rentalDetails?.rentalDetails.dropOffDate)
          .hours(rentalDetails?.rentalDetails.dropOffTime.split(":")[0])
          .minutes(rentalDetails?.rentalDetails.dropOffTime.split(":")[1]),
      );
    }
    if (bookingType === "delivery" && changed) {
      setPickUpCity({});
      setDropOffCity({});
      setSelectedDropoffBranch(null);
    }
  }, [bookingType]);

  useEffect(() => {
    if (monthTime) {
      setDropOffDate(
        moment(dropOffDate).hours(monthTime.split(":")[0]).minutes(monthTime.split(":")[1]),
      );
    }
  }, [monthTime]);

  useEffect(() => {
    // EDIT MODE
    if (rentalDetails?.rentalDetails && !ready && !editDatedReady) {
      setDeliveryPrice(rentalDetails?.rentalDetails.deliveryPrice);
      if (
        rentalDetails?.rentalDetails.handoverPrice != 0 &&
        rentalDetails?.rentalDetails.handoverPrice != null
      ) {
        setHandOverPrice(rentalDetails?.rentalDetails.handoverPrice);
        setHandOverChecked(true);
      } else {
        setHandOverPrice(rentalDetails?.rentalDetails.handoverPrice);
      }
      const {
        pickUpDate,
        pickUpTime,
        dropOffTime,
        dropOffDate,
        deliverLat,
        userId,
        note,
        couponId,
        insuranceId,
      } = rentalDetails?.rentalDetails;
      setInsuranceId(insuranceId);

      // SETTING CUSTOMER ID to fire customer details query
      setCustomerId(userId);
      setCopounId(couponId);
      setNote(note);
      setunLimited(rentalDetails?.rentalDetails.isUnlimited);
      // TIMES

      setPickUpDate(
        moment(`${pickUpDate}T${pickUpTime}Z`).subtract(
          Math.abs(new Date().getTimezoneOffset() / 60),
          "hours",
        ),
      );
      setDropOffDate(
        moment(`${dropOffDate}T${dropOffTime}Z`).subtract(
          Math.abs(new Date().getTimezoneOffset() / 60),
          "hours",
        ),
      );
      setEditDatedReady(true);
      if (!isDaily(dropOffDate, pickUpDate) && !deliverLat) {
        setMonths(moment(dropOffDate).diff(pickUpDate, "months"));
        setBookingType("monthly");
      }

      if (rentalDetails?.rentalDetails?.suggestedPrice) {
        setSuggestedPricePerDay(rentalDetails?.rentalDetails?.suggestedPrice);
      }
      setSelectedDropoffBranch(rentalDetails?.rentalDetails?.dropOffBranchId);
    }

    // to set old used cities locations
    if (
      (rentalDetails?.rentalDetails?.deliverLat || rentalDetails?.rentalDetails?.deliverLng) &&
      !ready
    ) {
      setDeliverLat(rentalDetails?.rentalDetails?.deliverLat);
      setDeliverLng(rentalDetails?.rentalDetails?.deliverLng);
      setBookingType("delivery");
    }
    if (bookingId && CarsRes?.cars?.collection?.length && carDetailsRes?.carProfile && !ready) {
      setSelectedCar(carDetailsRes.carProfile);
      setDistanceCarUser(carDetailsRes?.carProfile?.distanceBetweenCarUser);
      if (rentalDetails?.rentalDetails.subStatus == "ally_declined") {
        setInsuranceId(null);
      } else if (changed) {
        setInsuranceId(carDetailsRes?.carProfile?.carInsurances[0]?.id);
      }

      setReady(true);
    }
    setPaymentMethod(rentalDetails?.rentalDetails?.paymentMethod);
  }, [rentalDetails?.rentalDetails, AreasRes, CarsRes]);

  useEffect(() => {
    if (rentalDetails?.rentalDetails?.allyCompanyId) {
      getBranches({
        variables: {
          allyCompanyIds: selectedCompany?.value
            ? [selectedCompany?.value]
            : [rentalDetails?.rentalDetails?.allyCompanyId],
          areaIds: pickUpCity?.id ? [pickUpCity?.id] : [rentalDetails.rentalDetails.pickUpCityId],
          canDelivery: bookingType === "delivery" ? true : undefined,
          isActive: true,
        },
      });
    }
    // if (rentalDetails?.rentalDetails?.branchId && !CarsRes?.length && AreasRes && pickUpCity) {
    //   getCars({
    //     variables: {
    //       ...requestCarsvariables,
    //       branchId: rentalDetails?.rentalDetails?.branchId,
    //       canDelivery: bookingType === "delivery" ? true : undefined,
    //     },
    //   });
    // }
  }, [rentalDetails?.rentalDetails]);

  useEffect(() => {
    if (!changed && allCompanies && !selectedCompany) {
      setSelectedCompany(
        allCompanies.find((i) => +i.value === +rentalDetails?.rentalDetails?.allyCompanyId),
      );
    }
    if (
      !changed &&
      allBranches &&
      !selectedBranch &&
      selectedCompany?.value == rentalDetails?.rentalDetails?.allyCompanyId
    ) {
      setSelectedBranch(
        allBranches.find((i) => +i.value === +rentalDetails?.rentalDetails?.branchId),
      );
    }
  }, [allCompanies, allBranches, CarsRes, changed]);

  useEffect(() => {
    // to set old used cities locations
    if (!changed) {
      if (AreasRes && rentalDetails?.rentalDetails) {
        setIsPickSameReturn(
          +rentalDetails?.rentalDetails?.branchId ===
            +rentalDetails?.rentalDetails?.dropOffBranchId,
        );
        setPickUpCity(
          AreasRes?.areas.find((area) => +area?.id === +rentalDetails?.rentalDetails?.pickUpCityId),
        );
        setDropOffCity(
          AreasRes?.areas.find(
            (area) => +area?.id === +rentalDetails?.rentalDetails?.dropOffCityId,
          ),
        );
        setDeliverLat(
          AreasRes?.areas.find((area) => +area?.id === +rentalDetails?.rentalDetails?.pickUpCityId)
            .centerLat,
        );
        setDeliverLng(
          AreasRes?.areas.find((area) => +area?.id === +rentalDetails?.rentalDetails?.pickUpCityId)
            .centerLng,
        );
      }
    }
  }, [AreasRes, changed]);

  useEffect(() => {
    if (selectedBranch?.value) {
      getCars({
        variables: {
          ...requestCarsvariables,
          branchId: selectedBranch.value,
          limit: 10,
          canDelivery: bookingType === "delivery" ? true : undefined,
        },
      });
      const filteredBranch = branches?.branches?.collection.find(
        (b) => +b.id === +selectedBranch.value,
      );
      if (filteredBranch) {
        setExtraServices({
          allyExtraServicesForAlly: filteredBranch.allyCompany.allyExtraServicesForAlly,
          branchExtraServices: filteredBranch.branchExtraServices,
        });
        // adds required services to ids
        if (filteredBranch?.allyCompany?.allyExtraServicesForAlly?.length) {
          let itemsArray = [];
          for (const item of filteredBranch.allyCompany.allyExtraServicesForAlly) {
            if (item.isRequired) {
              itemsArray.push(item.id);
            } else if (
              rentalDetails?.rentalDetails?.rentalExtraServices
                ?.filter((s) => s.extraServiceType === "ally_company")
                ?.find((i) => +i.extraServiceId === +item.id)
            ) {
              itemsArray.push(item.id);
            }
          }
          setAllyExtraServicesIds([...allyExtraServicesIds, ...itemsArray]);
        } else {
          setAllyExtraServicesIds([]);
        }
        if (filteredBranch?.branchExtraServices?.length) {
          let itemsArray = [];
          for (const item of filteredBranch.branchExtraServices) {
            if (item.isRequired && item.isActive) {
              itemsArray.push(item.id);
            } else if (
              rentalDetails?.rentalDetails?.rentalExtraServices
                ?.filter((s) => s.extraServiceType === "branch")
                ?.find((i) => +i.extraServiceId === +item.id)
            ) {
              itemsArray.push(item.id);
            }
          }
          setBranchExtraServicesIds([...branchExtraServicesIds, ...itemsArray]);
        }
      }
    }
  }, [selectedBranch]);
useEffect(()=>{
 if(!bookingId){
  getCars({
    variables: {
      ...requestCarsvariables,
      branchId: rentalDetails?.rentalDetails?.branchId ||  selectedBranch?.value,
    
      limit:10,
      page,
      canDelivery: bookingType === "delivery" ? true : undefined,
    },
  });
 }
},[page])
  // useEffect(() => {
  //   getCars({
  //     variables: {
  //       ...requestCarsvariables,
  //       branchId: selectedBranch?.value || undefined,
  //       limit: 10,
  //       canDelivery: bookingType === "delivery" ? true : undefined,
  //       dropOffLocationId: isPickSameReturn ? pickUpCity?.id : dropOffCity?.id,
  //     },
  //   });
  // }, [isPickSameReturn, dropOffCity]);

  useEffect(() => {
    if (pickUpCity?.id && selectedCompany?.value && !bookingId) {
      getBranches({
        variables: {
          allyCompanyIds: selectedCompany?.value
            ? [selectedCompany?.value]
            : [rentalDetails?.rentalDetails?.allyCompanyId],
          areaIds: pickUpCity?.id ? [pickUpCity?.id] : undefined,
          isActive: true,
          limit: 500,
          canDelivery: bookingType === "delivery" ? true : undefined,
        },
      });
    }
  }, [pickUpCity, selectedCompany]);

  useEffect(() => {
    if (selectedCar && selectedBranch && distanceCarUser) {
      const deliveryprice = selectedBranch.branchDeliveryPrices.filter(
        (branch) => +branch.from <= +distanceCarUser && branch.to >= +distanceCarUser,
      );

      if (rentalDetails?.rentalDetails.subStatus == "ally_declined") {
        setInsuranceId(null);
      } else if (changed) {
        setInsuranceId(selectedCar.carInsurances[0]?.id);
      }

      if (deliveryprice.length && changed) {
        setDeliveryPrice(deliveryprice[0].deliveryPrice);
        if (
          deliveryprice[0].handoverPrice != undefined &&
          selectedBranch?.canHandover &&
          bookingType === "delivery" &&
          (!bookingId || !handoverprice)
        ) {
          setHandOverPrice(deliveryprice[0].handoverPrice);
          setHandOverChecked(true);
        }
      }
      if (selectedBranch.canHandover) {
        setHandOverChecked(true);
      }
    }
  }, [selectedCar, selectedBranch, isPickSameReturn]);

  useEffect(() => {
    if (deliverLat) {
      const area = AreasRes?.areas.filter(
        (area) =>
          Number.parseFloat(area?.centerLat).toFixed(2) <=
            Number.parseFloat(deliverLat).toFixed(2) &&
          Number.parseInt(area?.centerLat) == Number.parseInt(deliverLat),
      );
      if (deliverLat && deliverLng && area?.length) {
        setDeliveryPrice(null);
        // setPickUpCity(area[0] || {});
      }
    }
  }, [deliverLat, deliverLng, mapChange]);

  useEffect(() => {
    if (rentalDetails?.rentalDetails.subStatus == "ally_declined") {
      setInsuranceId(null);
    }
  }, [rentalDetails?.rentalDetails]);

  function getDropoffBranches() {
    if (selectedCar && dropOffCity) {
      const availableHandoverBranches = selectedCar?.branch?.availableHandoverBranches;
      const filteredBranches = availableHandoverBranches
        ?.filter((b) => b.areaId == dropOffCity?.id)
        .map((i) => ({
          label: i.name,
          value: i.id,
          ...i,
        }));
      return filteredBranches;
    }
  }

  useEffect(() => {
    if (selectedDropoffBranch && !isPickSameReturn && changed && (!bookingId || !handoverprice)) {
      if (selectedDropoffBranch) {
        const { allyHandoverCities } = selectedDropoffBranch?.allyCompany || {};

        if (allyHandoverCities?.length) {
          const filteredCity = allyHandoverCities.find(
            (c) =>
              (c.pickUpCityId == pickUpCity?.id && c.dropOffCityId == dropOffCity?.id) ||
              (c.pickUpCityId == dropOffCity?.id && c.dropOffCityId == pickUpCity?.id),
          );
          setHandOverPrice(filteredCity?.price);
        }
      }
    }
  }, [selectedDropoffBranch, isPickSameReturn]);

  //Form Submit
  function handleSubmitRent(e) {
    e.preventDefault();
    setClicked(true);

    const variables = {
      carId: selectedCar?.id,
      paymentMethod,
      pickUpCityId: pickUpCity?.id,
      pickUpDate: pickUpDate.format("DD/MM/YYYY"), // convertLocalTimeToUtc(pickUpDate), // moment(pickUpDate?._id || pickUpDate).format("DD/MM/YYYY"),
      pickUpTime: pickUpDate.format("HH:mm:ss"), // convertLocalTimeToUtc(pickUpDate), // `${moment(pickUpDate?._id || pickUpDate).format("HH:mm")}:00`,
      dropOffBranchId: isPickSameReturn
        ? +selectedCar?.branch?.id
        : +selectedDropoffBranch?.value || +rentalDetails?.rentalDetails?.dropOffBranchId,
      dropOffCityId: isPickSameReturn ? pickUpCity?.id : +dropOffCity?.id,
      dropOffDate: dropOffDate.format("DD/MM/YYYY"), // convertLocalTimeToUtc(dropOffDate), // moment(dropOffDate).format("DD/MM/YYYY"),
      dropOffTime: dropOffDate.format("HH:mm:ss"), // convertLocalTimeToUtc(dropOffDate),
      insuranceId,
      userId: customerDetails?.users?.collection?.[0]?.id,
      deliverLat:
        bookingType === "delivery" ? deliverLat || rentalDetails?.rentalDetails?.deliverLat : null,
      deliverLng:
        bookingType === "delivery" ? deliverLng || rentalDetails?.rentalDetails?.deliverLng : null,
      deliveryPrice: bookingType === "delivery" ? deliveryPrice : undefined,
      handoverPrice:
        isPickSameReturn && bookingType !== "delivery" // same as pickup and daily or monthly => do not send handover value
          ? undefined
          : !isPickSameReturn || (isPickSameReturn && bookingType == "delivery") // sends handover value from ally company page in all booking types if different pickup location or send handover value from branch page in delivery tab and same as pickup location
          ? handoverprice
          : undefined,
      deliverType:
        bookingType === "delivery" && handoverChecked
          ? "two_ways"
          : bookingType === "delivery" && !handoverChecked
          ? "one_way"
          : "no_delivery",
      deliverAddress:
        bookingType === "delivery"
          ? deliverAddress || rentalDetails?.rentalDetails?.deliverAddress || pickUpCity?.id
          : "",
      allyExtraServices: [...new Set(allyExtraServicesIds)],
      branchExtraServices: [...new Set(branchExtraServicesIds.map((b) => +b))],
      note,
      isUnlimited: unLimited,
      handoverAddress:
        bookingType === "delivery"
          ? deliverAddress || rentalDetails?.rentalDetails?.deliverAddress || pickUpCity?.id
          : "",
      handoverLat: !isPickSameReturn
        ? handoverlat || rentalDetails?.rentalDetails?.handoverLat
        : isPickSameReturn
        ? deliverLat || rentalDetails?.rentalDetails?.deliverLat
        : undefined,
      handoverLng: !isPickSameReturn
        ? handovderLng || rentalDetails?.rentalDetails?.handoverLng
        : isPickSameReturn
        ? deliverLng || rentalDetails?.rentalDetails?.deliverLng
        : undefined,
    };

    if (suggestedPricePerDay?.length) {
      variables.suggestedPrice = +suggestedPricePerDay;
    }else{
      variables.suggestedPrice=0
    }

    if (bookingId) {
      variables.rentalId = +bookingId;
      EditBookingMutation({
        variables,
      })
        .then(() => {
          NotificationManager.success(formatMessage({ id: "success.edit.rental" }));
          refetchBooking().then(() => {
            setTimeout(() => {
              history.push("/cw/dashboard/bookings");
            }, 1500);
          });
        })
        .catch((err) => {
          NotificationManager.error(err.message);
        });
    } else {
      if (!dropOffCity && !isPickSameReturn) {
        return;
      }
      createBookingMutation({
        variables,
      })
        .then(() => {
          NotificationManager.success(formatMessage({ id: "success.create.rental" }));
          refetchAllBookings().finally(() => {
            setTimeout(() => {
              history.push("/cw/dashboard/bookings");
            }, 1500);
          });
        })
        .catch((err) => {
          NotificationManager.error(err.message);
        });
    }
  }

  //JSX
  return (
    <>
      {(editingRental || creatingRental) && <FullPageLogoLoader />}
      {
        <>
          <Helmet>
            <title>
              {formatMessage({
                id: bookingId ? "EditBooking" : "addBooking",
              })}
            </title>
          </Helmet>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <PageTitleBar
                  title={<IntlMessages id={bookingId ? "EditBooking" : "addBooking"} />}
                  match={location}
                  lastElement={bookingId || <IntlMessages id="addBooking" />}
                  enableBreadCrumb
                  extraButtons={
                    <>
                      {bookingId &&
                        rentalDetails?.rentalDetails.isIntegratedRental &&
                        rentalDetails?.rentalDetails.rentalIntegrationStatus != "Accept" && (
                          <Button
                            variant="contained"
                            color="primary"
                            className="mx-sm-15 btn btn-success"
                            onClick={() =>
                              resendRental({
                                variables: {
                                  rentalId: bookingId,
                                },
                              })
                                .then((res) => {
                                  if (
                                    res.data.resendRentalIntegration.rental
                                      .rentalIntegrationStatus == "Accept"
                                  ) {
                                    NotificationManager.success(
                                      <FormattedMessage id="resend.done" />,
                                    );
                                    refetchBooking();
                                  } else {
                                    NotificationManager.error(
                                      res.data.resendRentalIntegration.rental
                                        .rentalIntegrationErrorMessage,
                                    );
                                    refetchBooking();
                                  }
                                })
                                .catch((err) => NotificationManager.error(err.message))
                            }
                          >
                            <IntlMessages
                              id="resendRental"
                              values={{ something: messages?.booking }}
                            />
                          </Button>
                        )}
                    </>
                  }
                />
              </div>
              {bookingId &&
                userCan("rentals.extend") &&
                rentalDetails?.rentalDetails?.status &&
                rentalDetails.rentalDetails.status !== "pending" &&
                rentalDetails.rentalDetails.status !== "confirmed" && (
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setIsExtensionModalOpen(true)}
                    >
                      <FormattedMessage id="Extension Requests"  />
                    </Button>
                  </div>
                )}
            </div>
            <div>
              {userCan("rentals.update_status") && bookingId && (
                <ChangeStatus rentalDetails={rentalDetails} />
              )}
            </div>
          </div>
        </>
      }
      {!bookingId && (
        <div className={`mt-4 ${styles.customerDetails}`}>
          <h3>
            <FormattedMessage id="rental.enterphone" />
          </h3>
          <GettingCustomerDetails
            setCustomerDetails={setCustomerDetails}
            setCustomerId={setCustomerId}
          />
        </div>
      )}

      {(customerDetails || customerDetailsRes) && (
        <div className="row mt-mt-4 pt-4 p-1" style={{ marginTop: "0px" }}>
          <div
            className="col-md-7 d-flex flex-column"
            style={{ display: "grid !important", gridRowGap: "10px" }}
          >
            <div
              className="mt-3 mb-1"
              style={{ gap: "20px" }}
              onChange={(e) => {
                setChanged(true);
                setBookingType(e.target.value);
              }}
            >
              <h4>
                <FormattedMessage id="rental.bookingType" />
              </h4>
              <div className="d-flex" style={{ gap: "20px" }}>
                {bookingsTypes.map((type) => (
                  <div className="form-check form-check-inline" key={type.id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      checked={type.name === bookingType}
                      name="bookingType"
                      id={type.name}
                      value={type.name}
                      onChange={() => {
                        setChanged(true);
                      }}
                    />
                    <label className="form-check-label p-0 m-2" htmlFor={type.name}>
                      <FormattedMessage id={type?.name} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4>
                <FormattedMessage id="rental.bookingTiming" />
              </h4>

              {bookingId && gettingAreas && (
                <>
                  <CircularProgress />
                </>
              )}
              {(!bookingId || !(bookingId && !editDatedReady)) && (
                <div className="d-flex justify-content-between">
                  <DateTimePickerCustom
                    autoOk
                    label={formatMessage({ id: "rental.pickupDateTime" })}
                    value={pickUpDate}
                    onChange={(val) => {
                      setChanged(true);
                      setTimeout(() => {
                        setPickUpDate(val);
                      }, 100);
                    }}
                    minDateMessage={formatMessage({ id: "pleaseSelectSuitablePicupDate" })}
                  />
                  {bookingType !== "monthly" && (
                    <DateTimePickerCustom
                      autoOk
                      value={dropOffDate}
                      label={formatMessage({ id: "rental.dropoffDateTime" })}
                      onChange={(val) => {
                        setChanged(true);
                        setTimeout(() => {
                          setDropOffDate(val);
                        }, 100);
                      }}
                      minDate={pickUpDate}
                      minDateMessage={formatMessage({ id: "validation.fromMustBeLessThanTo" })}
                    />
                  )}
                </div>
              )}
              {bookingType === "monthly" && (
                <div className="row">
                  <div className="col-md-6">
                    <FormControl variant="standard">
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedMessage id="months.count" />
                      </InputLabel>
                      <Select
                        placeholder={formatMessage({ id: "months.count" })}
                        options={MonthsOfRent}
                        value={MonthsOfRent.find((month) => +month.value == +months)}
                        onChange={(selection) => {
                          setMonths(+selection.value);
                          setDropOffDate(moment(pickUpDate).add(+selection.value * 30, "days"));
                          setChanged(true);
                        }}
                        getOptionLabel={(options) => <FormattedMessage id={options.label} />}
                      ></Select>
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    <TextField
                      id="time"
                      label={formatMessage({ id: "rental.dropoffTime" })}
                      type="time"
                      defaultValue={
                        monthTime !== "Invalid date"
                          ? monthTime
                          : moment(dropOffDate).format("HH:mm")
                      }
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => {
                        setMonthTime(e.target.value);
                      }}
                      inputProps={{ step: 300 * 6 }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <h4>
                <FormattedMessage id="rental.bookingLocation" />
              </h4>
              <div
                className="form-check mt-3 d-flex align-items-center"
                style={{ padding: "0 15px" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isPickSameReturn"
                  checked={isPickSameReturn}
                  data-testid="isPickSameReturn"
                  onClick={(e) => {
                    setIsPickSameReturn(e.target.checked);
                  }}
                />
                <label className="form-check-label p-0 m-2" htmlFor="isPickSameReturn">
                  <FormattedMessage id="same.as.pickup.location" />
                </label>
              </div>
              {bookingType === "delivery" && (
                <div
                  style={{
                    minHeight: "300px",
                    width: "100%",
                    position: "relative",
                    marginBottom: "30px",
                  }}
                >
                  <Map
                    latitude={deliverLat}
                    longitude={deliverLng}
                    setLatitude={(lat) => setDeliverLat(lat)}
                    setLongitude={(lng) => setDeliverLng(lng)}
                    centerlat={deliverLat}
                    centerlng={deliverLng}
                    setMapChange={setMapChange}
                    mapChange={mapChange}
                    isBooking
                    setDeliverAddress={setDeliverAddress}
                  />
                </div>
              )}
              {(!bookingId && !gettingAreas) || //View
              (bookingId && !gettingAreas && pickUpCity) ? (
                //Edit - make sure that city exists before rendering
                <Autocomplete
                  id="pickup-location"
                  options={AreasRes?.areas || []}
                  className="mt-2 mb-2"
                  getOptionLabel={(option) => option?.[`${locale}Name`]}
                  value={pickUpCity}
                  disableClearable
                  onChange={(e, newValue) => {
                    if (bookingType === "delivery") {
                      setDeliverLat(newValue.centerLat);
                      setDeliverLng(newValue.centerLng);
                    }

                    clearBranchSelection();
                    setDeliveryPrice(null);
                    setPickUpCity(newValue);
                    setMapChange(!mapChange);
                  }}
                  loading={gettingAreas}
                  disabled={!customerId}
                  renderInput={(params) => (
                    <AsyncLoader
                      params={params}
                      labelId="rental.pickupLocation"
                      loading={gettingAreas}
                      value={pickUpCity}
                    />
                  )}
                />
              ) : (
                <CircularProgress />
              )}
              {(!bookingId && !isPickSameReturn) ||
              (bookingId && !isPickSameReturn && dropOffCity) ||
              (bookingId && !isPickSameReturn && bookingType === "delivery") ? (
                <Autocomplete
                  style={{ marginTop: "25px" }}
                  id="dropoff-location"
                  className="mb-2"
                  isRequired={!isPickSameReturn}
                  options={AreasRes?.areas?.filter((city) => +city?.id !== pickUpCity?.id) || []}
                  getOptionLabel={(option) => option?.[`${locale}Name`]}
                  value={dropOffCity}
                  disableClearable
                  onChange={(e, val) => {
                    setHandoverLat(val.centerLat);
                    setHandoverLng(val.centerLng);
                    setDropOffCity(val);
                  }}
                  loading={gettingAreas}
                  disabled={!customerId}
                  renderInput={(params) => (
                    <TextField
                      error={clicked && Boolean(!dropOffCity)}
                      {...params}
                      label={<FormattedMessage id="dropoff-location" />}
                      variant="outlined"
                      fullWidth
                      helperText={
                        !dropOffCity && !isPickSameReturn && clicked ? (
                          <FormattedMessage id="thisfieldisrequired" />
                        ) : null
                      }
                    />
                  )}
                />
              ) : null}
            </div>
            {pickUpCity ? (
              <>
                <div>
                  <div className="mb-3">
                    <h4 className="mb-3">
                      <FormattedMessage id="rental.rentalCar" />
                    </h4>
                    {allCompanies?.length && !ally_id ? (
                      <>
                        <h6 className="mt-1 mb-3">{formatMessage({ id: "selecting.company" })}</h6>
                        <Select
                          key={`${pickUpCity} ${dropOffCity}`}
                          options={allCompanies}
                          value={allCompanies?.find((val) => val.value == selectedCompany?.value)}
                          placeholder={formatMessage({ id: "selecting.company" })}
                          onChange={(selection) => {
                            clearBranchSelection();
                            setSelectedCompany(selection);
                            setBranchExtraServicesIds([]);
                            setSelectedCar(null);
                          }}
                          isLoading={!!loadingAllyCompanies}
                          className="dropdown-select"
                          styles={customStyles}
                        />
                      </>
                    ) : null}
                  </div>
                  {(!bookingId && selectedCompany?.value) ||
                  (bookingId && selectedCompany?.value && allBranches && rentalDetails) ? (
                    <div className="mt-2 mb-3">
                      <>
                        <h6 className="mt-1 mb-3">
                          {formatMessage({
                            id: isPickSameReturn ? "selecting.branch" : "select.Pickup branch",
                          })}
                        </h6>
                        <Select
                          key={`${selectedCompany} ${selectedBranch}`}
                          options={allBranches}
                          value={selectedBranch}
                          placeholder={formatMessage({
                            id: isPickSameReturn ? "selecting.branch" : "select.Pickup branch",
                          })}
                          onChange={(selection) => {
                            if (selection.canHandover) {
                              setHandOverChecked(true);
                            }
                            setSelectedBranch(selection);
                            setSelectedCar(null);
                          }}
                          className="dropdown-select"
                          styles={customStyles}
                        />
                      </>
                    </div>
                  ) : null}

                  {(!bookingId && selectedBranch) ||
                  (bookingId && selectedBranch && CarsRes && !gettingCars) ? (
                    <>
                      <h6 className="mt-1 mb-3">
                        {formatMessage({
                          id: "select.car",
                        })}
                      </h6>
                      <CustomSelect
                        key={`${selectedBranch}`}
                        options={avaiableCarsDD}
                        value={avaiableCarsDD?.find((val) => +val.value === +selectedCar?.id)}
                        placeholder="select.car"
                        nextPage={() => incPage()}
                        previousPage={() => decPage()}
                        pagination={CarsRes?.cars?.metadata}
                        isLoading={!!gettingCars}
                        onChange={(sel) => {
                          const selectedCar = availableCarsCollection?.find(
                            (car) => +car.id === +sel?.value,
                          );
                          setDistanceCarUser(+selectedCar.distanceBetweenCarUser);
                          setSelectedCar(selectedCar);
                          setSelectedDropoffBranch(null);
                          setChanged(true);
                          setInsuranceId(null);
                        }}
                      />
                    </>
                  ) : null}
                  {(!bookingId && selectedCar && !isPickSameReturn) ||
                  (bookingId && selectedCar && !isPickSameReturn) ? (
                    <div className="mt-3 mb-3">
                      <>
                        <h6 className="mt-1 mb-3">
                          {formatMessage({
                            id: "select.Dropoff branch",
                          })}
                        </h6>
                        <Select
                          key={`${selectedCompany} ${selectedBranch} ${selectedCar} ${selectedDropoffBranch}`}
                          options={getDropoffBranches()}
                          defaultValue={getDropoffBranches()?.find(
                            (val) =>
                              +val.value === +selectedDropoffBranch?.value ||
                              +val.value === +selectedDropoffBranch ||
                              +val.value === +rentalDetails?.rentalDetails?.dropOffBranchId,
                          )}
                          placeholder={formatMessage({
                            id: "select.Dropoff branch",
                          })}
                          onChange={(selection) => {
                            setChanged(true);
                            setSelectedDropoffBranch(selection);
                          }}
                          className="dropdown-select"
                          styles={customStyles}
                        />
                      </>
                    </div>
                  ) : null}
                  {!isPickSameReturn && selectedCompany && selectedBranch && selectedCar ? (
                    <>
                      <h6 className="mt-1 mb-3">
                        {formatMessage({
                          id: "handover_branch_price",
                        })}
                      </h6>
                      <CustomTextField
                        fullWidth
                        placeholder={formatMessage({
                          id: "handover_branch_price",
                        })}
                        noLabel
                        name="handover_branch_price"
                        value={handoverprice}
                        onInput={(e) => {
                          if (e.target.value.includes(".")) {
                            e.target.value = e.target.value.toString().slice(0, 9);
                          } else {
                            e.target.value = e.target.value.toString().slice(0, 6);
                          }
                        }}
                        onChange={(e) => {
                          setHandOverPrice(+e.target.value);
                          setChanged(true);
                        }}
                      />
                    </>
                  ) : null}

                  {(!bookingId &&
                    selectedBranch &&
                    extraServices?.allyExtraServicesForAlly?.length &&
                    selectedCar) ||
                  (!bookingId &&
                    selectedBranch &&
                    extraServices?.branchExtraServices?.length &&
                    selectedCar) ||
                  (bookingId && selectedBranch && selectedCar) ? (
                    <>
                      <h4 className="mt-4 mb-4">
                        <FormattedMessage id="rental.extraServices" />
                      </h4>
                      <div className="row mb-4">
                        {extraServices?.allyExtraServicesForAlly?.map((i) => (
                          <div key={i.id} className="d-flex col-3" onClick={() => setChanged(true)}>
                            <div className="">
                              <input
                                id={`ally-extra-${i.id}`}
                                style={{ cursor: "pointer" }}
                                type="checkbox"
                                defaultChecked={
                                  i.isRequired ||
                                  rentalDetails?.rentalDetails?.rentalExtraServices
                                    ?.filter((s) => s.extraServiceType === "ally_company")
                                    ?.find((item) => +item.extraServiceId === +i.id)
                                }
                                disabled={i.isRequired}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setAllyExtraServicesIds([...allyExtraServicesIds, i.id])
                                    : setAllyExtraServicesIds(
                                        allyExtraServicesIds.filter((item) => +item !== +i.id),
                                      )
                                }
                              />
                            </div>
                            <label htmlFor={`ally-extra-${i.id}`} style={{ cursor: "pointer" }}>
                              <h5 style={{ fontSize: "14px" }}>
                                {i.extraService[`${locale}Title`]}
                              </h5>
                              <h6 style={{ fontSize: "12px" }}>{i.subtitle}</h6>
                            </label>
                          </div>
                        ))}
                        {(!bookingId && selectedCar.isUnlimited) ||
                        (bookingId && rentalDetails?.rentalDetails && selectedCar.isUnlimited) ? (
                          <>
                            <input
                              type="checkbox"
                              checked={unLimited}
                              style={{ height: "19px" }}
                              id="Unlimited.KM"
                              onChange={(e) => setunLimited(e.target.checked)}
                            />
                            <label htmlFor="Unlimited.KM" style={{ cursor: "pointer", margin: 0 }}>
                              <h5 style={{ fontSize: "14px", margin: 0 }}>
                                <FormattedMessage id="Unlimited.KM" />
                              </h5>
                              <h6 style={{ fontSize: "12px" }}>
                                <FormattedMessage
                                  id="price.sr/day"
                                  values={{ price: selectedCar.unlimitedFeePerDay }}
                                />
                              </h6>
                            </label>
                          </>
                        ) : null}

                        {extraServices?.branchExtraServices?.map((i) => (
                          <div key={i.id} className="d-flex col-3" onClick={() => setChanged(true)}>
                            <div className="col-1 d-block">
                              <input
                                id={`branch-extra-${i.id}`}
                                style={{ cursor: "pointer", height: "19px" }}
                                type="checkbox"
                                defaultChecked={
                                  i.isRequired ||
                                  rentalDetails?.rentalDetails?.rentalExtraServices
                                    ?.filter((s) => s.extraServiceType === "branch")
                                    ?.find((item) => +item.extraServiceId === +i.id)
                                }
                                disabled={i.isRequired}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setBranchExtraServicesIds([...branchExtraServicesIds, i.id])
                                    : setBranchExtraServicesIds(
                                        branchExtraServicesIds.filter((item) => +item !== +i.id),
                                      )
                                }
                              />
                            </div>
                            <label htmlFor={`branch-extra-${i.id}`} style={{ cursor: "pointer" }}>
                              <h5 style={{ fontSize: "14px" }}>
                                {i.allyExtraService.extraService.arTitle}
                              </h5>
                              <h6 style={{ fontSize: "12px" }}>{i.subtitle}</h6>
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {selectedCompany &&
                  selectedBranch &&
                  selectedCar &&
                  bookingType === "delivery" &&
                  (!bookingId || (bookingId && deliveryPrice != null)) ? (
                    <div className="mt-2">
                      <CustomTextField fullWidth name="dsitance" value={distanceCarUser} disabled />
                      <CustomTextField
                        fullWidth
                        name="delivery_price"
                        onInput={(e) => {
                          if (e.target.value.includes(".")) {
                            e.target.value = e.target.value.toString().slice(0, 9);
                          } else {
                            e.target.value = e.target.value.toString().slice(0, 6);
                          }
                        }}
                        value={deliveryPrice}
                        onChange={(e) => setDeliveryPrice(+e.target.value)}
                      />
                    </div>
                  ) : null}

                  {bookingType === "delivery" &&
                  selectedCompany &&
                  selectedBranch &&
                  selectedCar &&
                  selectedBranch?.canHandover &&
                  distanceCarUser &&
                  handoverprice !== null &&
                  isPickSameReturn ? (
                    <>
                      <h4 className="mt-4 mb-4">
                        <Checkbox
                          checked={handoverChecked}
                          color="primary"
                          onChange={() => setHandOverChecked(!handoverChecked)}
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                        <FormattedMessage id="handover" />
                      </h4>

                      <>
                        {handoverChecked && (
                          <CustomTextField
                            fullWidth
                            name="handover_price"
                            value={handoverprice}
                            onInput={(e) => {
                              if (e.target.value.includes(".")) {
                                e.target.value = e.target.value.toString().slice(0, 9);
                              } else {
                                e.target.value = e.target.value.toString().slice(0, 6);
                              }
                            }}
                            onChange={(e) => setHandOverPrice(+e.target.value)}
                          />
                        )}
                      </>
                    </>
                  ) : null}
                  {selectedCar?.carInsurances?.length
                    ? (!bookingId ||
                        (bookingId && insuranceId) ||
                        (selectedCar?.carInsurances &&
                          rentalDetails?.rentalDetails.subStatus == "ally_declined")) && (
                        <Select
                          id="insurance"
                          className="mt-4"
                          options={selectedCar?.carInsurances?.map((i) => ({
                            label: i.insuranceName,
                            value: i.id,
                          }))}
                          disabled={!selectedCar || !Array.isArray(selectedCar?.carInsurances)}
                          value={selectedCar?.carInsurances
                            ?.map((i) => ({ label: i.insuranceName, value: i.id }))
                            ?.find((i) => i.value == insuranceId)}
                          onChange={(selection) => setInsuranceId(selection.value)}
                        />
                      )
                    : null}
                  {selectedCompany && selectedBranch && selectedCar ? (
                    <div className="alert alert-info mt-2 mb-2" role="alert">
                        <p>{`${selectedCar?.make?.[`${locale}Name`]} - ${
                          selectedCar?.carModel?.[`${locale}Name`]
                        } - ${
                          selectedCar?.carVersion?.[`${locale}Name`]
                            ? selectedCar?.carVersion?.[`${locale}Name`]
                            : "s"
                        } - ${selectedCar.year}`}</p>
                        <BookingPriceSummary
                          handoverChecked={handoverChecked}
                          BookingPrice={selectedCar ? BookingPriceRes : null}
                          calculatingPrice={calculatingPrice}
                          insurance={insuranceId}
                          BookingDetails={rentalDetails}
                          isUnlimited={selectedCar.isUnlimited}
                        />
                    </div>
                  ) : null}
                </div>

                {selectedCar && insuranceId && (
                  <>
                    <FormControlLabelContainer labelId="paymetMethod">
                      <RadioGroupContainer value={paymentMethod}>
                        {["cash", "online"].map((type) => (
                          <FormControlLabel
                            key={type}
                            disabled={!selectedCar?.id || (type == "online" && bookingId)}
                            value={type.toUpperCase()}
                            control={<Radio color="primary" />}
                            label={formatMessage({ id: type.toUpperCase() })}
                            className="m-0"
                            onChange={(e) => {
                              setChanged(true);
                              if (e.target.value == "ONLINE") {
                                setPaymentMethod("ONLINE");
                                return;
                              }
                              setPaymentMethod(e.target.value);
                            }}
                          />
                        ))}
                      </RadioGroupContainer>
                    </FormControlLabelContainer>
                    <CustomTextField
                      fullWidth
                      name="suggestedPricePerDay"
                      value={suggestedPricePerDay}
                      onChange={(e) => {
                        const price = e.target.value;
                        setChanged(true);
                        if (/^[0-9]+(\.)?[0-9]*$/.test(price.toString()) || price === "") {
                          setSuggestedPricePerDay(price);
                        } else {
                          setSuggestedPricePerDay(suggestedPricePerDay);
                        }
                      }}
                    />
                    {bookingId && (
                      <TextField
                        label={<FormattedMessage id="note" />}
                        multiline
                        style={{ marginBottom: "-50px" }}
                        rows={4}
                        value={note}
                        variant="outlined"
                        onChange={(e) => {
                          setChanged(true);
                          setNote(e.target.value);
                        }}
                      />
                    )}
                  </>
                )}
              </>
            ) : null}
            <div style={{ marginTop: "80px" }}>
              <button
                type="submit"
                style={{ width: "100%" }}
                className="btn btn-primary text-white btn-icon mt-2 mb-2"
                onClick={(e) => handleSubmitRent(e)}
              >
                <FormattedMessage id={bookingId ? "button.save" : "Rent"} />
              </button>
            </div>
          </div>
          <div className="col-md-5" style={{ height: "fit-content" }}>
            <CustomerDataDisplay customerDetailsRes={customerDetails || customerDetailsRes} 
            walletBalance={walletBalance}
            />
          </div>
        </div>
      )}
      {extensionModalOpen && (
        <ExtenstionRequests
          extensionModalOpen={extensionModalOpen}
          setIsExtensionModalOpen={setIsExtensionModalOpen}
          rentalDetails={rentalDetails?.rentalDetails}
          rentalDateExtensionRequests={rentalDetails?.rentalDetails?.rentalDateExtensionRequests}
          hasPendingExtensionRequests={rentalDetails?.rentalDetails?.hasPendingExtensionRequests}
          refetchBooking={refetchBooking}
        />
      )}
    </>
  );

  function carName(c) {
    return `${c.transmissionName} / ${c.make?.[`${locale}Name`]} - ${
      c?.carModel?.[`${locale}Name`]
    } - ${c?.carVersion?.[`${locale}Name`] ? c?.carVersion?.[`${locale}Name`] : ""} - ${
      c.year
    } | [${formatMessage({ id: "branchName" })}: ${c.branch[`${locale}Name`]}]
    [${formatMessage({ id: "daily" })}: ${c?.dailyPrice} ${formatMessage({
      id: "rental.weeklyPrice",
    })}: ${c?.weeklyPrice ? c?.weeklyPrice : ""} ${formatMessage({
      id: "rental.monthlyPrice",
    })}: ${c?.monthlyPrice}]`;
  }
}

export default AddEditBooking;
