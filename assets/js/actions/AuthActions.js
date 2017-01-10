var AppDispatcher = require('../dispatcher/AppDispatcher');
var AuthConstants = require('../constants/AuthConstants');

var AuthActions = {

  /**
   * @param  {object} user
   * @param  {string} token
   */
  userLoggedIn: function(user, token) {
    AppDispatcher.dispatch({
      actionType: AuthConstants.AUTH_USER_LOGGED_IN,
      token: token,
      user: user
    });
  },

  userLoggedOut: function() {
    AppDispatcher.dispatch({
      actionType: AuthConstants.AUTH_USER_LOGGED_OUT
    });
  },

  verifiedAuthStatus: function(isUserAuthenticated) {
    AppDispatcher.dispatch({
      actionType: AuthConstants.AUTH_VERIFIED_STATUS,
      authenticated: isUserAuthenticated
    });
  },

  userCreateSuccess: function() {
    AppDispatcher.dispatch({
      actionType: AuthConstants.AUTH_USER_CREATE_SUCCESS
    });
  },

  userCreateFailure: function() {
    AppDispatcher.dispatch({
      actionType: AuthConstants.AUTH_USER_CREATE_FAILURE
    });
  },

  userLoginFailed: function() {
    AppDispatcher.dispatch({
      actionType: AuthConstants.AUTH_USER_LOGIN_FAIL
    });
  }

};

module.exports = AuthActions;
