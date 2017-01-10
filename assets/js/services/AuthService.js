var AuthActions = require('../actions/AuthActions');

var AuthService = {

  login: function(email, password) {
    $.ajax({
      url: '/api/login',
      dataType: 'json',
      type: 'post',
      data: {
        primaryEmail: email,
        password: password
      },
      success: function(data) {
        AuthActions.userLoggedIn(data.user, data.token);
      },
      error: function(xhr, status, err) {
        AuthActions.userLoginFailed();
      }
    });
  },

  logout: function() {
    // Why call logout to the backend? The server handles
    // invalidating sessions and cookies
    $.ajax({
      url: '/api/logout',
      type: 'get',
      success: function(data) {
        AuthActions.userLoggedOut();
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
   * Checks to see if the user is authenticated. It is currently assumed the auth token is provide
   * via a cookie. Calls the AuthAction verifiedAuthStatus to denote whether the user is or is not
   * authenticated.
   */
  isAuthValid: function() {
    $.ajax({
      url: '/api/isAuthValid',
      type: 'get',
      success: function(data) {
        AuthActions.verifiedAuthStatus(data.authenticated);
      },
      error: function(xhr, status, err) {
        AuthActions.verifiedAuthStatus(false);
      }
    });
  },

  signup: function(data) {
    $.ajax({
      url: '/api/user',
      dataType: 'json',
      type: 'post',
      data: data,
      success: function() {
        AuthActions.userCreateSuccess();
      },
      error: function(xhr, status, err) {
        AuthActions.userCreateFailure();
        console.log(err);
      }
    });
  }

};

module.exports = AuthService;
