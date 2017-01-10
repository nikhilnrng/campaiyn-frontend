var AppDispatcher = require('../dispatcher/AppDispatcher');
var EmailConstants = require('../constants/EmailConstants');

var EmailActions = {
  contactUsSuccess: function() {
    AppDispatcher.dispatch({
      actionType: EmailConstants.CONTACT_US_SUCCESS
    });
  },

  contactUsFailure: function() {
    AppDispatcher.dispatch({
      actionType: EmailConstants.CONTACT_US_FAILURE
    });
  }
};

module.exports = EmailActions;
