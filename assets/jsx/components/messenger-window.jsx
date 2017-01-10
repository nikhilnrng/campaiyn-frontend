/* eslint react/no-did-mount-set-state: 0 */
/* eslint react/no-did-update-set-state: 0 */

import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import ProposalStore from '../../js/stores/ProposalStore';
import ProposalService from '../../js/services/ProposalService';
import MessengerMessage from '../components/messenger-message.jsx';
import MessengerMessagesGroup from '../components/messenger-messages-group.jsx';

// enumerated message states
var MessageState = {
  NO_MESSAGES: 0,
  INIT_MESSAGES_REQUESTED: 1,
  INIT_MESSAGES_RECEIVED: 2,
  MESSAGES_REQUESTED: 3,
  MESSAGES_RECEIVED: 4,
  MY_MESSAGE_RECEIVED: 5,
  OTHER_MESSAGE_RECEIVED: 6,
  MESSAGES_DISPLAYED: 7
};

/**
 * MessengerWindow displays an infinite window containing all the messages
 * that apply to a single proposal
 */
class MessengerWindow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      scrollHeight: 0,
      messageState: MessageState.NO_MESSAGES
    };
    ES6Utils.bind(
      this,
      'handleScroll',
      'scrollToBottom',
      'scrollToPrevious',
      'messagesReceived'
    );
  }

  render() {
    return (
      <div className="messenger-window">
        <div
          ref="messengerWindow"
          onScroll={this.handleScroll}
          className="messenger-messages-container">
          {this.createLoadingElement()}
          {this.createMessageElements()}
        </div>
      </div>
    );
  }

  componentDidMount() {
    ProposalStore.addChangeListener(this.messagesReceived);
    ProposalService.getMessages(this.props.proposalId, 1); // When a component mounts, we always want the first page
    this.setState({
      messageState: MessageState.INIT_MESSAGES_REQUESTED
    });
  }

  componentDidUpdate() {
    if (this.state.messageState === MessageState.INIT_MESSAGES_RECEIVED
      || this.state.messageState === MessageState.MY_MESSAGE_RECEIVED) {
      // scroll to bottom on initial message receive
      this.scrollToBottom();
      this.setState({
        messageState: MessageState.MESSAGES_DISPLAYED
      });
    } else if (this.state.messageState === MessageState.MESSAGES_RECEIVED) {
      // scroll to previous point on later message receives
      this.scrollToPrevious();
      this.setState({
        messageState: MessageState.MESSAGES_DISPLAYED
      });
    }
  }

  componentWillUnmount() {
    ProposalStore.removeChangeListener(this.messagesReceived);
  }

  /**
   * Update messages, messageState, and scrollHeight states when message is received
   */
  messagesReceived() {
    if (ProposalStore.didMessageGetSucceed()) {
      var messageState;
      var scrollHeight;
      var messengerWindow = this.refs.messengerWindow;
      // determine next message state
      // TODO Add case for OTHER_MESSAGE_RECEIVED message state
      if (this.state.messageState === MessageState.INIT_MESSAGES_REQUESTED) {
        messageState = MessageState.INIT_MESSAGES_RECEIVED;
      } else if (this.state.messageState === MessageState.MESSAGES_REQUESTED) {
        messageState = MessageState.MESSAGES_RECEIVED;
      } else {
        messageState = MessageState.MY_MESSAGE_RECEIVED;
      }
      // determine current max scrollTop value
      scrollHeight = messengerWindow.scrollHeight - messengerWindow.clientHeight;
      // update states
      this.setState({
        messages: ProposalStore.getMessages(),
        messageState: messageState,
        scrollHeight: scrollHeight
      });
    } else {
      // TODO deal with message get failure
    }
  }

  /**
   * Create loading element at top of window when messages are requested
   * @return {HTMLElement} loading element
   */
  createLoadingElement() {
    var loading;
    if (this.state.messageState === MessageState.MESSAGES_REQUESTED) {
      loading = (
        <div className="messenger-window-loading">
          <p>Loading...</p>
        </div>
      );
    } else {
      loading = null;
    }
    return loading;
  }

  /**
   * Create message elements in reverse order
   * @return {HTMLElement[]} Message elements
   */
  createMessageElements() {
    var messageKey = 0;
    var messageGroupKey = 0;
    var messages = [];
    var messagesGroup = [];
    var last = this.state.messages.length - 1;
    for (var i = last; i >= 0; i--) {
      // determine whether profile picture should be displayed next to message
      var isLastInGroup;
      if (i > 0) {
        // check if the next message was sent by the same user
        isLastInGroup = this.isMessageOwnerDifferent(
          this.state.messages[i],
          this.state.messages[i - 1]);
      } else {
        // default to true for most recent message
        isLastInGroup = true;
      }
      // unconditionally push current message to group
      messagesGroup.push(
        <MessengerMessage
          appearOnLeft={this.props.userId !== this.state.messages[i].createdBy}
          message={this.state.messages[i]}
          key={messageKey} />
      );
      messageKey++;
      // add group to messages array if last message in group received
      if (isLastInGroup) {
        messages.push(
          <MessengerMessagesGroup
            appearOnLeft={this.props.userId !== this.state.messages[i].createdBy}
            profileImage={this.getProfileImages(this.state.messages[i].createdBy)}
            key={messageGroupKey}>
            {messagesGroup}
          </MessengerMessagesGroup>
        );
        messagesGroup = [];
        messageGroupKey++;
        messageKey = 0;
      }
    }
    return messages;
  }

  /**
   * Get link to user profile image if available
   * @param {string} userId User id associated with a messages group
   * @return {string} link to profile image
   */
  getProfileImages(userId) {
    // return profile image from recipients
    var recipients = ProposalStore.getRecipients();
    for (let i = 0; i < recipients.length; i++) {
      if (userId === recipients[i].id && ("profileImage" in recipients[i])) {
        return recipients[i].profileImage;
      }
    }
    // return profile image from senders
    var senders = ProposalStore.getSenders();
    for (let i = 0; i < senders.length; i++) {
      if (userId === senders[i].id && ("profileImage" in senders[i])) {
        return senders[i].profileImage;
      }
    }
    // profile image not found
    return undefined;
  }

  /**
   * Load new page if user reaches top of messenger window and more messages are available
   * @param {ScrollEvent} e Synthetic event
   */
  handleScroll(e) {
    if (e.target.scrollTop === 0 && ProposalStore.moreMessagesAvailable()) {
      ProposalService.getMessages(this.props.proposalId, ProposalStore.getNextPage());
      this.setState({
        messageState: MessageState.MESSAGES_REQUESTED
      });
    }
  }

  /**
   * Set messenger window to bottom of scrollable area
   */
  scrollToBottom() {
    var messengerWindow = this.refs.messengerWindow;
    // bottom of scrollable area is the difference between the heights of the scrollable window and client div
    messengerWindow.scrollTop = messengerWindow.scrollHeight - messengerWindow.clientHeight;
  }

  /**
   * Set messenger window to previous scroll top position
   */
  scrollToPrevious() {
    var messengerWindow = this.refs.messengerWindow;
    var newScrollHeight = messengerWindow.scrollHeight - messengerWindow.clientHeight;
    // previous position is the difference between new scroll height and old scroll height
    messengerWindow.scrollTop = newScrollHeight - this.state.scrollHeight;
  }

  /**
   * Compare senders of two consecutive messages
   * @param {message} currentMessage Message currently being rendered
   * @param {message} nextMessage Next message to be rendered
   * @return {bool} true if next message sent by different owner than current message
   */
  isMessageOwnerDifferent(currentMessage, nextMessage) {
    return !(currentMessage.createdBy === nextMessage.createdBy);
  }
}

MessengerWindow.propTypes = {
  proposalId: React.PropTypes.string.isRequired,
  userId: React.PropTypes.string.isRequired
};

export default MessengerWindow;
