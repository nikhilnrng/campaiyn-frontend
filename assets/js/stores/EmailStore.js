var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var EmailConstants = require('../constants/EmailConstants');
var assign = require('object-assign');

var EMAIL_SUCCESS_EVENT = 'email_success';
var EMAIL_FAILURE_EVENT = 'email_failure';

var EmailStore = assign({}, EventEmitter.prototype, {

  emitChange: function(event) {
    this.emit(event);
  },

  /**
   * @param {function} callback
   */
  addEmailSuccessListener: function(callback) {
    this.on(EMAIL_SUCCESS_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  addEmailFailureListener: function(callback) {
    this.on(EMAIL_FAILURE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeEmailSuccessListener: function(callback) {
    this.removeListener(EMAIL_SUCCESS_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeEmailFailureListener: function(callback) {
    this.removeListener(EMAIL_FAILURE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case EmailConstants.CONTACT_US_SUCCESS:
      EmailStore.emitChange(EMAIL_SUCCESS_EVENT);
      break;
    case EmailConstants.CONTACT_US_FAILURE:
      EmailStore.emitChange(EMAIL_FAILURE_EVENT);
      break;

    default:
      // no op
  }
});

module.exports = EmailStore;
