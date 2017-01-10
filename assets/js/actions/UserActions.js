var AppDispatcher = require('../dispatcher/AppDispatcher');
var UserConstants = require('../constants/UserConstants');

var UserActions = {

  /**
   * @param  {object} User
   */
  getMeReceived: function(user) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_GET_ME_RECEIVED,
      user: user
    });
  },

  /**
   * @param  {object} User
   */
  userVerifySuccess: function(user) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_VERIFY_SUCCESS,
      user: user
    });
  },

  userVerifyFailure: function() {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_VERIFY_FAILURE
    });
  },

  userAddedPhoto: function(user) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_UPLOAD_PHOTO,
      user: user
    });
  },

  userListingsSuccess: function(listings) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_LISTINGS_SUCCESS,
      listings: listings
    });
  },

  userListingsFailure: function() {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_LISTINGS_FAILURE
    });
  },

  userIncomingProposalSuccess: function(proposals) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_INCOMING_PROPOSALS_SUCCESS,
      proposals: proposals
    });
  },

  userIncomingProposalFailure: function() {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_INCOMING_PROPOSALS_FAILURE
    });
  },

  userOutgoingProposalSuccess: function(proposals) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_OUTGOING_PROPOSALS_SUCCESS,
      proposals: proposals
    });
  },

  userOutgoingProposalFailure: function() {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_OUTGOING_PROPOSALS_FAILURE
    });
  },

  userMerchantCreateSuccess: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_MERCHANT_CREATE_SUCCESS,
      response: response
    });
  },

  userMerchantCreateFailure: function() {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_MERCHANT_CREATE_FAILURE
    });
  },

  userUpdated: function(user) {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_UPDATE_SUCCESS,
      user: user
    });
  },

  userResetPasswordSuccess: function() {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_RESET_PASSWORD_SUCCESS
    });
  },

  userResetPasswordFailure: function() {
    AppDispatcher.dispatch({
      actionType: UserConstants.USER_RESET_PASSWORD_FAILURE
    });
  }
};

module.exports = UserActions;
