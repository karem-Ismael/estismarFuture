/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import Geocode from "react-geocode";
import { Map, InfoWindow, GoogleApiWrapper, Marker } from "google-maps-react";
import PropTypes from "prop-types";
import "./style.css";
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function MapContainer(props) {
  const { messages, locale } = useIntl();
  Geocode.setApiKey(process.env.REACT_APP_MAP_API);
  Geocode.setLanguage(locale);

  const [showingInfoWindow, setShowingInfoWindow] = useState(true);
  const [activeMarker, setActiveMarker] = useState();
  const [selectedPlace, setSelectedPlace] = useState({});
  const [address, setAddress] = useState("");
  const [userSelectionPosition, setUserSelectionPosition] = useState();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [editLocationSet, seteditLocationSet] = useState(false);
  const initLat = props.latitude || 24.73265591475684;
  const initLng = props.longitude || 46.69235839843748;

  const onMapClicked = (map, maps, e) => {
    setShowingInfoWindow(true);
    setSelectedLocation(false);
    setSelectedLocation(null);
    const { latLng } = e;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    getGeocode(latitude, longitude);
    setActiveMarker(null);
    setSelectedPlace({});
  };

  useEffect(() => {
    if (props.getSearchPlace) {
      const lat = props?.getSearchPlace?.geometry?.location?.lat();
      const lng = props?.getSearchPlace?.geometry?.location?.lng();
      setSelectedPlace({});
      setShowingInfoWindow(false);
      getGeocode(lat, lng);
      setShowingInfoWindow(true);
    }
  }, [props.getSearchPlace]);

  useEffect(() => {
    if (!props.longitude && !props.latitude) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getGeocode(position.coords.latitude, position.coords.longitude);
          setActiveMarker(null);
          setSelectedPlace({});
        },
        (error) => {
          if (error.code === 1) {
            getGeocode(initLat, initLng);
            setActiveMarker(null);
            setSelectedPlace({});
          }
          if (error.code === 2) {
            // props.setErrorMessage(true);
          }
        },
        options,
      );
    }
  }, []);
  useEffect(() => {
    if ((props.centerlat, props.centerlng)) {
      getGeocode(props.centerlat, props.centerlng);
      seteditLocationSet(true);
    }
  }, [props.centerlat, props.centerlng]);

  useEffect(() => {
    if (props.latitude && props.longitude && !editLocationSet) {
      getGeocode(props.latitude, props.longitude);
      seteditLocationSet(true);
    }
  }, [props.latitude, props.longitude]);

  function getGeocode(newLat, newLng) {
    Geocode.fromLatLng(newLat, newLng)
      .then((response) => {
        if (locale == "ar" && props?.setDistrictNameAr) {
          props?.setDistrictNameAr?.(response.results[0].address_components?.[2]?.long_name);
          props.setDistrictNameEn?.(response.results[0].address_components?.[2]?.long_name);
          Geocode.setLanguage("en");
 Geocode.fromLatLng(newLat, newLng).then((response) => {
   props?.setDistrictNameEn?.(response.results[0].address_components?.[2]?.long_name);
   props.setLatitude(newLat);
   props.setLongitude(newLng);
});
        } else if (props?.setDistrictNameEn) {
          props.setDistrictNameEn?.(response.results[0].address_components?.[2]?.long_name);
           Geocode.setLanguage("ar");
  Geocode.fromLatLng(newLat, newLng).then((response) => {
    props?.setDistrictNameAr?.(response.results[0].address_components?.[2]?.long_name);
});
props.setLatitude(newLat);
props.setLongitude(newLng);
        }
        setAddress(response.results[0].address_components?.[2]?.long_name);
        setUserSelectionPosition({ lat: newLat, lng: newLng });
        props.setDeliverAddress(response.results[0].address_components?.[2]?.long_name);

        props.setLatitude(newLat);
        props.setLongitude(newLng);
      })
      .then(() => {
        if (locale == "en") {
          Geocode.setLanguage("ar");
          Geocode.fromLatLng(newLat, newLng).then((response) => {
              props?.setDistrictNameAr?.(response.results[0].address_components?.[2]?.long_name);
          });
        } else {
          

          Geocode.setLanguage("en");
          Geocode.fromLatLng(newLat, newLng).then((response) => {
             props?.setDistrictNameEn?.(response.results[0].address_components?.[2]?.long_name);
          });
        }
        Geocode.setLanguage(locale);
      })
      .catch((err) => console.error("err", err));
  }
  const { google, mapPosition } = props;
  const style = {
    width: "100%",
    height: "100%",
  };

  // const infoWindow = selectedLocation ? (
  //   <InfoWindow
  //     position={{
  //       lat: selectedLocation.location.lat + 0.3,
  //       lng: selectedLocation.location.long,
  //     }}
  //     marker={true}
  //     visible={selectedLocation}
  //   >
  //     <div className="infoWindow">
  //       <h3 className="info-title">{selectedLocation.name}</h3>
  //       <p className="info-address">
  //         <i className="material-icons">{messages["map.location"]}</i>
  //         {selectedLocation.location.address}
  //       </p>
  //     </div>
  //   </InfoWindow>
  // ) : (
  //   <InfoWindow
  //     position={{
  //       lat: userSelectionPosition && userSelectionPosition,
  //       lng: userSelectionPosition && userSelectionPosition,
  //     }}
  //     marker={activeMarker}
  //     visible={showingInfoWindow}
  //   >
  //     <div className="infoWindow" >
  //       <p className="info-address">
  //         <i className="material-icons">{messages["map.location"]}</i>
  //         {selectedPlace.address || address}
  //       </p>
  //     </div>
  //   </InfoWindow>
  // );

  return (
    <Map
      google={google}
      initialCenter={{
        lat: userSelectionPosition || initLat,
        lng: userSelectionPosition || initLng,
      }}
      center={userSelectionPosition}
      style={style}
      zoom={7}
      onClick={onMapClicked}
    >
      <Marker
        onClick={onMapClicked}
        position={{
          lat: userSelectionPosition || initLat,
          lng: userSelectionPosition || initLng,
        }}
        style={{ zUndex: 1 }}
        name={address}
      />
      {/* {infoWindow} */}
    </Map>
  );
}

const LoadingContainer = () => <main className="loader" />;

MapContainer.propTypes = {
  google: PropTypes.object,
  mapPosition: PropTypes.object,
  getSearchPlace: PropTypes.object,
  setLatitude: PropTypes.func,
  setDeliverAddress: PropTypes.func,
  setDistrictNameAr: PropTypes.func,
  setDistrictNameEn: PropTypes.func,
  setLongitude: PropTypes.func,
  latitude: PropTypes.string,
  longitude: PropTypes.string,
};

export default GoogleApiWrapper((props) => ({
  apiKey: process.env.REACT_APP_MAP_API,
  language: props.locale,
  LoadingContainer,
}))(MapContainer);
