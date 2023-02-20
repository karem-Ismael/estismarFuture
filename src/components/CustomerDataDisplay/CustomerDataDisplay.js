/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import { FormatDate } from "util/IntlMessages";
import moment from "moment";
import NO_PROFILE_IMAEG from "assets/avatars/profile.jpg";

export function CustomerDataDisplay({ customerDetailsRes, withimages = true,walletBalance }) {
  const [customerDetails, setCustomerDetails] = useState();
  const { locale } = useIntl();

  useEffect(() => {
    if (customerDetailsRes) {
      const customerInfo =
        customerDetailsRes?.user || customerDetailsRes?.users?.collection?.[0] || {};
      const {
        title,
        dob,
        driverLicense,
        driverLicenseStatus,
        firstName,
        gender,
        lastName,
        licenseFrontImage,
        mobile,
        nid,
        passportNumber,
        profileImage,

        email,
        companyName,
        middleName,
        customerProfile,
        licenseSelfieImage,
        status,
        isActive,
      } = customerInfo;
      const driverLicenseExpireAt =
        customerDetailsRes?.user?.customerProfile?.driverLicenseExpireAt ||
        customerDetailsRes?.users?.collection?.[0]?.customerProfile?.driverLicenseExpireAt;
      const nationalIdExpireAt =
        customerDetailsRes?.user?.customerProfile?.nationalIdExpireAt ||
        customerDetailsRes?.users?.collection?.[0]?.customerProfile?.nationalIdExpireAt;
      const nationalIdVersion =
        customerDetailsRes?.user?.customerProfile?.nationalIdVersion ||
        customerDetailsRes?.users?.collection?.[0]?.customerProfile?.nationalIdVersion;
      const nationality =
        customerDetailsRes?.user?.customerProfile?.nationality ||
        customerDetailsRes?.users?.collection?.[0]?.customerProfile?.nationality;
      const customerClassLocalized =
        customerDetailsRes?.user?.customerProfile?.customerClassLocalized ||
        customerDetailsRes?.users?.collection?.[0]?.customerProfile?.customerClassLocalized;

      let customerDetails = [
        { msgId: "rental.nameFirstName", value: firstName },
        { msgId: "rental.nameMiddleName", value: middleName },
        { msgId: "rental.nameLastName", value: lastName },
        { msgId: "email.address", value: email },
        { msgId: "rental.mobileNumber", value: mobile },
        { msgId: "rental.companyName", value: companyName },
        { msgId: "rental.userType", value: <FormattedMessage id={status || "-"} /> },

        {
          msgId: "status",
          value: isActive ? <FormattedMessage id="active" /> : <FormattedMessage id="inactive" />,
        },
        { msgId: "dob", value: dob },
        { msgId: "rental.driverSLicenseIfFound", value: driverLicense },
        { msgId: "rental.gender", value: <FormattedMessage id={gender || "-"} /> },
        { msgId: "driverLicenseExpireAt", value: driverLicenseExpireAt },
        { msgId: "customerClass", value: customerClassLocalized },
        { msgId: "Wallet balance", value: walletBalance?.userWallet?.balance },
      ];

      const citizenData = [
        { msgId: "rental.nationalId", value: nid },
        {
          msgId: "nationalIdVersion.label",
          value: customerProfile?.nationalIdVersion,
        },
        {
          msgId: "nationalIdExpireAt",
          value: customerProfile?.nationalIdExpireAt ? (
            <FormatDate value={customerProfile?.nationalIdExpireAt} />
          ) : (
            ""
          ),
        },
        { msgId: "rental.age", value: moment().diff(moment(dob), "years") },
       
      ];
      const residentData = [
        { msgId: "iqama.no", value: nid },
        { msgId: "nationality", value: nationality?.[`${locale}Name`] },

        { msgId: "nationalIdVersion.label", value: nationalIdVersion },
        { msgId: "iqamaIdExpireAt", value: nationalIdExpireAt },
      
      ];
      const GulfData = [
        { msgId: "Gulf_ID", value: nid },
        { msgId: "nationality", value: nationality?.[`${locale}Name`] },
        { msgId: "GulfIdExpireAt", value: nationalIdExpireAt },
      
      ];

      const visitorData = [
        { msgId: "rental.passportNumber", value: passportNumber },

        {
          msgId: "passportExpireAt",
          value: customerProfile?.passportExpireAt ? (
            <FormatDate value={customerProfile?.passportExpireAt} />
          ) : (
            ""
          ),
        },
        { msgId: "rental.age", value: dob ? moment().diff(moment(dob), "years") : "" },
        customerProfile?.nationality?.id && {
          msgId: "nationality",
          value: customerProfile.nationality[`${locale}Name`],
        },
      ];

      if (status === "citizen") {
        customerDetails = [...customerDetails, ...citizenData];
      }
      if (status === "visitor") {
        customerDetails = [...customerDetails, ...visitorData];
      }
      if (status === "resident") {
        customerDetails = [...customerDetails, ...residentData];
      }
      if (status === "gulf_citizen") {
        customerDetails = [...customerDetails, ...GulfData];
      }

      if (withimages) {
        customerDetails.unshift({
          image: profileImage || NO_PROFILE_IMAEG,
          imageDetails: {
            className: "img-responsive",
            containerClassName: "profile-userpic",
          },
        });

        if (licenseFrontImage) {
          customerDetails.push({
            id: "licenseFrontImage",
            image: licenseFrontImage,
            imageDetails: { className: "w-75" },
          });
        }
        if (licenseSelfieImage) {
          customerDetails.push({
            id: "licenseSelfieImage",
            image: licenseSelfieImage,
            imageDetails: { className: "w-75" },
          });
        }
        if (customerProfile?.passportFrontImage) {
          customerDetails.push({
            id: "passportFrontImage",
            image: customerProfile?.passportFrontImage,
            imageDetails: { className: "w-75" },
          });
        }
        if (customerProfile?.businessCard) {
          customerDetails.push({
            id: "businessCard",
            image: customerProfile.businessCard,
            imageDetails: { className: "w-75" },
          });
        }
      }
      setCustomerDetails(customerDetails);
    }
  }, [customerDetailsRes,walletBalance]);

  return <InfoCard fullwidth data={customerDetails} titleId="rental.customer.details" />;
}
