const React = require('react');
const SearchBox = require('./../components/search-box.jsx');
import StandardButton from '../components/standard-button.jsx';

// Flux Data Helpers
const ListingStore = require('../../js/stores/ListingStore');
const ListingService = require('../../js/services/ListingService');

// React Router History Handling
import {browserHistory} from 'react-router';
const history = browserHistory;

import {requireAuthentication} from '../hoc/require-authentication.jsx';

var updatedData = {};

var EditListing = React.createClass({

  getInitialState: function() {
    return {
      title: null,
      minPrice: null,
      placeId: null,
      location: null,
      spaceDescription: null,
      audienceDescription: null,
      additionalDescription: null
    };
  },

  render: function() {
    return (
      <div className="edit-listing">
        <div className="edit-listing-container">
          <div className="title">
            <h1>Edit Listing</h1>
          </div>
          <div className="divider" id="top"></div>
          <form autoComplete="off">
            <p className="form-text">
              <label>Title</label>
              <span>
                <input
                  type="text"
                  id="title"
                  value={this.state.title}
                  onChange={this._handleChange}
                  onBlur={this._handleBlur} />
              </span>
            </p>
            <p className="form-text">
              <label>Location</label>
              <span>
                <SearchBox
                  id="location"
                  ref="location"
                  placeholder = ""
                  value={this.state.location}
                  placeId={this.state.placeId}
                  onChange={this._handleChange}
                  updateLocation={this._updateLocation} />
              </span>
            </p>
            <p className="form-text">
              <label>Price</label>
              <span>
                <input
                  type="text"
                  id="price"
                  value={this.state.minPrice}
                  onChange={this._handleChange} />
              </span>
            </p>
            <p className="form-textarea">
              <label>Space</label>
              <span>
                <textarea
                  type="text"
                  rows="10"
                  id="spaceDescription"
                  value={this.state.spaceDescription}
                  onChange={this._handleChange} />
              </span>
            </p>
            <p className="form-textarea">
              <label>Audience</label>
              <span>
                <textarea
                  type="text"
                  rows="10"
                  id="audienceDescription"
                  value={this.state.audienceDescription}
                  onChange={this._handleChange} />
              </span>
            </p>
            <p className="form-textarea">
              <label>Additional Information</label>
              <span>
                <textarea
                  type="text"
                  rows="10"
                  id="additionalDescription"
                  value={this.state.additionalDescription}
                  onChange={this._handleChange} />
              </span>
            </p>
            <div className="divider" id="bottom"></div>
            <div className="buttons">
              <div id="left">
                <StandardButton
                  label="Update Listing"
                  style={{width: '230px', padding: '12px 0', margin: '20px'}}
                  onMouseUp={this._handleListingUpdate} />
              </div>
              <div id="right">
                <a id="delete" onClick={this._handleListingDestroy}>
                  Permanently delete my listing
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    ListingStore.addChangeListener(this._handleListingStoreUpdate);
    ListingService.getListingById(this.props.params.listingId);
  },

  componentWillUnmount: function() {
    ListingStore.removeChangeListener(this._handleListingStoreUpdate);
  },

  /**
   * handleListingStoreUpdate redirects to the dashboard if listing is
   * deleted successfully; redirects to listing page if listing is
   * updated successfully; sets states with listing data if listing
   * data received successfully
   */
  _handleListingStoreUpdate: function() {
    var listing = ListingStore.getCurrentListing();
    // delete occurred
    if (!Object.keys(listing).length) {
      history.push('/dashboard');
    } else if (Object.keys(updatedData).length) { // update occurred
      updatedData = {};
      history.push('/listing/' + this.props.params.listingId);
    } else { // listing received
      this.setState({
        title: listing.title,
        minPrice: listing.minPrice,
        placeId: listing.placeId,
        location: (listing.streetAddress + ', '
          + listing.city + ', '
          + listing.state + ' '
          + listing.zip),
        spaceDescription: listing.spaceDescription,
        audienceDescription: listing.audienceDescription,
        additionalDescription: listing.additionalDescription
      });
    }
  },

  /**
   * handleListingDestroy is a helper function that destroys the
   * listing associated with the current listing id
   */
  _handleListingDestroy: function() {
    ListingService.destroyListing(this.props.params.listingId);
  },

  /**
   * updateListing is a helper function that updates the listing
   * associated with the current listing id with the updatedData
   */
  _handleListingUpdate: function() {
    ListingService.updateListing(this.props.params.listingId, updatedData);
  },

  /**
   * handleChange is an event handler that is called when the
   * contents of an input or textarea are changed; updates
   * corresponding state and calls handleDataUpdate handler
   *
   * @param e - synthetic event
   */
  _handleChange: function(e) {
    var state = {};
    state[e.target.id] = e.target.value;
    this.setState(state);
    this._handleDataUpdate(e);
  },

  /**
   * handleDataUpdate is a helper function that is called
   * by handleChange in order to add changed data to the
   * updatedData object; does not handle location changes
   *
   * @param e - synthetic event
   */
  _handleDataUpdate: function(e) {
    if (e.target.id !== 'location') {
      updatedData[e.target.id] = e.target.value;
    }
  },

  /**
   * updateLocation is a helper function that is called
   * by the search-box component when a new place is selected
   * in the Google drop-down search box; updates location state
   * and adds updated location info to updatedData object
   *
   * @param location - string value associated with new place
   */
  _updateLocation: function(location) {
    this.setState({location: location});
    updatedData.lat = this.refs.location.getLatitude();
    updatedData.lng = this.refs.location.getLongitude();
    updatedData.streetAddress = this.refs.location.getStreetAddress();
    updatedData.city = this.refs.location.getCity();
    updatedData.state = this.refs.location.getState();
    updatedData.zip = this.refs.location.getZip();
    updatedData.placeId = this.refs.location.getPlaceId();
  }
});

module.exports = requireAuthentication(EditListing);
