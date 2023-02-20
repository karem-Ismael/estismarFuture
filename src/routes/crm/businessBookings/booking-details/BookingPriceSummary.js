/* eslint-disable prettier/prettier */
import React from "react";
import PropTypes from "prop-types";
import { ListItem, CircularProgress } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

function BookingPriceSummary({ BookingPrice, calculatingPrice, insurance, handoverChecked }) {
  const aboutPrice = BookingPrice?.aboutRentPrice || {};
  const {
    addsPrice,
    deliveryPrice,
    discountPercentage,
    discountType,
    discountValue,
    insuranceIncluded,
    insuranceValue,
    numberOfDays,
    priceBeforeDiscount,
    priceBeforeInsurance,
    pricePerDay,
    taxValue,
    totalPrice,
    valueAddedTaxPercentage,
    priceBeforeTax,
    handoverPrice,
    allyExtraServices,
    branchExtraServices,
  } = aboutPrice;
  const totalBeforeInsurance = [
    {
      msg: <FormattedMessage id="aboutPrice.PricePerDay" />,
      value: <FormattedMessage id="price.sr" values={{ price: pricePerDay }} />,
    },
    {
      msg: <FormattedMessage id="aboutPrice.totalDays" values={{ days: `${numberOfDays}` }} />,
      value: <FormattedMessage id="price.sr" values={{ price: priceBeforeInsurance }} />,
    },
    discountValue
      ? {
          msg: (
            <FormattedMessage
              id="aboutPrice.discount"
              values={{
                discount: `${discountType}`,
                percentage: `${discountPercentage}`,
              }}
            />
          ),
          value: <FormattedMessage id="price.sr" values={{ price: discountValue }} />,
        }
      : null,
    {
      msg: "",
      value: <FormattedMessage id="price.sr" values={{ price: priceBeforeDiscount }} />,
    },
  ];

  const extras = [
    insuranceIncluded
      ? {
          msg: (
            <FormattedMessage
              id="aboutPrice.insurance"
              values={{ insurance: insurance.insuranceName }}
            />
          ),
          value: <FormattedMessage id="price.sr" values={{ price: insuranceValue }} />,
        }
      : null,
    deliveryPrice
      ? {
          msg: <FormattedMessage id="aboutPrice.deliveryCost" />,
          value: <FormattedMessage id="price.sr" values={{ price: deliveryPrice }} />,
        }
      : null,
    (handoverPrice != 0 || handoverPrice != null) && handoverChecked
      ? {
          msg: <FormattedMessage id="handoverprice" />,
          value: <FormattedMessage id="price.sr" values={{ price: handoverPrice }} />,
        }
      : null,
    branchExtraServices?.length
      ? {
          msg: <FormattedMessage id="extraservice" />,
          value: branchExtraServices.map((extraservice) => (
            <FormattedMessage id="price.sr" values={{ price: extraservice.totalServiceValue }} />
          )),
        }
      : null,
    {
      msg: "",
      value: <FormattedMessage id="price.sr" values={{ price: addsPrice }} />,
    },
  ];

  const vatAndTotal = [
    valueAddedTaxPercentage
      ? {
          msg: <FormattedMessage id="aboutPrice.total" values={{ vat: valueAddedTaxPercentage }} />,
          value: <FormattedMessage id="price.sr" values={{ price: priceBeforeTax }} />,
        }
      : null,
    valueAddedTaxPercentage
      ? {
          msg: <FormattedMessage id="aboutPrice.vat" values={{ vat: valueAddedTaxPercentage }} />,
          value: <FormattedMessage id="price.sr" values={{ price: taxValue }} />,
        }
      : null,
    {
      msg: (
        <>
          <FormattedMessage id="aboutPrice.grandTotal" /> <FormattedMessage id="aboutPrice.+vat" />
        </>
      ),
      value: <FormattedMessage id="price.sr" values={{ price: totalPrice }} />,
    },
  ];

  function DataDisplay(i, row) {
    return (
      <ListItem
        key={JSON.stringify(i)}
        data-testid={`data-info-${i}`}
        className="d-flex justify-content-between align-items-center p-20"
      >
        <span>{row.msg}</span>
        <span>{row.value}</span>
      </ListItem>
    );
  }

  return (
    (BookingPrice || calculatingPrice) && (
      <>
        {calculatingPrice && (
          <CircularProgress variant="determinate" size={40} thickness={4} value={100} />
        )}
        <h3>
          <FormattedMessage id="aboutPrice" />
        </h3>
        <div className="alert alert-secondary">
          <h5>
            <FormattedMessage id="aboutPrice.Basic" />
          </h5>
          {totalBeforeInsurance.map((row, i) => row !== null && DataDisplay(i, row))}
          {addsPrice > 0 && (
            <>
              <h5>
                <FormattedMessage id="aboutPrice.extraServices" />
              </h5>
              {extras.map((row, i) => row !== null && DataDisplay(i, row))}
            </>
          )}
          <h5>
            <FormattedMessage id="aboutPrice.total" />
          </h5>
          {vatAndTotal.map((row, i) => row !== null && DataDisplay(i, row))}
        </div>
      </>
    )
  );
}

BookingPriceSummary.propTypes = {
  BookingPrice: PropTypes.object,
  insurance: PropTypes.object,
  calculatingPrice: PropTypes.bool,
  allyExtraServices: PropTypes.array,
  branchExtraServices: PropTypes.array,
};

export default BookingPriceSummary;
