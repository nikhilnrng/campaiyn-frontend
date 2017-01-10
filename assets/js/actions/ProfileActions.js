var AppDispatcher = require('../dispatcher/AppDispatcher');
var ProfileConstants = require('../constants/ProfileConstants');

var ProfileActions = {

  /**
   * @param  {object} User
   */
  getUserReceived: function(user) {
    AppDispatcher.dispatch({
      actionType: ProfileConstants.PROF_USER_RECEIVED,
      user: user
    });
  }

};

module.exports = ProfileActions;
