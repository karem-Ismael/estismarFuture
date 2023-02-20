import React, { useState, useEffect } from "react";
import IntlTelInput from "react-intl-tel-input";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { useQuery } from "@apollo/client";
import { GetUsers } from "gql/queries/Users.queries.gql";
import { NotificationManager } from "react-notifications";
import { DangerFormattedMessage } from "components/Danger/Danger";

function GettingCustomerDetails({
  setCustomerDetails,
  customerId,
  setCustomerCanBook,
  setCustomerId,
}) {
  const [customerNumber, setCustomerNumber] = useState("");
  const [isCustomerProfileCompleted, setIsCustomerProfileCompleted] = useState(true);
  const [fullNumber, setFullNumber] = useState("");
  const [isNumberValid, setIsNumberValid] = useState(true);
  const [requestCustomerDetails, setRequestCustomerDetails] = useState(false);

  const { data: customerDetailsRes, loading } = useQuery(GetUsers, {
    skip: !requestCustomerDetails,
    variables: { mobile: fullNumber, type: "customers" },
  });

  useEffect(() => setRequestCustomerDetails(false), [customerNumber]);

  useEffect(() => {
    if (customerDetailsRes) {
      const details = customerDetailsRes?.users?.collection?.[0] || null;
      if (details) {
        setCustomerId(customerDetailsRes?.users?.collection?.[0]?.id);
        setIsCustomerProfileCompleted(details?.isCustomerProfileCompleted);
        if (setCustomerCanBook) {
          setCustomerCanBook(details?.isCustomerProfileCompleted);
        }
        // TODO: Add message if user can't book because of age
        if (!details?.isCustomerProfileCompleted) {
          NotificationManager.info(<FormattedMessage id="usersProfileIsNotComplete" />);
        }
        setCustomerDetails(customerDetailsRes);
      }
    }
  }, [customerDetailsRes]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="container">
        <div className="row" style={{ justifyContent: "center" }}>
          <div className="col-sm-12 col-md-3 mt-2" dir="ltr">
            <IntlTelInput
              separateDialCode
              preferredCountries={["sa"]}
              disabled={!!customerId}
              telInputProps={{ pattern: "[0-9]*" }}
              containerClassName="intl-tel-input"
              inputClassName="form-control"
              value={customerNumber}
              onPhoneNumberChange={(isValid, num, _, fullNum) => {
                if (/^[0-9]+$/.test(num.toString()) || num === "") {
                  setCustomerNumber(num);
                  setFullNumber(fullNum.replace(/\D/gm, ""));
                  setIsNumberValid(isValid);
                } else {
                  setCustomerNumber(customerNumber);
                }
              }}
            />
          </div>
          <div className="col-sm-12 col-md-3 mt-2">
            <button
              type="submit"
              variant="contained"
              disabled={!isNumberValid}
              style={{ width: "100%" }}
              className="btn btn-primary text-white btn-icon"
              onClick={() => setRequestCustomerDetails(true)}
            >
              <FormattedMessage id="customer.data" />
            </button>
          </div>
        </div>
        {customerDetailsRes?.users?.collection?.length === 0 && (
          <DangerFormattedMessage msgId="thisUserIsNotRegisteredYet" />
        )}
        {!isCustomerProfileCompleted && customerDetailsRes?.users?.collection?.[0] && (
          <DangerFormattedMessage msgId="usersProfileIsNotComplete" />
        )}
      </div>
    </form>
  );
}

GettingCustomerDetails.propTypes = {
  setCustomerDetails: PropTypes.func,
  setCustomerCanBook: PropTypes.func,
  setCustomerId: PropTypes.func,
  customerId: PropTypes.string,
};

export default GettingCustomerDetails;
