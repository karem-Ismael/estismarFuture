/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import InfoCard from "components/shared/InfoCard";
import NO_PROFILE_IMAEG from "assets/avatars/profile.jpg";

export function UserDataDisplay({ userDetails, withimages = true }) {
  const [userData, setUserData] = useState();

  useEffect(() => {
    if (userDetails) {
      const userInfo = userDetails?.user || userDetails?.users?.collection?.[0] || {};
      const {
        firstName,
        lastName,
        mobile,
        profileImage,
        email,
        customerProfile,
        licenseSelfieImage,
        isActive,
      } = userInfo;

      const userData = [
        { msgId: "rental.nameFirstName", value: firstName },
        { msgId: "rental.nameLastName", value: lastName },
        { msgId: "email.address", value: email },
        { msgId: "rental.mobileNumber", value: mobile },
        {
          msgId: "status",
          value: <FormattedMessage id={isActive ? "active" : "inactive"} />,
        },
      ];

      if (withimages) {
        userData.unshift({
          image: profileImage || NO_PROFILE_IMAEG,
          imageDetails: {
            className: "img-responsive",
            containerClassName: "profile-userpic",
          },
        });

        if (licenseSelfieImage) {
          userData.push({
            id: "licenseSelfieImage",
            image: licenseSelfieImage,
            imageDetails: { className: "w-75" },
          });
        }
        if (customerProfile?.passportFrontImage) {
          userData.push({
            id: "passportFrontImage",
            image: customerProfile?.passportFrontImage,
            imageDetails: { className: "w-75" },
          });
        }
        if (customerProfile?.businessCard) {
          userData.push({
            id: "businessCard",
            image: customerProfile.businessCard,
            imageDetails: { className: "w-75" },
          });
        }
      }
      setUserData(userData);
    }
  }, [userDetails]);

  return (
    <div>
      <InfoCard fullwidth data={userData} titleId="user.details" />
    </div>
  );
}
