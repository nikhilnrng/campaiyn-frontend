var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProposalConstants = require('../constants/ProposalConstants');
var assign = require('object-assign');

const CHANGE_EVENT = 'change';
const RECEIVE_EVENT = 'receive';
const MESSAGES_PAGESIZE = 20; // This should be the same size as defined in MessageController

var proposal = null;
var senders = [];
var recipients = [];
var checkoutResponse;

// The messages associated with this proposal
var messages = [];

// The total number of messages that belong to this proposal
var totalNumberOfMessages = 0;

// Simple boolean to let view-controllers know whether their attempt to send a message failed
// TODO we may not want this to be a boolean, and rather an object, so we know what message failed
var messageAddError = false;

// Boolean to let view-controllers know whether attempt to get a new page of messages failed
var messageGetError = false;

var ProposalStore = assign({}, EventEmitter.prototype, {

  getProposal: function() {
    return proposal;
  },

  getSenders: function() {
    return senders;
  },

  getRecipients: function() {
    return recipients;
  },

  getTotalNumberOfMessages: function() {
    return totalNumberOfMessages;
  },

  getLatestMessage: function() {
    if (messages.length > 0) {
      return messages[messages.length - 1];
    }
    return null;
  },

  extractNewMessages: function(newMessages) {
    // Begin iteration from the end of the messages array, as most new message collisions will
    // occur there
    var latestOldMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      for (let j = newMessages.length - 1; j >= 0; j--) {
        if (messages[i].id === newMessages[j].id) {
          latestOldMessageIndex = j;
          break;
        }
      }
      // If we found a collision, remove all elements up to this index in the newMessages array
      // and return the remaining elements
      // We assume here messages are ordered in reverse-chronological order
      if (latestOldMessageIndex !== -1) {
        // we add one to the index since the second param takes in number of elements to remove
        newMessages.splice(0, latestOldMessageIndex + 1);
        return newMessages;
      }
    }
    return newMessages;
  },

  getMessages: function() {
    return messages;
  },

  /**
   * @return {number} The next page that needs to be loaded
   */
  getNextPage: function() {
    return Math.floor((messages.length / MESSAGES_PAGESIZE) + 1);
  },

  /**
   * @return {boolean} Whether there are any more messages left to load
   */
  moreMessagesAvailable: function() {
    if (totalNumberOfMessages > messages.length) {
      return true;
    }
    return false;
  },

  didMessageAddSucceed: function() {
    return !messageAddError;
  },

  didMessageGetSucceed: function() {
    return !messageGetError;
  },

  didCheckoutSucceed: function() {
    return (checkoutResponse && checkoutResponse.success);
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitReceive: function() {
    this.emit(RECEIVE_EVENT);
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
  addReceiveListener: function(callback) {
    this.on(RECEIVE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeReceiveListener: function(callback) {
    this.removeListener(RECEIVE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case ProposalConstants.PROPOSAL_CREATE_SUCCESS:
      proposal = action.proposal;
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_CREATE_FAILURE:
      proposal = null;
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_UPDATE_PRICE_SUCCESS:
      proposal = action.proposal;
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_UPDATE_PRICE_FAILURE:
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_UPDATE_STATUS_SUCCESS:
      proposal = action.proposal;
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_UPDATE_STATUS_FAILURE:
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_RECEIVED:
      proposal = action.proposal;
      senders = action.senders;
      recipients = action.recipients;
      ProposalStore.emitReceive();
      break;
    case ProposalConstants.PROPOSAL_ADD_MSG_SUCCESS:
      messages.unshift(action.message);
      totalNumberOfMessages++;
      messageAddError = false;
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_ADD_MSG_FAILURE:
      messageAddError = true;
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_GET_MSGS_SUCCESS:
      // If it's the first page being requested, simply set the values.
      // Otherwise check and make sure you only append the received messages if they're a new batch of messages
      if (action.page === 0 || action.page === 1) {
        messages = action.messages;
        totalNumberOfMessages = action.totalCount;
      } else if (messages.length === 0 || ProposalStore.moreMessagesAvailable()) {
        messages = messages.concat(ProposalStore.extractNewMessages(action.messages));
        totalNumberOfMessages = action.totalCount;
      }
      messageGetError = false;
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_GET_MSGS_FAILURE:
      messageGetError = true;
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_CHECKOUT_SUCCESS:
      checkoutResponse = action.response;
      ProposalStore.emitChange();
      break;
    case ProposalConstants.PROPOSAL_CHECKOUT_FAILURE:
      checkoutResponse = null;
      ProposalStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = ProposalStore;
