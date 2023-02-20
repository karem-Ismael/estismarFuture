/* eslint-disable prettier/prettier */
import React from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { GetCustomerDetailsQuery } from "gql/queries/Users.queries.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { CustomerDataDisplay } from "components/CustomerDataDisplay";
import { FormattedMessage, useIntl } from "react-intl";
import NO_PROFILE_IMAEG from "assets/avatars/profile.jpg";
import { UserWallet } from "gql/queries/CustomerWalletBalance.gql";

/**
 * @name CustomerDataDisplayComponent
 * @export
 * @return {JSX}
 */
export default function CustomerDataDisplayComponent() {
  const location = useLocation();
  const history = useHistory();
  const { customerId } = useParams();
  const { formatMessage, messages } = useIntl();
  const { data: customerDetailsRes } = useQuery(GetCustomerDetailsQuery, {
    variables: { id: +customerId },
  });
  const { data: walletBalance } = useQuery(UserWallet, {
    skip: !customerId,
    variables: { userId: +customerId },
  });
  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>Customer Details</title>
        <meta name="description" content="Carwah Booking Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="rental.customer.details" />}
        enableBreadCrumb
        match={location}
        lastElement={customerDetailsRes?.user?.name || <DotsLoader />}
      />
      <div className="row">
        <div className="w-50">
          <CustomerDataDisplay customerDetailsRes={customerDetailsRes} withimages={false}
          walletBalance={walletBalance}
          />
        </div>
        <div className="w-50 m-auto" style={{ padding: "0 30px" }}>
          <>
            <p>{formatMessage({ id: "profileImage" })}</p>
            <img
              style={{
                verticalAlign: "middle",
                borderRadius: "50%",
              }}
              className="w-75 mb-4 avatar"
              src={customerDetailsRes?.user?.profileImage || NO_PROFILE_IMAEG}
              alt={formatMessage({ id: "profileImage" })}
            />
          </>
          {["licenseFrontImage", "licenseSelfieImage"].map(
            (image) =>
              customerDetailsRes?.user?.[image] && (
                <>
                  <p>{formatMessage({ id: image })}</p>
                  <img
                    className="w-75 mb-4"
                    src={customerDetailsRes?.user?.[image]}
                    alt={formatMessage({ id: image })}
                  />
                </>
              ),
          )}
          {customerDetailsRes?.user?.customerProfile?.businessCard && (
            <>
              <p>{formatMessage({ id: "businessCard" })}</p>
              <img
                className="w-75 mb-4"
                src={customerDetailsRes?.user?.customerProfile?.businessCard}
                alt={formatMessage({ id: "businessCard" })}
              />
            </>
          )}
          {customerDetailsRes?.user?.customerProfile?.passportFrontImage && (
            <>
              <p>{formatMessage({ id: "passportFrontImage" })}</p>
              <img
                className="w-75 mb-4"
                src={customerDetailsRes?.user?.customerProfile?.passportFrontImage}
                alt={formatMessage({ id: "passportFrontImage" })}
              />
            </>
          )}
        </div>
      </div>
      {/* EDIT BUTTON */}
      {customerDetailsRes?.user?.id && (
        <div className="d-flex flex-row-reverse m-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push(`/cw/dashboard/customers/${customerDetailsRes?.user?.id}/edit`)
            }
          >
            <FormattedMessage
              id="common.editSomething"
              values={{ something: messages["bookings.list.customerName"] }}
            />
          </button>
        </div>
      )}
    </div>
  );
}
