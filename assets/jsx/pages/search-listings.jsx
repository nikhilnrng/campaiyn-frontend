import React from 'react';
import ListingList from '../components/listing-list.jsx';
import SearchBox from '../components/search-box.jsx';
import FilterBox from '../components/filter-box.jsx';
import StandardButton from '../components/standard-button.jsx';
import Color from '../../js/constants/Color.js';
import {browserHistory} from 'react-router';
const history = browserHistory;
var ListingStore = require('../../js/stores/ListingStore');
var ListingService = require('../../js/services/ListingService');

// SearchListing Class code
var SearchListings = React.createClass({
  propTypes: {
    location: React.PropTypes.object
  },

  /*
   * listings: stores results from search get request
   *  - passed down to map component for markers
   *  - passed down to listing list for listing cards
   *
   * events: stores listing card events and ids
   *  - events is passed up from listing cards to search-listings
   *  - events is passed down to map component when updated
   */
  getInitialState: function() {
    var initListings = this.getListingState().listings;
    var initEvents = this.setEvents().events;
    return {
      listings: initListings,
      events: initEvents,
      currentPage: 1
    };
  },

  render: function() {
    // TODO remove/edit when headings are standardized
    const h1Style = {
      textAlign: 'right',
      marginTop: '0px',
      marginBottom: '0px',
      paddingTop: '3%',
      paddingRight: '6%',
      color: Color.CAMPAIYN_PRIMARY
    };
    const h2Style = {
      textAlign: 'left',
      marginTop: '70px',
      marginBottom: '10px',
      paddingLeft: '3%',
      color: Color.CAMPAIYN_PRIMARY
    };

    return (
      <div className="search-listings">
        <div className="advanced-search-container">
          <div className="search-title">
            <h2 style={h2Style}>FIND LISTINGS</h2>
          </div>
          <div className="search-box">
            <SearchBox
              ref="searchBox"
              placeholder="Los Angeles, CA"
              onKeyDown={this.handleEnterKeyDown} />
          </div>
          <FilterBox ref="filterBox" />
          <StandardButton label="Search" secondary={true} onTouchTap={this.handleSearch}/>
        </div>
        <div className="listing-list-container">
          <div className="listing-list-title">
            <h1 style={h1Style}>LISTINGS</h1>
          </div>
          <ListingList
            onScroll={this.handleScroll}
            listings={this.state.listings}
            updateEvents={this.updateEvents} />
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    var query = this.props.location.query;
    ListingStore.addChangeListener(this.onListingStoreChange);
    ListingService.searchListings(query.lat, query.lng, parseInt(query.page, 10));
  },

  componentWillUnmount: function() {
    ListingStore.removeChangeListener(this.onListingStoreChange);
  },

  handleScroll: function(e) {
    if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 270
      && ListingStore.moreSearchListingsAvailable()) {
      // TODO: add demographic information
      // TODO: add type information
      var query = this.props.location.query;
      var nextPage = this.state.currentPage + 1;
      ListingService.searchListings(query.lat, query.lng, nextPage);
      this.setState({
        currentPage: nextPage
      });
    }
  },

  handleEnterKeyDown: function(e) {
    // ENTER key code is 13
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  },

  handleSearch: function() {
    var latitude = this.refs.searchBox.getLatitude();
    var longitude = this.refs.searchBox.getLongitude();
    var demographics = this.refs.filterBox.getCheckedDemographics();
    var types = this.refs.filterBox.getCheckedTypes();
    if (!latitude || !longitude) {
      return;
    }
    var queryString = '/search?lat=' + latitude + '&lng=' + longitude;
    demographics.forEach(function addDemographic(element, index, array) {
      queryString += '&demographics=' + element;
    });
    types.forEach(function addType(element, index, array) {
      queryString += '&type=' + element;
    });
    queryString += '&page=1';
    history.push(queryString);
    ListingService.searchListings(latitude, longitude, 1, demographics, types);
    this.setState({
      currentPage: 1
    });
  },

  /**
   * getListingState resets the listings state with the
   * most up to date ListingStore data
   *
   * @return {Object} listings object
   */
  getListingState: function() {
    return {listings: ListingStore.getSearchListings()};
  },

  /**
   * setEvents resets the events state to a null
   * events object when a new get request is received
   *
   * @return {Object} events object
   */
  setEvents: function() {
    return {
      events: {
        event: null,
        id: null
      }
    };
  },

  /**
   * updateEvents updates the SearchListings events state
   * from the ListingList child component
   *
   * @param {Object} updatedEvent - the changed event object
   * @return {void}
   */
  updateEvents: function(updatedEvent) {
    this.setState({events: updatedEvent});
  },

  /**
   * onListingStoreChange updates the listings and events states
   * when a new get request response is received through
   * ListingStore
   *
   * @return {void}
   */
  onListingStoreChange: function() {
    this.setState(this.getListingState());
    this.setState(this.setEvents());
  }
});

module.exports = SearchListings;
