var ProposalActions = require('../actions/ProposalActions');

var ProposalService = {

  /**
  * Simple function to create a new Proposal
  * @param proposedListing The listing associated with this Proposal
  * @param message The initial message the user wants to send with this Proposal
  */
  createProposal: function(proposedListing, message) {
    var formData = {
      proposedListing: proposedListing,
      message: message
    };
    $.ajax({
      url: '/api/proposal',
      dataType: 'json',
      type: 'post',
      data: formData,
      success: function(data) {
        ProposalActions.proposalCreateSuccess(data);
      },
      error: function(xhr, status, err) {
        var error = {
          error: err
        };
        ProposalActions.proposalCreateFailure(error);
        console.log(err);
      }
    });
  },

  /**
  * Gets the basic information about a Proposal with the specified id.
  * @param id The id of the proposal to search for
  */
  getProposalById: function(id) {
    $.ajax({
      url: '/api/proposal/' + id,
      dataType: 'json',
      type: 'get',
      success: function(data) {
        ProposalActions.getProposalReceived(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  /**
  * Updates specified Proposal with a new price.
  * @param id The id of the proposal to update
  * @param newPrice The new value Proposal's 'price' attribute should have
  */
  updatePrice: function(id, newPrice) {
    $.ajax({
      url: '/api/proposal/' + id + '/price',
      dataType: 'json',
      type: 'put',
      data: {
        price: newPrice
      },
      success: function(data) {
        ProposalActions.updatePriceSuccess(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
        ProposalActions.updatePriceFailure();
      }
    });
  },

  /**
  * Updates specified Proposal by updating the user's confirmation status.
  * @param id The id of the proposal to update
  * @param confirmationStatus Whether the user is confirming or cancelling his confirmation of the
  *         Proposal.
  */
  updateConfirmationStatus: function(id, confirmationStatus) {
    $.ajax({
      url: '/api/proposal/' + id + '/status',
      dataType: 'json',
      type: 'put',
      data: {
        status: confirmationStatus
      },
      success: function(data) {
        ProposalActions.updateStatusSuccess(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
        ProposalActions.updateStatusFailure();
      }
    });
  },

  /**
  * Provided a reference to a proposal and some text, this function posts a new message
  *   to the specified proposal.
  * @param proposalId The handle to a proposal
  * @param text The message body
  */
  addMessage: function(proposalId, text) {
    $.ajax({
      url: '/api/proposal/' + proposalId + '/messages',
      data: {
        text: text
      },
      type: 'post',
      success: function(data) {
        ProposalActions.addMessageSuccess(data);
      },
      error: function(xhr, status, err) {
        console.log(err);
        ProposalActions.addMessageFailure();
      }
    });
  },

  /**
  * Provided a reference to a proposal and some text, this function posts a new message
  *   to the specified proposal.
  * @param proposalId The handle to a proposal
  * @param page Messages are paginated, and therefore, to receive more messages, subsequent page
  *   numbers need to be provided.
  */
  getMessages: function(proposalId, page) {
    if (!page || page <= 0) {
      page = 1;
    }
    $.ajax({
      url: '/api/proposal/' + proposalId + '/messages?page=' + page,
      type: 'get',
      success: function(data) {
        ProposalActions.getMessagesSuccess(data, page);
      },
      error: function(xhr, status, err) {
        console.log(err);
        ProposalActions.getMessagesFailure();
      }
    });
  },

  /**
   * @param proposalId The id of the proposal to checkout
   * @param nonce Payment method nonce
   */
  checkout: function(proposalId, nonce) {
    $.ajax({
      url: '/api/proposal/' + proposalId + '/checkout',
      data: {
        nonce: nonce
      },
      type: 'post',
      success: function(data) {
        ProposalActions.checkoutSuccess(data);
      },
      error: function(xhr, status, err) {
        ProposalActions.checkoutFailure();
        console.log(err);
      }
    });
  }
};

module.exports = ProposalService;
