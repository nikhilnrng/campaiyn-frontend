var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var UPDATE_EVENT = 'update';

var id;
var primaryEmail;
var displayName;
var firstName;
var lastName;
var profileImage;
var myListings = [];
var myIncomingProposals = [];
var myOutgoingProposals = [];
var braintreeResponse; // eslint-disable-line no-unused-vars
var resetPasswordSuccess;
var braintreeMerchantId;

var UserStore = assign({}, EventEmitter.prototype, {

  /* Getters (Nullable) */
  getId: function() {
    return id;
  },

  getPrimaryEmail: function() {
    return primaryEmail;
  },

  getDisplayName: function() {
    return displayName;
  },

  getFirstName: function() {
    return firstName;
  },

  getLastName: function() {
    return lastName;
  },

  getMyListings: function() {
    return myListings;
  },

  getMyIncomingProposals: function() {
    return myIncomingProposals;
  },

  getMyOutgoingProposals: function() {
    return myOutgoingProposals;
  },

  getProfileImage: function() {
    return profileImage;
  },

  getBraintreeMerchantId: function() {
    return braintreeMerchantId;
  },

  isResetPasswordSuccess: function() {
    return resetPasswordSuccess;
  },

  /* Handlers */
  handleMe: function(user) {
    id = user.id;
    primaryEmail = user.primaryEmail;
    displayName = user.displayName;
    lastName = user.lastName;
    firstName = user.firstName;
    braintreeMerchantId = user.braintreeMerchantId;
    if (user.hasOwnProperty('profileImage')) {
      profileImage = user.profileImage;
    } else {
      profileImage = {};
    }
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitUpdate: function() {
    this.emit(UPDATE_EVENT);
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
  },

  /**
   * @param {function} callback
   */
  addUpdateListener: function(callback) {
    this.on(UPDATE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeUpdateListener: function(callback) {
    this.removeListener(UPDATE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case UserConstants.USER_GET_ME_RECEIVED:
      UserStore.handleMe(action.user);
      UserStore.emitChange();
      break;

    case UserConstants.USER_VERIFY_SUCCESS:
      UserStore.handleMe(action.user);
      UserStore.emitChange();
      break;

    case UserConstants.USER_VERIFY_FAILURE:
      UserStore.emitChange();
      break;

    case UserConstants.USER_UPLOAD_PHOTO:
      UserStore.handleMe(action.user);
      UserStore.emitChange();
      break;

    case UserConstants.USER_LISTINGS_SUCCESS:
      myListings = action.listings;
      UserStore.emitChange();
      break;

    case UserConstants.USER_LISTINGS_FAILURE:
      myListings = [];
      UserStore.emitChange();
      break;

    case UserConstants.USER_INCOMING_PROPOSALS_SUCCESS:
      myIncomingProposals = action.proposals;
      UserStore.emitChange();
      break;

    case UserConstants.USER_INCOMING_PROPOSALS_FAILURE:
      myIncomingProposals = [];
      UserStore.emitChange();
      break;

    case UserConstants.USER_OUTGOING_PROPOSALS_SUCCESS:
      myOutgoingProposals = action.proposals;
      UserStore.emitChange();
      break;

    case UserConstants.USER_OUTGOING_PROPOSALS_FAILURE:
      myOutgoingProposals = [];
      UserStore.emitChange();
      break;

    case UserConstants.USER_MERCHANT_CREATE_SUCCESS:
      braintreeResponse = action.response.braintreeResponse;
      UserStore.emitChange();
      break;

    case UserConstants.USER_MERCHANT_CREATE_FAILURE:
      UserStore.emitChange();
      break;

    case UserConstants.USER_UPDATE_SUCCESS:
      UserStore.handleMe(action.user);
      UserStore.emitUpdate();
      break;

    case UserConstants.USER_RESET_PASSWORD_SUCCESS:
      resetPasswordSuccess = true;
      UserStore.emitChange();
      break;

    case UserConstants.USER_RESET_PASSWORD_FAILURE:
      resetPasswordSuccess = false;
      UserStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = UserStore;
