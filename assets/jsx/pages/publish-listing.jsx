/* global alert: false */
const React = require('react');
const FileUpload = require('./../components/file-upload.jsx');
const Paper = require('material-ui/lib/paper');
const TextField = require('material-ui/lib/text-field');
import StandardButton from '../components/standard-button.jsx';
const AuthStore = require('../../js/stores/AuthStore');
const ListingService = require('../../js/services/ListingService');
const ListingStore = require('../../js/stores/ListingStore');
const LoginDialog = require('./../components/login-dialog.jsx');
const SearchBox = require('./../components/search-box.jsx');
const ImagePreview = require('./../components/image-preview.jsx');
import Divider from 'material-ui/lib/divider';

// React Router History Handling
import {browserHistory} from 'react-router';
const history = browserHistory;

// Input Field Checks
var titleisValid = false;
var priceIsValid = false;
var descriptionIsValid = false;

const PublishListing = React.createClass({

  getInitialState: function() {
    return {
      tabValue: "1",
      hover: false,
      photos: [],
      loginActive: false,
      submitButtonDisabled: false,
      titleErrorText: '',
      priceErrorText: '',
      descriptionErrorText: '',
      audienceDescriptionErrorText: '',
      additionalDescriptionErrorText: ''
    };
  },

  _handleErrorInputForListingTitle: function() {
    // javascript regular expression that checks for any special characters
    var re = /^[a-zA-Z0-9 ]+$/;
    var minTitleLength = 3;
    var maxTitleLength = 32;
    var title = this.refs.title.getValue();
    if (title.length >= minTitleLength && title.length <= maxTitleLength) {
      if (re.test(title)) {
        this.setState({
          titleErrorText: ''
        });
        titleisValid = true;
      } else {
        this.setState({
          titleErrorText: 'Title can only have letters and numbers!'
        });
        titleisValid = false;
      }
    } else {
      this.setState({
        titleErrorText: 'Title must have 3-32 characters!'
      });
    }
  },

  _handleErrorInputForPrice: function() {
    // this regex checks for all ints and allows for a decimal followed by 2 repeating ints
    var re = /^\d+(.\d{1,2})?$/;
    var price = this.refs.price.getValue();
    var minPriceLength = 0;
    if (price.length > minPriceLength) {
      if (re.test(price)) {
        this.setState({
          priceErrorText: ''
        });
        priceIsValid = true;
      } else {
        this.setState({
          priceErrorText: 'Please give a valid price!'
        });
        priceIsValid = false;
      }
    } else {
      this.setState({
        priceErrorText: ''
      });
      priceIsValid = false;
    }
  },

  _handleErrorInputForDescription: function() {
    var description = this.refs.description.getValue();
    var minDescriptionLength = 0;
    var maxDescriptionLength = 1024;
    if (description.length > minDescriptionLength) {
      if (description.length < maxDescriptionLength) {
        this.setState({
          descriptionErrorText: ''
        });
        descriptionIsValid = true;
      } else {
        this.setState({
          descriptionErrorText: 'Please enter fewer than 1024 characters!'
        });
        descriptionIsValid = false;
      }
    } else {
      this.setState({
        descriptionErrorText: ''
      });
      descriptionIsValid = false;
    }
  },

  _handleErrorInputForAudienceDescription: function() {
    var description = this.refs.audienceDescription.getValue();
    var minDescriptionLength = 0;
    var maxDescriptionLength = 1024;
    if (description.length > minDescriptionLength) {
      if (description.length < maxDescriptionLength) {
        this.setState({
          audienceDescriptionErrorText: ''
        });
        descriptionIsValid = true;
      } else {
        this.setState({
          audienceDescriptionErrorText: 'Please enter fewer than 1024 characters!'
        });
        descriptionIsValid = false;
      }
    } else {
      this.setState({
        audienceDescriptionErrorText: ''
      });
      descriptionIsValid = false;
    }
  },

  _handleErrorInputForAdditionalDescription: function() {
    var description = this.refs.additionalDescription.getValue();
    var minDescriptionLength = 0;
    var maxDescriptionLength = 1024;
    if (description.length > minDescriptionLength) {
      if (description.length < maxDescriptionLength) {
        this.setState({
          additionalDescriptionErrorText: ''
        });
        descriptionIsValid = true;
      } else {
        this.setState({
          additionalDescriptionErrorText: 'Please enter fewer than 1024 characters!'
        });
        descriptionIsValid = false;
      }
    } else {
      this.setState({
        additionalDescriptionErrorText: ''
      });
      descriptionIsValid = false;
    }
  },

  _handleOnDrop: function(files) {
    this.setState({
      photos: files
    });
  },

  render: function() {
    var defaultTextFieldWidth = '350px';
    return (
      <div className="publish-listing">
        <LoginDialog openLogin={this.state.loginActive} closeLogin={this._closeLoginDialog} />
        <form className="publish-listing-form" action="#" method="post" autoComplete="off">
          <Paper zDepth={1} style={{paddingBottom: '150px'}}>
            <div className="title">
              <h1>List Your Space</h1>
              <h2>Campaiyn lets you earn money on any extra space you have</h2>
            </div>
            <Divider />
            <div className="publish-listing-form-elements">
              <TextField
                hintText="Listing Title"
                className="publish-listing-form-element"
                style={{width: defaultTextFieldWidth}}
                ref="title"
                errorText={this.state.titleErrorText}
                onBlur={this._handleErrorInputForListingTitle} />
              <br />
              <div className="publish-listing-form-element">
                <SearchBox ref="location" placeholder="Enter a Location" />
              </div>
              <TextField
                hintText="Minimum cost for others to advertise"
                className="publish-listing-form-element"
                style={{width: defaultTextFieldWidth}}
                ref="price"
                errorText={this.state.priceErrorText}
                onBlur={this._handleErrorInputForPrice} />
              <br />
              <TextField
                hintText="Describe your space"
                multiLine={true}
                rowsMax={3}
                className="publish-listing-form-element"
                style={{width: defaultTextFieldWidth}}
                ref="description"
                errorText={this.state.descriptionErrorText}
                onBlur={this._handleErrorInputForDescription} />
              <br />
              <TextField
                hintText="Describe the audience"
                multiLine={true}
                rowsMax={3}
                className="publish-listing-form-element"
                style={{width: defaultTextFieldWidth}}
                ref="audienceDescription"
                errorText={this.state.audienceDescriptionErrorText}
                onBlur={this._handleErrorInputForAudienceDescription} />
              <br />
              <TextField
                hintText="Any additional information?"
                multiLine={true}
                rowsMax={3}
                className="publish-listing-form-element"
                style={{width: defaultTextFieldWidth}}
                ref="additionalDescription"
                errorText={this.state.additionalDescriptionErrorText}
                onBlur={this._handleErrorInputForAdditionalDescription} />
              <br />
              <FileUpload
                className="publish-listing-form-element"
                name="Photos"
                multiple={true}
                onDrop={this._handleOnDrop} />
              <ImagePreview
                className="publish-listing-form-element"
                images={this.state.photos.slice()} />
              <div
                className="publish-listing-form-element"
                style={{float: 'right'}}>
                <StandardButton
                  label="Create Listing"
                  disabled={this.state.submitButtonDisabled}
                  tertiary={true}
                  onTouchTap={this._handleSubmit} />
              </div>
            </div>
          </Paper>
        </form>
      </div>
    );
  },

  componentDidMount: function() {
    ListingStore.addChangeListener(this._handleListingRedirect);
  },

  componentWillUnmount: function() {
    ListingStore.removeChangeListener(this._handleListingRedirect);
  },

  _handleSubmit: function() {
    // inputs invalid
    if (titleisValid === false || priceIsValid === false || descriptionIsValid === false) {
      alert("Invalid Inputs");
    } else if (AuthStore.isLoggedIn()) { // submit successful
      var data = {};
      data.title = this.refs.title.getValue();
      data.lat = this.refs.location.getLatitude();
      data.lng = this.refs.location.getLongitude();
      data.streetAddress = this.refs.location.getStreetAddress();
      data.city = this.refs.location.getCity();
      data.state = this.refs.location.getState();
      data.zip = this.refs.location.getZip();
      data.placeId = this.refs.location.getPlaceId();
      data.minPrice = this.refs.price.getValue();
      data.spaceDescription = this.refs.description.getValue();
      data.audienceDescription = this.refs.audienceDescription.getValue();
      data.additionalDescription = this.refs.additionalDescription.getValue();

      // disable the submit button as we wait for a service call to return
      this.setState({submitButtonDisabled: true});
      ListingService.createNewListingWithImages(data, this.state.photos);
    } else { // user not logged in
      this.setState({loginActive: true});
    }
  },

  _handleChange: function(value) {
    if (!isNaN(value)) {
      this.setState({
        tabValue: value
      });
    }
  },

  _closeLoginDialog: function() {
    this.setState({loginActive: false});
  },

  /**
   * handleListingRedirect is an event handler that runs
   * when a create new listing confirmation occurs; when
   * ListingStore is updated from the post request the
   * view is redirected based on the generated listingId
   */
  _handleListingRedirect: function() {
    var listingId = ListingStore.getCurrentListing().id;
    if (listingId) {
      history.push('/listing/' + listingId);
    } else {
      // Re-enable the submit button because the submit failed
      this.setState({submitButtonDisabled: false});
    }
  }

  // TODO: Implement states for on hover and on unhover for className=photo elements
});

module.exports = PublishListing;
