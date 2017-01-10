const React = require('react');

const ImagePreview = React.createClass({

  render: function() {
    if (!this.props.images.length) {
      return null;
    }
    var imagePreview = this._createImagePreview(this.props.images);
    return (
      <div className="image-preview">
        {imagePreview}
      </div>
    );
  },

  /**
   * createImagePreview constructs the cover photo and
   * listing photos sections of the image preview
   * components
   *
   * @param images - images array prop passed from parent
   */
  _createImagePreview: function(images) {
    // if empty
    if (!images.length) {
      return null;
    }
    // not empty
    var coverPhoto = this._createCoverPhotoPreview(images[0]);
    images.shift();
    var listingPhotos = this._createListingPhotoPreview(images);
    return (
      <div className="image-preview-container">
        {coverPhoto}
        {listingPhotos}
      </div>
    );
  },

  /**
   * createCoverPhotoPreview returns the cover photo
   * section of the image preview component
   *
   * @param coverPhoto - cover photo image file
   */
  _createCoverPhotoPreview: function(coverPhoto) {
    return (
      <div className="cover-photo-preview-container">
        <h2>Cover Photo</h2>
        <div className="photo-preview-row">
          <div className="photo-preview-card">
            <img src={coverPhoto.preview} />
          </div>
        </div>
      </div>
    );
  },

  /**
   * createListingPhotoPreview returns the listing photo
   * section of the image preview component
   *
   * @param listingImages - array of listing image files
   */
  _createListingPhotoPreview: function(listingImages) {
    if (!listingImages.length) {
      return null;
    }
    var rowIndx = 0;
    var listingPhotoPreview = [];
    while (listingImages.length > 0) {
      // pull at most four images for row
      var rowImages = listingImages.slice(0, 4);
      // construct image cards
      var imageCards = rowImages.map(
        function(image, indx) {
          return (
            <div className="photo-preview-card" key={indx}>
              <img src={image.preview} />
            </div>
          );
        }
      );
      // construct image row
      var imageRow = (
        <div className="photo-preview-row" key={rowIndx++}>
          {imageCards}
        </div>
      );
      listingPhotoPreview.push(imageRow);
      listingImages.splice(0, 4);
    }
    return (
      <div className="photo-preview-container">
        <h2>Listing Photos</h2>
        {listingPhotoPreview}
      </div>
    );
  }
});

module.exports = ImagePreview;
