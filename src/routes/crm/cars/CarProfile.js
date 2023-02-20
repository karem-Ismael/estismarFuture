import React, { useEffect, useState } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import IntlMessages from "util/IntlMessages";
import PageTitleBar from "components/PageTitleBar/PageTitleBar";
import { CarProfile } from "gql/queries/getCarProfile.gql";
import { useQuery } from "@apollo/client";
import DotsLoader from "components/shared/DotsLoader";
import { CarDisplayData } from "./CarDisplayData";
import { useIntl } from "react-intl";
// import "photoswipe/dist/photoswipe.css";
// import "photoswipe/dist/default-skin/default-skin.css";

import { Gallery, Item } from "react-photoswipe-gallery";
/**
 * @name DisplayCarProfile
 * @export
 * @return {JSX}
 */
export default function DisplayCarProfile() {
  const location = useLocation();

  const { carId } = useParams();
  const { formatMessage, locale } = useIntl();
  const { data: carprofile, refetch } = useQuery(CarProfile, {
    variables: { id: +carId },
  });
  const MyGallery = () => (
    <Gallery style={{ wigth: "100%" }}>
      <div className="row justify-content-space-between">
        {carprofile?.carProfile.carImages.map((img) => {
          return (
            <Item original={img} width="300" height="300">
              {({ ref, open }) => (
                <div className="col-lg-4 col-md-12  ">
                  <img
                    ref={ref}
                    onClick={open}
                    src={img}
                    width="300"
                    className="shadow-lg cursor-pointer  p-5 mb-5 bg-white rounded "
                  />
                </div>
              )}
            </Item>
          );
        })}
      </div>
    </Gallery>
  );

  useEffect(() => {
    refetch();
  }, [locale]);
  return (
    <div className="ecom-dashboard-wrapper">
      <Helmet>
        <title>{formatMessage({ id: "car.details" })}</title>
        <meta name="description" content="Carwah Car Details" />
      </Helmet>
      <PageTitleBar
        title={<IntlMessages id="car.details" />}
        enableBreadCrumb
        match={location}
        lastElement={carId || <DotsLoader />}
      />
      <div className="row">
        <div className={carprofile?.carProfile.carImages ? "w-60" : "w-50"}>
          <CarDisplayData carprofile={carprofile} withimages={false} />
        </div>
        {carprofile?.carProfile.carImages.length ? (
          <div className={(carprofile?.carProfile.carImages, length ? "w-100" : "w-50")}>
            <>
              <p>{formatMessage({ id: "carImage" })}</p>
              {carprofile?.carProfile.carImages ? (
                MyGallery()
              ) : (
                <img
                  style={{
                    verticalAlign: "middle",
                    borderRadius: "50%",
                  }}
                  className="w-75 mb-4 avatar"
                  src={carprofile?.carProfile.make.logo}
                  alt={formatMessage({ id: "carImage" })}
                />
              )}
            </>
          </div>
        ) : null}
      </div>
    </div>
  );
}
