var BraintreeService = {
  generateClientToken: function(cb) {
    $.ajax({
      url: '/api/braintree/token',
      dataType: 'json',
      type: 'get',
      success: function(data) {
        cb(null, data.token);
      },
      error: function(xhr, status, err) {
        console.log(err);
        cb(err, null);
      }
    });
  }
};

module.exports = BraintreeService;
