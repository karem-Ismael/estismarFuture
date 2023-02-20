import React from "react";
import { useQuery } from "@apollo/client";

import { Profile } from "gql/queries/AdminProfile.gql";
export default function UserProfile() {
  const { data: userInfo } = useQuery(Profile);
  return (
    <p className="m-0" style={{ textAlign: "center" }}>
      {userInfo?.profile?.name}
    </p>
  );
}
