var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AuthConstants = require('../constants/AuthConstants');
var CookieUtils = require('../utils/CookieUtils');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var FAIL_EVENT = 'fail';

// Keep track of the authenticated user and her token via cookies
// Counter is only changed when the user attempts a login
// This is to differentiates itself from the user logout because both services will emit a change
// In the future counter can be used to keep track of a user's login attempts
// Value is to ensure that the changes emitted by a successful login does not trigger the signup dialog to appear
var user;

var userCreateError;

var AuthStore = assign({}, EventEmitter.prototype, {

  isLoggedIn: function() {
    if (CookieUtils.getCookie('jwtAuthorization') === null) {
      return false;
    }
    return true;
  },

  getUserId: function() {
    return user.id;
  },

  didUserCreateFail() {
    return userCreateError;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitFail: function() {
    this.emit(FAIL_EVENT);
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

  addFailListener: function(callback) {
    this.on(FAIL_EVENT, callback);
  },

  removeFailListener: function(callback) {
    this.removeListener(FAIL_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AuthConstants.AUTH_USER_LOGGED_IN:
      user = action.user;
      userCreateError = undefined;
      AuthStore.emitChange();
      break;
    case AuthConstants.AUTH_USER_LOGGED_OUT:
      user = undefined;
      userCreateError = undefined;
      AuthStore.emitChange();
      break;
    case AuthConstants.AUTH_USER_CREATE_SUCCESS:
      userCreateError = false;
      AuthStore.emitChange();
      break;
    case AuthConstants.AUTH_USER_CREATE_FAILURE:
      userCreateError = true;
      AuthStore.emitChange();
      break;
    case AuthConstants.AUTH_USER_LOGIN_FAIL:
      userCreateError = undefined;
      AuthStore.emitFail();
      break;
    case AuthConstants.AUTH_VERIFIED_STATUS:
      // the backend policy, hasAuthorizedToken, should have updated the auth cookie accordingly
      userCreateError = undefined;
      AuthStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = AuthStore;
