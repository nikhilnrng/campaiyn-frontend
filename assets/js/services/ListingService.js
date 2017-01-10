/* global FormData: false */
var ListingActions = require('../actions/ListingActions');

var ListingService = {

  /**
   * Gets all Listings that is near address.
   * @param address: the address of which to search by (currently not used)
   */
  searchListings: function(lat, lng, page, demographics, type) {
    $.ajax({
      url: '/api/listing',
      dataType: 'json',
      type: 'get',
      data: {
        lat: lat,
        lng: lng,
        demographics: demographics,
        type: type,
        page: page
      },
      success: function(data) {
        ListingActions.searchListingsSuccess(data.listings, data.totalCount, page);
      },
      error: function(xhr, status, err) {
        console.log(err);
        ListingActions.searchListingsFailure();
      }
    });
  },

  /**
   * Gets the basic information about a Listing with the specified id.
   * @param id The id of the listing to search for
   */
  getListingById: function(id) {
    $.ajax({
      url: '/api/listing/' + id,
      dataType: 'json',
      type: 'get',
      success: function(data) {
        ListingActions.listingReceived(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
   * Simple function to create a new listing
   * @param data: the JSON data to post. At minimum, should contain values for 'lat', 'lng',
   *               and 'title'. The current user is automatically added as an owner.
   */
  createNewListing: function(data) {
    $.ajax({
      url: '/api/listing',
      dataType: 'json',
      type: 'post',
      data: data,
      success: function(data) {
        ListingActions.newListingCreated(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
   * Uploads multiple images as specified listing's image set
   * @param listingId The Listing to upload images to
   * @param files The image files to upload
   */
  uploadImages: function(listingId, files) {
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append('image[]', files[i]);
    }
    $.ajax({
      url: '/api/listing/' + listingId + '/images',
      dataType: 'json',
      data: formData,
      processData: false,
      contentType: false,
      type: 'post',
      success: function(data) {
        // TODO fill with a ListingAction for uploading images
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
   * Creates a Listing and uploads images to that new Listing. Combines the capability of
   * createNewListing() and addImages(), but allows for a Flux action trigger to occur at
   * the correct time.
   * @param data The JSON data to post. At minimum, should contain values for 'lat', 'lng',
   *               and 'title'. The current user is automatically added as an owner.
   * @param files The images array which should be connected to the newly created Listing.
   */
  createNewListingWithImages: function(data, files) {
    $.ajax({
      url: '/api/listing',
      dataType: 'json',
      type: 'post',
      data: data,
      success: function(listing) {
        // If the files array exists and it is not empty, then attempt uploading the files
        // Otherwise, let it behave as an ordinary createNewListing()
        if (files && files.length > 0) {
          var formData = new FormData();
          for (var i = 0; i < files.length; i++) {
            formData.append('image[]', files[i]);
          }
          $.ajax({
            url: '/api/listing/' + listing.id + '/images',
            dataType: 'json',
            data: formData,
            processData: false,
            contentType: false,
            type: 'post',
            success: function(images) {
              console.log(images);
              ListingActions.newListingCreatedWithImages(listing, images);
            },
            error: function(xhr, status, err) {
              console.log(err);
            }
          });
        } else {
          ListingActions.newListingCreated(listing);
        }
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
   * Updates listing data of listing with given listingId
   * @param listingId: id of listing to be updated
   * @param data: listing object
   */
  updateListing: function(listingId, data) {
    $.ajax({
      url: '/api/listing/' + listingId,
      type: 'put',
      dataType: 'json',
      data: data,
      success: function(data) {
        ListingActions.listingUpdated(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
   * Destroys listing with given listingId
   * @param listingId: the id of the listing to be destroyed
   */
  destroyListing: function(listingId) {
    $.ajax({
      url: '/api/listing/' + listingId,
      type: 'delete',
      success: function() {
        ListingActions.listingDestroyed();
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  }

};

module.exports = ListingService;
