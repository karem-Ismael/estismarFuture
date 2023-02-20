/**
 * Google Map
 */
import React from "react";
import GoogleMap from "google-map-react";
import PropTypes from "prop-types";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import ListedInformation from "components/shared/ListedInformation";
import { FormattedMessage, useIntl } from "react-intl";

export default function GoogleMapComponent({
  zoom = 9,
  lat,
  lng,
  city,
  heading,
  branch = undefined,
}) {
  const renderMarkers = (map, maps) =>
    new maps.Marker({
      position: { lat, lng },
      map,
      title: city || "",
    });
  const { locale, formatMessage } = useIntl();

  const branchDetails = branch
    ? [
        { msgId: "branchName", value: branch[`${locale}Name`] },
        { msgId: "branchAddress", value: branch.address },
        { msgId: "BranchPhoneNumber", value: <div dir="ltr">{branch.officeNumber}</div> },
      ]
    : [];

  return (
    <div className="map-wrapper">
      <RctCollapsibleCard heading={heading || ""} collapsible>
        <GoogleMap
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAP_API,
          }}
          yesIWantToUseGoogleMapApiInternals
          center={[lat, lng]}
          zoom={zoom}
          style={{ position: "relative", width: "100%", height: 400 }}
          onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
        />
        {branch && <ListedInformation data={branchDetails} />}
      </RctCollapsibleCard>
    </div>
  );
}

GoogleMapComponent.propTypes = {
  city: PropTypes.string,
  heading: PropTypes.string.isRequired,
  zoom: PropTypes.number,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};
