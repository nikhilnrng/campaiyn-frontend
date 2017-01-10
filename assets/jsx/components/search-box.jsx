/* global google: false */
const React = require('react');

var searchBox;
var latitude;
var longitude;
var streetAddress;
var city;
var state;
var zip;
var placeId;

/**
* A typeahead search text field for geographic locations, powered by Google Maps Autocomplete
* library.
*/
var SearchBox = React.createClass({

  render: function() {
    if (this.props.placeId) {
      this._retreivePlace(this.props.placeId);
    }
    return (
      <input
        type="text"
        ref="searchBox"
        onChange={this.props.onChange}
        onKeyDown={this.props.onKeyDown}
        value={this.props.value}
        style={this.props.style}
        id={this.props.id}
        placeholder={this.props.placeholder} />
    );
  },

  componentDidMount: function() {
    searchBox = this._createSearchBox();
  },

  _createSearchBox: function() {
    // TODO these bounds can be eliminated when we provide universal listing support.
    // These bounds help tell Google that "Hey, the places are users will be searching
    // are generally in this area" so that it can provide better prediction results, this
    // area being Los Angeles.
    var swCoords = new google.maps.LatLng(33.86, -118.46);
    var neCoords = new google.maps.LatLng(34.18, -118.05);
    var bounds = new google.maps.LatLngBounds(swCoords, neCoords);
    var searchBoxOptions = {
      bounds: bounds
    };
    var searchBoxObject = new google.maps.places.SearchBox(this.refs.searchBox, searchBoxOptions);
    google.maps.event.addListener(searchBoxObject, 'places_changed', this._placesChangedListener);
    return searchBoxObject;
  },

  _placesChangedListener: function() {
    var place = searchBox.getPlaces()[0];
    if (!place || !place.geometry) {
      return;
    }
    // parse place object
    this._parsePlace(place);
    // update input box value in case of edit listing
    if (this.props.updateLocation) {
      this.props.updateLocation(this.refs.searchBox.value);
    }
  },

  _retreivePlace: function(placeId) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({placeId: placeId}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this._parsePlace(results[0]);
        }
      }
    }.bind(this));
  },

  _parsePlace: function(place) {
    latitude = place.geometry.location.lat();
    longitude = place.geometry.location.lng();
    placeId = place.place_id;
    var i;
    var j;
    var componentLen = place.address_components.length;
    for (i = 0; i < componentLen; i++) {
      var typeLen = place.address_components[i].types.length;
      for (j = 0; j < typeLen; j++) {
        var name = place.address_components[i].long_name;
        var type = place.address_components[i].types[j];
        if (type === 'street_number') {
          // if street number
          streetAddress = name;
        } else if (type === 'route' && streetAddress) {
          // if street name (and number already received)
          streetAddress += (' ' + name);
        } else if (type === 'locality') {
          // if city
          city = name;
        } else if (type === 'administrative_area_level_1') {
          // if state
          state = name;
        } else if (type === 'postal_code') {
          // if zip
          zip = name;
        }
      }
    }
  },

  getLatitude: function() {
    if (latitude) {
      return latitude;
    }
    return null;
  },

  getLongitude: function() {
    if (longitude) {
      return longitude;
    }
    return null;
  },

  getStreetAddress: function() {
    if (streetAddress) {
      return streetAddress;
    }
    return null;
  },

  getCity: function() {
    if (city) {
      return city;
    }
    return null;
  },

  getState: function() {
    if (state) {
      return state;
    }
    return null;
  },

  getZip: function() {
    if (zip) {
      return zip;
    }
    return null;
  },

  getPlaceId: function() {
    if (placeId) {
      return placeId;
    }
    return null;
  }
});

module.exports = SearchBox;
