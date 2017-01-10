/* global FormData: false */
var UserActions = require('../actions/UserActions');
var ProfileActions = require('../actions/ProfileActions');

var UserService = {

  /**
  * Gets the basic information about the current User.
  */
  getMe: function() {
    $.ajax({
      url: '/api/user/me',
      dataType: 'json',
      type: 'get',
      success: function(data) {
        UserActions.getMeReceived(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
  * Gets the basic information about a User with the specified id.
  * @param id The id of the user to search for
  */
  getUserById: function(id) {
    $.ajax({
      url: '/api/user/' + id,
      dataType: 'json',
      type: 'get',
      success: function(data) {
        ProfileActions.getUserReceived(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
  * Uploads an image as the current user's profile picture.
  * @param file The image file to upload
  */
  uploadProfileImage: function(file) {
    var formData = new FormData();
    formData.append('image', file);
    $.ajax({
      url: '/api/user/image',
      dataType: 'json',
      data: formData,
      processData: false,
      contentType: false,
      type: 'post',
      success: function(data) {
        console.log(data);
        UserActions.userAddedPhoto(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
  * Attempts to verify a user corresponding with a verify token.
  * @param verifyToken The token by which to identify the user.
  */
  verifyUser: function(verifyToken) {
    $.ajax({
      url: '/api/user/verify/' + verifyToken,
      dataType: 'json',
      type: 'put',
      success: function(user) {
        UserActions.userVerifySuccess(user);
      },
      error: function(xhr, status, err) {
        console.log(err);
        UserActions.userVerifyFailure();
      }
    });
  },

  /**
  * Gets the listings of the user with the specified id.
  */
  getUserListings: function(id) {
    var userData = {
      userId: id
    };
    $.ajax({
      url: '/api/user/' + id + '/listings',
      dataType: 'json',
      type: 'get',
      data: userData,
      success: function(data) {
        UserActions.userListingsSuccess(data.listings);
      },
      error: function(xhr, status, err) {
        UserActions.userListingsFailure();
        console.log(err);
      }
    });
  },

  /**
  * Gets the listings of the user with the specified id.
  */
  getMyListings: function() {
    $.ajax({
      url: '/api/user/me/listings',
      dataType: 'json',
      type: 'get',
      success: function(data) {
        UserActions.userListingsSuccess(data.listings);
      },
      error: function(xhr, status, err) {
        UserActions.userListingsFailure();
        console.log(err);
      }
    });
  },

  /**
  * Gets the incoming proposals of the user
  */
  getIncomingProposals: function() {
    $.ajax({
      url: '/api/user/me/proposals/incoming',
      dataType: 'json',
      type: 'get',
      success: function(data) {
        UserActions.userIncomingProposalSuccess(data);
      },
      error: function(xhr, status, err) {
        UserActions.userIncomingProposalFailure();
      }
    });
  },

  /**
  * Gets the outgoing proposals of the user
  */
  getOutgoingProposals: function() {
    $.ajax({
      url: '/api/user/me/proposals/outgoing',
      dataType: 'json',
      type: 'get',
      success: function(data) {
        UserActions.userOutgoingProposalSuccess(data);
      },
      error: function(xhr, status, err) {
        UserActions.userOutgoingProposalFailure();
      }
    });
  },

  /**
   * Creates a Braintree sub-merchant for the current User.
   * @param merchantData the current User's payment information.
   */
  createSubMerchant: function(merchantData) {
    $.ajax({
      url: '/api/user/me/createSubMerchant',
      dataType: 'json',
      type: 'post',
      data: merchantData,
      success: function(data) {
        UserActions.userMerchantCreateSuccess(data);
      },
      error: function(xhr, status, err) {
        UserActions.userMerchantCreateFailure();
      }
    });
  },

  /**
   * Updates user data
   */
  updateUser: function(firstName, lastName) {
    var userData = {
      firstName: firstName,
      lastName: lastName
    };
    $.ajax({
      url: '/api/user/me',
      type: 'put',
      dataType: 'json',
      data: userData,
      success: function(response) {
        UserActions.userUpdated(response);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
   * Reset user password
   */
  resetPassword: function(oldPassword, newPassword) {
    var passwordData = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };
    $.ajax({
      url: '/api/user/me/password',
      type: 'put',
      data: passwordData,
      success: function(response) {
        UserActions.userResetPasswordSuccess();
      },
      error: function(xhr, status, err) {
        console.log(err);
        UserActions.userResetPasswordFailure();
      }
    });
  }

};

module.exports = UserService;
