var AppDispatcher = require('../dispatcher/AppDispatcher');
var ProposalConstants = require('../constants/ProposalConstants');

var ProposalActions = {

  proposalCreateSuccess: function(proposal) {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_CREATE_SUCCESS,
      proposal: proposal
    });
  },

  proposalCreateFailure: function(error) {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_CREATE_FAILURE,
      error: error
    });
  },

  updatePriceSuccess: function(proposal) {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_UPDATE_PRICE_SUCCESS,
      proposal: proposal
    });
  },

  updatePriceFailure: function() {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_UPDATE_PRICE_FAILURE
    });
  },

  updateStatusSuccess: function(proposal) {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_UPDATE_STATUS_SUCCESS,
      proposal: proposal
    });
  },

  updateStatusFailure: function() {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_UPDATE_STATUS_FAILURE
    });
  },

  getProposalReceived: function(proposal) {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_RECEIVED,
      proposal: proposal,
      senders: proposal.senders,
      recipients: proposal.recipients
    });
  },

  addMessageSuccess: function(message) {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_ADD_MSG_SUCCESS,
      message: message
    });
  },

  addMessageFailure: function() {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_ADD_MSG_FAILURE
    });
  },

  getMessagesSuccess: function(data, page) {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_GET_MSGS_SUCCESS,
      messages: data.messages,
      totalCount: data.totalCount,
      next: data.next,
      previous: data.previous,
      page: page
    });
  },

  getMessagesFailure: function() {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_GET_MSGS_FAILURE
    });
  },

  checkoutSuccess: function(response) {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_CHECKOUT_SUCCESS,
      response: response
    });
  },

  checkoutFailure: function(response) {
    AppDispatcher.dispatch({
      actionType: ProposalConstants.PROPOSAL_CHECKOUT_FAILURE
    });
  }
};

module.exports = ProposalActions;
