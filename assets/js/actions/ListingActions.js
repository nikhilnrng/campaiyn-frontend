var AppDispatcher = require('../dispatcher/AppDispatcher');
var ListingConstants = require('../constants/ListingConstants');

var ListingActions = {

  /**
   * @param {object} listings The array of listing objects found
   * @param {int} page The page number these listing objects represent
   */
  searchListingsSuccess: function(listings, totalCount, page) {
    AppDispatcher.dispatch({
      actionType: ListingConstants.SEARCH_LISTINGS_SUCCESS,
      listings: listings,
      totalCount: totalCount,
      page: page
    });
  },

  searchListingsFailure: function() {
    AppDispatcher.dispatch({
      actionType: ListingConstants.SEARCH_LISTINGS_FAILURE
    });
  },

  /**
   * @param {object} listing
   */
  listingReceived: function(listing) {
    AppDispatcher.dispatch({
      actionType: ListingConstants.LISTING_RECEIVED_ID,
      listing: listing
    });
  },

  /**
   * @param {object} listing
   */
  newListingCreated: function(listing) {
    AppDispatcher.dispatch({
      actionType: ListingConstants.LISTING_CREATED,
      listing: listing
    });
  },

  /**
   * @param {object} listing
   * @param {array} images
   */
  newListingCreatedWithImages: function(listing, images) {
    // TODO handle images accordingly (pass them down, insert them into listing object, etc.)
      // It could be that the backend along with the service may connect the listing and images
      // into a single JSON object upon return of uploading new images
    AppDispatcher.dispatch({
      actionType: ListingConstants.LISTING_CREATED_WITH_IMAGES,
      listing: listing
    });
  },

  /**
   * @param {object} listing
   */
  listingUpdated: function(listing) {
    AppDispatcher.dispatch({
      actionType: ListingConstants.LISTING_UPDATED,
      listing: listing
    });
  },

  listingDestroyed: function() {
    AppDispatcher.dispatch({
      actionType: ListingConstants.LISTING_DESTROYED
    });
  }
};

module.exports = ListingActions;
