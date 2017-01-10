var EmailActions = require('../actions/EmailActions');

var EmailService = {
  contactUs: function(name, email, subject, message) {
    $.ajax({
      url: '/api/email/contact',
      type: 'post',
      data: {
        name: name,
        email: email,
        subject: subject,
        message: message
      },
      success: function(data) {
        EmailActions.contactUsSuccess();
      },
      error: function(xhr, status, err) {
        console.log(err);
        EmailActions.contactUsFailure();
      }
    });
  }
};

module.exports = EmailService;
