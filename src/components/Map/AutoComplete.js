/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";

import { GoogleApiWrapper } from "google-maps-react";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current, {
      types: ["geocode"],
      componentRestrictions: { country: "sa" },
    });

    this.autocomplete.addListener("place_changed", this.handlePlaceChanged);
  }

  handlePlaceChanged() {
    try {
      const place = this.autocomplete.getPlace();
      if (typeof place === "object") {
        this.props.setGetSearchPlace(place);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  render() {
    return (
      <input type="text" id="autocomplete" className="form-control" ref={this.autocompleteInput} />
    );
  }
}

export default GoogleApiWrapper((props) => {
  return {
    apiKey: process.env.REACT_APP_MAP_API,
    language: props.locale,
  };
})(SearchBar);
