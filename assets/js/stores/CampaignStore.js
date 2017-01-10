var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CampaignConstants = require('../constants/CampaignConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var campaign;

var CampaignStore = assign({}, EventEmitter.prototype, {

  getCampaign: function() {
    return campaign;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case CampaignConstants.CAMPAIGN_CREATED:
      campaign = action.campaign;
      CampaignStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = CampaignStore;
