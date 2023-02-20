/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, memo } from "react";
import MapForBranch from "components/Map/MapForBranch";
import MapForBooking from "components/Map/MapForBooking";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import "./style.css";
import AutoComplete from "./AutoComplete";
function MapWithSearch({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  setDeliverAddress,
  setDistrictNameAr,
  setDistrictNameEn,
  centerlat,
  centerlng,
  getAddress,
  isBranch,
  isBooking,
  mapChange,
  setMapChange,
}) {
  const { locale, messages } = useIntl();
  const [getSearchPlace, setGetSearchPlace] = useState();
  const [remount, setremount] = useState(true);
  useEffect(() => {
    setremount(false);
    setTimeout(() => {
      setremount(true);
    }, 1000);
  }, [locale]);
  useEffect(() => {
    if (centerlng && centerlat) {
      setLatitude(centerlat);
      setLongitude(centerlng);
      // setDistrictNameEn("karem")
    }
  }, [centerlng, centerlat]);
  return (
    remount && (
      <>
        <div className="map">
          <AutoComplete setGetSearchPlace={setGetSearchPlace} messages={messages} locale={locale} />
          {isBranch ? (
            <MapForBranch
              setDeliverAddress={setDeliverAddress}
              getAddress={getAddress}
              setDistrictNameAr={setDistrictNameAr}
              setDistrictNameEn={setDistrictNameEn}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              getSearchPlace={getSearchPlace}
              locale={locale}
              latitude={latitude}
              longitude={longitude}
              centerlat={centerlat}
              centerlng={centerlng}
            />
          ) : isBooking ? (
            <MapForBooking
              setDeliverAddress={setDeliverAddress}
              getAddress={getAddress}
              setDistrictNameAr={setDistrictNameAr}
              setDistrictNameEn={setDistrictNameEn}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              getSearchPlace={getSearchPlace}
              locale={locale}
              latitude={latitude}
              longitude={longitude}
              centerlat={centerlat}
              centerlng={centerlng}
              mapChange={mapChange}
              setMapChange={setMapChange}
            />
          ) : (
            <MapForBranch
              // setDeliverAddress={setDeliverAddress}
              getAddress={getAddress}
              setDistrictNameAr={setDistrictNameAr}
              setDistrictNameEn={setDistrictNameEn}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              getSearchPlace={getSearchPlace}
              locale={locale}
              latitude={latitude}
              longitude={longitude}
              centerlat={centerlat}
              centerlng={centerlng}
            />
          )}
        </div>
      </>
    )
  );
}

MapWithSearch.propTypes = {
  setLatitude: PropTypes.func,
  setDeliverAddress: PropTypes.func,
  setDistrictNameAr: PropTypes.func,
  setDistrictNameEn: PropTypes.func,
  setLongitude: PropTypes.func,
  latitude: PropTypes.string,
  longitude: PropTypes.string,
};

export default memo(MapWithSearch);
