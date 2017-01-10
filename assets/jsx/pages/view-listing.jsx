/* global window: false, document: false */
const React = require('react');
import UserProfileCard from '../components/user-profile-card.jsx';
const Map = require('../components/google-map.jsx');
import StartConversationDialog from '../components/start-conversation-dialog.jsx';
const ImageLibrary = require('../components/image-library.jsx');
const LoginDialog = require('../components/login-dialog.jsx');
import StandardButton from '../components/standard-button.jsx';

// Flux Data Helpers
const ListingStore = require('../../js/stores/ListingStore');
const ListingService = require('../../js/services/ListingService');
const UserStore = require('../../js/stores/UserStore');
const UserService = require('../../js/services/UserService');
const AuthStore = require('../../js/stores/AuthStore');

// React Router History Handling
import {browserHistory} from 'react-router';
const history = browserHistory;

// enumerated user states
const UserState = {
  LOGGED_OUT: 0,
  LOGGED_IN: 1,
  LOGGED_IN_OWNER: 2,
  UNKNOWN: 3
};

var ViewListing = React.createClass({

  getInitialState: function() {
    return {
      listing: null,
      dimensions: {},
      openStartConversationDialog: false,
      isImageLibraryOpen: false,
      imageLibraryIndx: null,
      userState: UserState.UNKNOWN,
      myUserId: null,
      openLoginDialog: false,
      startConversationButtonClicked: false
    };
  },

  render: function() {
    var listing = this.state.listing;
    if (listing) {
      var coverPhoto = this._createCoverPhoto(listing);
      var description = this._createDescription(listing);
      var imageLibrary = this._createImageLibrary(listing);
      return (
        <div className="view-listing">
          <LoginDialog
            openLogin={this.state.openLoginDialog}
            closeLogin={this._handleLoginClose} />
          <StartConversationDialog
            open={this.state.openStartConversationDialog}
            listingId={listing.id}
            onClose={this.onStartConversationDialogClose} />
          {imageLibrary}
          {coverPhoto}
          {description}
        </div>
      );
    }
    return (
      <div className="view-listing"></div>
    );
  },

  componentDidMount: function() {
    ListingStore.addChangeListener(this._updateListingState);
    ListingService.getListingById(this.props.params.listingId);
    AuthStore.addChangeListener(this._getMyUserId);
    UserStore.addChangeListener(this._storeMyUserId);
    this._getMyUserId();
    window.addEventListener('scroll', this._handleScroll);
  },

  componentDidUpdate: function() {
    // run once
    var dimensions = this.state.dimensions;
    var listing = this.state.listing;
    if (!Object.keys(dimensions).length
      && listing != null
      && Object.keys(listing).length) {
      this._getDimensions();
    }
  },

  componentWillUnmount: function() {
    ListingStore.removeChangeListener(this._updateListingState);
    AuthStore.removeChangeListener(this._getMyUserId);
    UserStore.removeChangeListener(this._storeMyUserId);
    window.removeEventListener('scroll', this._handleScroll);
  },

  /**
   * createCoverPhoto generates the cover photo, title details,
   * and contact button
   *
   * @param listing - listing object returned from ListingStore
   */
  _createCoverPhoto: function(listing) {
    // exit if listing empty
    if (listing == null || !Object.keys(listing).length) {
      return null;
    }
    var coverPhoto, coverPhotoImage = null, functionButton = null;
    // check if listing.images[0] exists for cover photo
    if (listing.hasOwnProperty('images') && listing.images.length >= 1) {
      coverPhotoImage = listing.images[0];
    }
    // check if the listing is owned by current user
    if (this.state.userState === UserState.LOGGED_IN_OWNER) {
      functionButton = (
        <StandardButton
          label="Edit"
          style={{padding: '12px 60px'}}
          onMouseUp={this._handleEditRedirect} />
      );
    } else {
      functionButton = (
        <StandardButton
          label="Contact"
          style={{padding: '12px 60px'}}
          onMouseUp={this._handleContactTouchTap} />
      );
    }
    return (
      <div className="cover-photo">
        <div className="content-container">
          <div id="listing-details">
            <h1>{listing.title}</h1>
            <h3>{listing.city}, {listing.state}</h3>
          </div>
          <div id="button-container">
            {functionButton}
          </div>
        </div>
        <div className="cover-photo-overlay" onClick={this._openImageLibrary.bind(this, 0)}></div>
        <div className="photo-container">
          <img src={coverPhotoImage} />
        </div>
      </div>
    );
  },

  /**
   * createDescription creates the entire description section
   * below the cover photo, including the listing description,
   * user profile card, image display, and google map
   *
   * @param listing - listing object returned from ListingStore
   */
  _createDescription: function(listing) {
    // exit if listing empty
    if (listing == null || !Object.keys(listing).length) {
      return null;
    }
    
    // Create the User Profile Card
    var listingOwner = this.state.listing.owners[0];
    var listingOwnerLocation;
    if (listingOwner.locality && listingOwner.region) {
      listingOwnerLocation = listingOwner.locality + ', ' + listingOwner.region;
    }
    
    var imageTitle = null;
    var imageDisplay = this._createImageDisplay(listing);
    // display image title if images exist
    if (imageDisplay) {
      imageTitle = <h1>Images</h1>;
    }
    return (
      <div className="description">
        <div className="content-container" ref="contentContainer">
          <div id="body" ref="body">
            <h1>Details</h1>
            <h2>Minimum Price: {listing.minPrice}</h2>
            <h2>The Space</h2>
            <p>{listing.spaceDescription}</p>
            <h2>The Audience</h2>
            <p>{listing.audienceDescription}</p>
            <h2>The Details</h2>
            <p>{listing.additionalDescription}</p>
            {imageTitle}
            {imageDisplay}
          </div>
          <div id="sidebar">
            <div className="user-profile-card-container" ref="userProfileCard">
              <UserProfileCard
                avatar={listingOwner.profileImage}
                name={listingOwner.firstName}
                location={listingOwnerLocation} />
            </div>
          </div>
          <div id="map">
            <Map listings={[this.state.listing]} />
          </div>
        </div>
      </div>
    );
  },

  /**
   * createImageDisplay generates the image display for any
   * additional photos contained in the listing object; the
   * display contains up to 5 images, with an overflow count
   * and overlay in the case of more than 5 images
   *
   * @param listing - listing object returned from ListingStore
   */
  _createImageDisplay: function(listing) {
    // exit if listing empty or if images property does not exist
    if (listing == null || !Object.keys(listing).length || !listing.hasOwnProperty('images')) {
      return null;
    }
    var numImages = listing.images.length - 1; // don't include cover photo
    var numOverflowImages = '+ ' + (numImages - 5);
    // no images to display
    if (!numImages || !listing.images.length) {
      return null;
    }
    // set temporary variables to null
    var extraImages;
    var extraImagesColOne;
    var extraImagesColTwo;
    var overflowImage;
    extraImages = extraImagesColOne = extraImagesColTwo = overflowImage = null;
    // overflow images exist
    if (numImages > 5) {
      overflowImage = (
        <div className="image-icon">
          <div className="image-container">
            <a onClick={this._openImageLibrary.bind(this, 5)}>
              <div className="overflow-overlay">
                <h1>{numOverflowImages}</h1>
              </div>
              <img src={listing.images[5]} />
            </a>
          </div>
        </div>
      );
    }
    // second column necessary
    if (numImages >= 4) {
      var topImage = (numImages >= 4) ? (
          <div className="image-icon">
            <div className="image-container">
              <a onClick={this._openImageLibrary.bind(this, 4)}>
                <img src={listing.images[4]} />
              </a>
            </div>
          </div>
        ) : null;
      var bottomImage = (numImages >= 5) ? (
          <div className="image-icon">
            <div className="image-container">
              <a onClick={this._openImageLibrary.bind(this, 5)}>
                <img src={listing.images[5]} />
              </a>
            </div>
          </div>
        ) : null;
      if (overflowImage) {bottomImage = overflowImage;}
      extraImagesColTwo = (
        <div className="image-col">
          {topImage}
          {bottomImage}
        </div>
      );
    }
    // first column necessary
    if (numImages >= 2) {
      var topImage = (numImages >= 2) ? (
          <div className="image-icon">
            <div className="image-container">
              <a onClick={this._openImageLibrary.bind(this, 2)}>
                <img src={listing.images[2]} />
              </a>
            </div>
          </div>
        ) : null;
      var bottomImage = (numImages >= 3) ? (
          <div className="image-icon">
            <div className="image-container">
              <a onClick={this._openImageLibrary.bind(this, 3)}>
                <img src={listing.images[3]} />
              </a>
            </div>
          </div>
        ) : null;
      extraImagesColOne = (
        <div className="image-col">
          {topImage}
          {bottomImage}
        </div>
      );
    }
    // extra images columns necessary
    if (numImages > 1) {
      extraImages = (
        <div className="extra-images">
          {extraImagesColOne}
          {extraImagesColTwo}
        </div>
      );
    }
    return (
      <div className="image-icon-display">
        <div className="image-icon-display-container">
          <div className="main-image">
            <div className="main-image-icon">
              <div className="image-container">
                <a onClick={this._openImageLibrary.bind(this, 1)}>
                  <img src={listing.images[1]} />
                </a>
              </div>
            </div>
          </div>
          {extraImages}
        </div>
      </div>
    );
  },

  /**
   * createImageLibrary generates the image library component
   * only if the images array exists; the function passes
   * images, indx, open, and a close library function as props
   */
  _createImageLibrary: function(listing) {
    // exit if listing empty or if images property does not exist
    if (listing == null || !Object.keys(listing).length || !listing.hasOwnProperty('images')) {
      return null;
    }
    return (
      <ImageLibrary
        images={listing.images.slice()}
        indx={this.state.imageLibraryIndx}
        isOpen={this.state.isImageLibraryOpen}
        closeImageLibrary={this._closeImageLibrary} />
    );
  },

  /**
   * handleScroll is an event handler that is called when a user
   * scrolls on the view listing page; the function updates the
   * position style element and the top style element of the
   * userProfileCard container
   */
  _handleScroll: function() {
    if (!Object.keys(this.state.dimensions).length
      || this.state.listing == null
      || !Object.keys(this.state.listing).length) {
      return;
    }
    var scroll = window.scrollY;
    var threshMin = this.state.dimensions.threshMin;
    var threshMax = this.state.dimensions.threshMax;
    var defaultTopPadding = this.state.dimensions.defaultTopPadding + 'px';
    var dynamicTopPadding = this.state.dimensions.dynamicTopPadding + 'px';
    // in between min/max thresholds - fix userProfileCard
    if (scroll > threshMin && scroll < threshMax) {
      this.refs.userProfileCard.style.position = 'fixed';
      this.refs.userProfileCard.style.top = defaultTopPadding;
    } else if (scroll >= threshMax) { // after max threshold - userProfileCard position to bottom of sidebar
      this.refs.userProfileCard.style.position = 'relative';
      this.refs.userProfileCard.style.top = dynamicTopPadding;
    } else { // before min threshold - userProfileCard position to top of sidebar
      this.refs.userProfileCard.style.position = 'static';
      this.refs.userProfileCard.style.top = defaultTopPadding;
    }
  },

  /**
   * getDimensions pulls relevant page dimensions after the page
   * is rendered for the first times and updates the state
   * dimensions object; the dimensions are used to dynamically
   * create the fixed userProfileCard thresholds and dimensions
   *
   * TODO reconstruct dimensions on window resize
   */
  _getDimensions: function() {
    var calcDimensions = {};
    // pull relevant rendered page dimensions
    var userCardOffsetTop = this.refs.userProfileCard.offsetTop;
    var contentPadding
      = parseInt(window.getComputedStyle(this.refs.contentContainer)['padding-top'], 10);
    var userCardHeight = this.refs.userProfileCard.clientHeight;
    var bodyHeight = this.refs.body.clientHeight;
    var bodyBottomPadding = parseInt(window.getComputedStyle(this.refs.body)['padding-bottom'], 10);
    // construct dimensions object
    calcDimensions.defaultTopPadding = contentPadding;
    calcDimensions.dynamicTopPadding = bodyHeight - bodyBottomPadding - userCardHeight;
    calcDimensions.threshMin = userCardOffsetTop - contentPadding;
    calcDimensions.threshMax = calcDimensions.threshMin + calcDimensions.dynamicTopPadding;
    // update dimensions state
    this.setState({dimensions: calcDimensions});
  },

  /**
   * updateListingState is a helper function that updates the
   * listing state from ListingStore
   */
  _updateListingState: function() {
    this.setState({listing: ListingStore.getCurrentListing()});
    this._checkListingMine();
  },

  /**
   * openDialog is an event handler that is called when the contact
   * button is clicked; sets openStartConversationDialog state to true in order to
   * open the start conversation dialog
   */
  _openDialog: function() {
    this.setState({openStartConversationDialog: true});
  },

  /**
   * closeDialog is a helper function that is called when the submit
   * or cancel buttons are pressed on the start conversation dialog;
   * sets openStartConversationDialog to false in order to close the dialog box
   */
  onStartConversationDialogClose: function() {
    this.setState({openStartConversationDialog: false});
  },

  /**
   * handleImageClick is an event handler that is called in the case
   * that an image in image display is clicked
   *
   * @param indx - index of image clicked
   * @param e - synthetic event
   */
  _openImageLibrary: function(indx, e) {
    e.preventDefault();
    if (!this.state.listing.hasOwnProperty('images')) {
      return null;
    }
    document.body.style.overflow = 'hidden';
    this.setState({
      isImageLibraryOpen: true,
      imageLibraryIndx: indx
    });
  },

  /**
   * closeImageLibrary is a helper function that changes the
   * isImageLibraryOpen state to false; called in image library
   * component
   */
  _closeImageLibrary: function() {
    document.body.style.overflow = 'initial';
    this.setState({isImageLibraryOpen: false});
  },

  /**
   * handleEditRedirect redirects to the edit listing page
   */
  _handleEditRedirect: function() {
    history.push('/listing/' + this.props.params.listingId + '/edit');
  },

  /**
   * User presses contact button which checks whether or not a user is logged in.
   * if a user is logged in it will let them open the start conversation dialog
   * if they arent it asks them to login
   * startConversationButtonClicked state is used to link the start conversation dialog directly to the login dialog
   * so if they press the contact button, and they are not logged in. The platform will prompt
   * the user to login, and once they login, the start conv dialog will immediately appear
  */
  _handleContactTouchTap: function() {
    if (this.state.userState == UserState.LOGGED_IN) {
      this._openDialog();
    } else if (this.state.userState == UserState.LOGGED_OUT) {
      this.setState({
        openLoginDialog: true,
        startConversationButtonClicked: true
      });
    }
  },

  /**
   * getMyUserId attempts to retreive the userId of a
   * user who is logged in, and sets the userState accordingly
   */
  _getMyUserId: function() {
    if (AuthStore.isLoggedIn()) {
      UserService.getMe();
      this.setState({
        userState: UserState.LOGGED_IN
      }, function() {
        if (this.state.startConversationButtonClicked) {
          this._handleContactTouchTap();
        }
      });
    } else {
      this.setState({
        userState: UserState.LOGGED_OUT,
        startConversationButtonClicked: false
      });
    }
  },

  /**
   * storeMyUserId stores the userId retrieved from the
   * UserService.getMe() function call
   */
  _storeMyUserId: function() {
    this.setState({myUserId: UserStore.getId()});
    this._checkListingMine();
  },

  /**
   * checkListingMine checks if the current listing is owned
   * by the current user
   */
  _checkListingMine: function() {
    var listingReceived = (this.state.listing != null
                            && Object.keys(this.state.listing).length > 0);
    var userStoreReceived = (this.state.myUserId != null);
    // check if listing owner id and user id have been received
    if (listingReceived && userStoreReceived) {
      if (this.state.listing.owners[0].id == this.state.myUserId) {
        this.setState({
          userState: UserState.LOGGED_IN_OWNER
        });
      }
    }
  },

  _handleLoginClose: function(didNotSignIn) {
    if (didNotSignIn) {
      this.setState({
        openLoginDialog: false,
        startConversationButtonClicked: false
      });
    } else {
      this.setState({
        openLoginDialog: false
      });
    }
  }
});

module.exports = ViewListing;
