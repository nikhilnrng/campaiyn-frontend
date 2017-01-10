var AppDispatcher = require('../dispatcher/AppDispatcher');
var CampaignConstants = require('../constants/CampaignConstants');

var CampaignActions = {

  /**
   * @param  {object} Campaign
   */
  newCampaignCreated: function(campaign) {
    AppDispatcher.dispatch({
      actionType: CampaignConstants.CAMPAIGN_CREATED,
      campaign: campaign
    });
  }
};

module.exports = CampaignActions;
