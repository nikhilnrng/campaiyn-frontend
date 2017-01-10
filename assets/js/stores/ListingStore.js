var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ListingConstants = require('../constants/ListingConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
const SEARCH_LISTINGS_PAGESIZE = 10; // This should be the same size as defined in ListingController

var currentListing = {};
var searchListings = [];
var totalNumberOfSearchListings = 0;
var searchListingsGetError = false;

var ListingStore = assign({}, EventEmitter.prototype, {

  getCurrentListing: function() {
    return currentListing;
  },

  /**
   * DEPRECATED. Do not use. Please perform 'getCurrentListing().id' to obtain id.
   */
  getCurrentListingId: function() {
    return currentListing.id;
  },

  getSearchListings: function() {
    return searchListings;
  },

  /**
   * @return {number} The next page that needs to be loaded
   */
  getNextPage: function() {
    return Math.floor((searchListings.length / SEARCH_LISTINGS_PAGESIZE) + 1);
  },

  /**
   * @return {boolean} Whether there are any more listings left to load
   */
  moreSearchListingsAvailable: function() {
    if (totalNumberOfSearchListings > searchListings.length) {
      return true;
    }
    return false;
  },

  didSearchListingsGetSucceed: function() {
    return !searchListingsGetError;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case ListingConstants.LISTING_CREATED:
      currentListing = action.listing;
      ListingStore.emitChange();
      break;

    case ListingConstants.LISTING_CREATED_WITH_IMAGES:
      currentListing = action.listing;
      ListingStore.emitChange();
      break;

    case ListingConstants.SEARCH_LISTINGS_SUCCESS:
      // If it's the first page being requested, simply set the values.
      // Otherwise check and make sure you only append the received listings if they're a new batch of listings
      if (action.page === 0 || action.page === 1) {
        searchListings = action.listings;
        totalNumberOfSearchListings = action.totalCount;
      } else if (searchListings.length === 0 || ListingStore.moreSearchListingsAvailable()) {
        searchListings = searchListings.concat(action.listings);
        totalNumberOfSearchListings = action.totalCount;
      }
      searchListingsGetError = false;
      ListingStore.emitChange();
      break;

    case ListingConstants.SEARCH_LISTINGS_FAILURE:
      searchListingsGetError = true;
      ListingStore.emitChange();
      break;

    case ListingConstants.LISTING_RECEIVED_ID:
      currentListing = action.listing;
      ListingStore.emitChange();
      break;

    case ListingConstants.LISTING_UPDATED:
      currentListing = action.listing;
      ListingStore.emitChange();
      break;

    case ListingConstants.LISTING_DESTROYED:
      currentListing = {};
      ListingStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = ListingStore;
