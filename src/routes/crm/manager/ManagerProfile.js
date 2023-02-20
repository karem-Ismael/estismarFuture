import React, { useEffect } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { AllyManager } from "gql/queries/GetManager.gql";
import { AllyManagerProfile } from "gql/queries/GetAllyManagerProfile.gql";

import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { Branches } from "gql/queries/AllBranches.gql";
import { persist } from "constants/constants";

import { ManagerDisplayData } from "./ManagerDisplayData";
import { useIntl } from "react-intl";

/**
 * @name ManagerProfile
 * @export
 * @return {JSX}
 */
export default function ManagerProfile() {
  const location = useLocation();
  const { managerId } = useParams();
  const { formatMessage, locale } = useIntl();
  // const { data: modelprofile, refetch } = useQuery(CarModel, {
  //   variables: { id: +modelId },
  // });
  const { data: allyManager, refetch } = useQuery(AllyManagerProfile, {
    skip: !managerId,
    variables: { allyProfileId: +managerId},
  });
  const { data: allbranches, loading: gettingModels } = useQuery(Branches, {
    skip: !allyManager?.allyManagerProfile?.allyId,
    variables: {
      limit: persist.higherUnlimited,
      allyCompanyId: allyManager?.allyManagerProfile?.allyId,
    },
  });
  useEffect(() => {
    refetch();
  }, [locale]);
  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "manager.details" })}</title>
        <meta name="description" content="Carwah Model Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="manager.details" />}
        enableBreadCrumb
        match={location}
        lastElement={managerId || <DotsLoader />}
      />
      <div className="row">
        {allyManager && allbranches && (
          <>
            <div className="w-50">
              <ManagerDisplayData
                allyManager={allyManager}
                allbranches={allbranches}
                withimages={false}
              />
            </div>
            {allyManager?.allyManager?.profileImage?.length ||
            allyManager?.allyManager?.allyProfile?.idPhoto?.length ? (
              <div className="w-50">
                {allyManager?.allyManager?.profileImage?.length ? (
                  <>
                    <p>{formatMessage({ id: "profileImage" })}</p>

                    <img src={allyManager?.allyManager.profileImage} />
                  </>
                ) : null}
                {allyManager?.allyManager?.allyProfile?.idPhoto?.length ? (
                  <>
                    <p>{formatMessage({ id: "idPhoto" })}</p>

                    <img src={allyManager?.allyManager?.allyProfile?.idPhoto} />
                  </>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
