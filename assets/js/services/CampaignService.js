var CampaignActions = require('../actions/CampaignActions');

var CampaignService = {

  /**
  * Simple function to create a new Campaign
  * @param title: the text to name the Campaign
  */
  createNewCampaign: function(title) {
    $.ajax({
      url: '/api/campaign',
      type: 'post',
      data: {
        title: title
      },
      success: function(data) {
        CampaignActions.newCampaignCreated(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  }

};

module.exports = CampaignService;
