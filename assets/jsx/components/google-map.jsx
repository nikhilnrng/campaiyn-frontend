/* global google: false */
const React = require('react');
const IconInactive = '/images/google-maps/blue-icon.png';
const IconActive = '/images/google-maps/light-blue-icon.png';

var GoogleMap = React.createClass({

  /*
   * map: contains reference to map object
   * markers: array of marker objects
   *  - each object contains a reference to marker object
   *  - each object contains active/inactive status string
   * bounds: contains bounds of all map markers
   */
  map: null,
  markers: [],
  bounds: null,

  /*
   * propsUpdated: stores booleans for each prop
   *  - updates any time new props are received
   *  - true when prop is updated
   *  - false when prop is not updated
   */
  getInitialState: function() {
    return {
      propsUpdated: {
        listings: false,
        events: false
      }
    };
  },

  render: function() {
    return (
      <div id="map-canvas" ref="mapCanvas"></div>
    );
  },

  componentDidMount: function() {
    this.map = this._createMap();
    this.markers = this._createMarkers();
  },

  componentDidUpdate: function() {
    var propsUpdated = this.state.propsUpdated;
    // no updates
    if (!propsUpdated.listings && !propsUpdated.events) {
      return;
    } else if (this.state.propsUpdated.listings) { // listing prop updated
      this.markers = this._createMarkers();
    } else {
      this._updateMarkers(this.props.events.id); // events prop updated
    }
  },

  componentWillReceiveProps: function(newProps) {
    var newPropsUpdated = this.state.propsUpdated;

    // compare old and new listings prop
    var oldListings = this.props.listings;
    var newListings = newProps.listings;
    if (this._isArrayEquivalent(oldListings, newListings)) {
      newPropsUpdated.listings = false;
    } else {
      newPropsUpdated.listings = true;
    }

    // compare old and new events prop
    var oldEvents = this.props.events;
    var newEvents = newProps.events;
    if (this._isObjEquivalent(oldEvents, newEvents)) {
      newPropsUpdated.events = false;
    } else {
      newPropsUpdated.events = true;
    }

    // update props updated object in state
    this.setState({propsUpdated: newPropsUpdated});
  },

  // TODO: delete markers/map before unmount
  componentWillUnmount: function() {
    this._clearMarkers();
  },

  // initialize map object and assign to this.map
  _createMap: function() {
    // TODO: set map center to search coordinates
    var coords;
    if (this.props.listings.length === 1) {
      coords = {
        lat: this.props.listings[0].lat,
        lng: this.props.listings[0].lng
      };
    } else {
      coords = {lat: 34.00, lng: -118.00};
    }
    // TODO: configure dynamic single marker bounds fix instead of maxZoom
    var mapOptions = {
      zoom: 15,
      minZoom: 5,
      maxZoom: 20,
      scrollwheel: false,
      center: new google.maps.LatLng({
        lat: coords.lat,
        lng: coords.lng
      })
    };
    this.bounds = new google.maps.LatLngBounds();
    var map = new google.maps.Map(this.refs.mapCanvas, mapOptions);
    return map;
  },

  // create markers from listings object in props
  _createMarkers: function() {
    // clear current map markers
    this._clearMarkers();
    // generate new map markers
    var markers = this.props.listings.map(
      function(listing, indx) {
        // define map properties
        var _position;
        var _icon;
        var _marker;
        var _map = this.map;
        var _status = 'inactive';
        // define position based on lat/lng data
        _position = new google.maps.LatLng({
          lat: listing.lat,
          lng: listing.lng
        });
        // extend map bounds
        this.bounds.extend(_position);
        // assign default, inactive icon
        _icon = IconInactive;
        // create marker for map
        _marker = new google.maps.Marker({
          position: _position,
          map: _map,
          icon: _icon
        });
        // fit bounds if multiple markers
        if (indx) {
          this.map.fitBounds(this.bounds);
        }
        return {
          marker: _marker,
          status: _status
        };
      },
    this);
    return markers;
  },

  // update map marker corresponding to given index
  _updateMarkers: function(indx) {
    // set all icons to inactive
    this.markers.forEach(
      function(markerObj) {
        if (markerObj.status === 'inactive') {
          return;
        }
        markerObj.status = 'inactive';
        markerObj.marker.setIcon(IconInactive);
      }
    );
    // set corresponding icon to active on mouseover event
    var isActive = (this.props.events.event === 'mouseover');
    if (isActive) {
      this.markers[indx].marker.setIcon(IconActive);
      this.markers[indx].status = 'active';
    }
  },

  // clear markers from the map
  _clearMarkers: function() {
    this.markers.forEach(
      function(markerObj) {
        markerObj.marker.setMap(null);
      }
    );
    this.markers = [];
  },

  // check if two objects are equivalent
  _isObjEquivalent: function(a, b) {
    if (!a && !b) {
      return true;
    }
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) {
      return false;
    }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  },

  // check if two arrays of objects are equivalent
  _isArrayEquivalent: function(a, b) {
    if (!a && !b) {
      return true;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (var i = 0; i < a.length; i++) {
      var aObj = a[i];
      var bObj = b[i];
      if (!this._isObjEquivalent(aObj, bObj)) {
        return false;
      }
    }
    return true;
  }
});

module.exports = GoogleMap;
