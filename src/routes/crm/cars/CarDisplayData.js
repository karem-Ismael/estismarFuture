/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import { FormatDate } from "util/IntlMessages";
import moment from "moment";
import NO_PROFILE_IMAEG from "assets/avatars/profile.jpg";
import { useHistory, useParams } from "react-router-dom";

export function CarDisplayData({ carprofile, withimages = true }) {
  const [carDetails, setCarDetails] = useState();
  const { locale, formatMessage } = useIntl();
  const history = useHistory();

  useEffect(() => {
    if (carprofile) {
      const carInfo = carprofile?.carProfile;

      const {
        availabilityStatus,
        bookingStatus,
        transmissionName,
        allyName,
        dailyPrice,
        color,
        accidentPenalty,
        year,
        carVersion,
        additionalDistanceCost,
        guaranteeAmount,
        weeklyPrice,
        monthlyPrice,
        CarFeature,
        monthsPrice,
        carModel,
        branch: { name, address },
      } = carInfo;
      const {
        make: { logo, arName, enName },
      } = carInfo;
      const carprofileDetails = [
        {
          msgId: "car.availabilityStatus",
          value: availabilityStatus ? (
            <FormattedMessage id="active" />
          ) : (
            <FormattedMessage id="inactive" />
          ),
        },
        {
          msgId: "car.bookingstatus",
          value: bookingStatus ? (
            <FormattedMessage id="active" />
          ) : (
            <FormattedMessage id="inactive" />
          ),
        },
        { msgId: "car.dailyprice", value: dailyPrice },
        { msgId: "car.color", value: color },
        { msgId: "accidentPenalty", value: accidentPenalty },
        { msgId: "car.transmissionname", value: transmissionName },
        { msgId: "car.insurancetype", value: carInfo.carInsurances[0]?.insuranceName },
        { msgId: "Insurance.value", value: carInfo.carInsurances[0]?.value },

        carInfo.carInsurances[0]?.insuranceId == "2"
          ? { msgId: "Insurance.cost.month", value: carInfo.carInsurances[0]?.monthlyValue }
          : null,
        ,
        carInfo.carInsurances[1]?.insuranceName && {
          msgId: "car.insurancetype",
          value: carInfo.carInsurances[1]?.insuranceName,
        },
        carInfo.carInsurances[1]?.insuranceName && {
          msgId: "Insurance.value",
          value: carInfo.carInsurances[0]?.value,
        },

        carInfo.carInsurances[1] && carInfo.carInsurances[1]?.insuranceId == "2"
          ? { msgId: "Insurance.cost.month", value: carInfo.carInsurances[0]?.monthlyValue }
          : null,

        { msgId: "car.year", value: year },

        { msgId: "car.make", value: carInfo.make[`${locale}Name`] },
        { msgId: "car.version", value: carVersion[`${locale}Name`] },
        { msgId: "car.model", value: carModel[`${locale}Name`] },
        { msgId: "allyname", value: allyName },

        { msgId: "car.branch.name", value: name },
        { msgId: "rent.week", value: weeklyPrice },
        { msgId: "rent.month", value: monthlyPrice },
        monthsPrice?.twoMonths ? { msgId: "two.month.rent", value: monthsPrice?.twoMonths } : null,
        monthsPrice?.threeMonths
          ? { msgId: "three.month.rent", value: monthsPrice?.threeMonths }
          : null,
        monthsPrice?.fourMonths
          ? { msgId: "four.month.rent", value: monthsPrice?.fourMonths }
          : null,
        monthsPrice?.fiveMonths
          ? { msgId: "five.month.rent", value: monthsPrice?.fiveMonths }
          : null,
        monthsPrice?.sixMonths ? { msgId: "six.month.rent", value: monthsPrice?.sixMonths } : null,
        monthsPrice?.sevenMonths
          ? { msgId: "seven.month.rent", value: monthsPrice?.sevenMonths }
          : null,
        monthsPrice?.eightMonths
          ? { msgId: "eight.month.rent", value: monthsPrice?.eightMonths }
          : null,
        monthsPrice?.nineMonths
          ? { msgId: "nine.month.rent", value: monthsPrice?.nineMonths }
          : null,
        monthsPrice?.tenMonths ? { msgId: "ten.month.rent", value: monthsPrice?.tenMonths } : null,
        monthsPrice?.elevenMonths
          ? { msgId: "eleven.month.rent", value: monthsPrice?.elevenMonths }
          : null,
        monthsPrice?.twelveMonths
          ? { msgId: "twelve.month.rent", value: monthsPrice?.twelveMonths }
          : null,
        monthsPrice?.twentyFourMonths
          ? {
              msgId: "twentyfour.month.rent",
              value: monthsPrice?.twentyFourMonths,
            }
          : null,

        { msgId: "car.guaranteeAmount", value: guaranteeAmount },
        { msgId: "car.additionalDistanceCost", value: additionalDistanceCost },
      ];

      if (withimages) {
        carprofileDetails.unshift({
          image: logo,
          imageDetails: {
            className: "img-responsive",
            containerClassName: "profile-userpic",
          },
        });
      }
      setCarDetails(carprofileDetails);
    }
  }, [carprofile, locale]);
  return (
    <>
      <InfoCard
        fullwidth
        data={carDetails}
        titleId="car.details"
        features={carprofile?.carProfile.features}
      />
      <div className="d-flex flex-row-reverse">
        <div className="col-md-2 mt-2">
          <button
            onClick={() => history.push("/cw/dashboard/cars")}
            type="button"
            className="btn btn-danger text-white text-center"
          >
            {formatMessage({ id: "button.back" })}
          </button>
        </div>
      </div>
    </>
  );
}
