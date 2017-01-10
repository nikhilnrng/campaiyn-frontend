var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProfileConstants = require('../constants/ProfileConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var id;
var primaryEmail;
var displayName;
var firstName;
var lastName;
var profileImage;
var listings = [];

var ProfileStore = assign({}, EventEmitter.prototype, {

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
  getListings: function() {
    return listings;
  },

  getProfileImage: function() {
    return profileImage;
  },

  /* Handlers */
  handleUser: function(user) {
    id = user.id;
    primaryEmail = user.primaryEmail;
    displayName = user.displayName;
    firstName = user.firstName;
    lastName = user.lastName;
    if (user.hasOwnProperty('profileImage')) {
      profileImage = user.profileImage;
    } else {
      profileImage = {};
    }
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
    case ProfileConstants.PROF_USER_RECEIVED:
      ProfileStore.handleUser(action.user);
      ProfileStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = ProfileStore;
