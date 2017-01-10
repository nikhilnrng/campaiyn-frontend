
import React from 'react';
import {browserHistory} from 'react-router';
import ES6Utils from '../../js/utils/ES6Utils.js';
import ProposalService from '../../js/services/ProposalService';
import ProposalStore from '../../js/stores/ProposalStore';
import Color from '../../js/constants/Color';
import StandardButton from '../components/standard-button.jsx';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';

/**
* This component's purpose is to help a user get in touch with another user by
* helping initiate a conversation via email without sacrificing the recipient's
* contact information.
* Props required: listingId ~ The associated listing as the reason for communicating
*/
export default class StartConversationDialog extends React.Component {

  constructor(props) {
    super(props);
    ES6Utils.bind(
      this,
      'handleClose',
      'handleProps',
      'onSendButtonClicked',
      'handleProposalStoreChange'
    );
    this.state = {
      open: props.open,
      listingId: props.listingId,
      errorText: null,
      sendButtonDisabled: false,
      modal: false
    };
  }

  componentDidMount() {
    ProposalStore.addChangeListener(this.handleProposalStoreChange);
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps);
  }

  componentWillUnmount() {
    ProposalStore.removeChangeListener(this.handleProposalStoreChange);
  }

  render() {
    var errorTextElement = null;
    if (this.state.errorText !== null) {
      errorTextElement = <p style={{color: Color.FAILURE_PRIMARY}}>{this.state.errorText}</p>;
    }
    const containerStyle = {
      display: 'inline-block',
      textAlign: 'center',
      paddingTop: '10px',
      width: '100%'
    };
    const contentStyle = {
      margin: '0 auto',
      maxWidth: '600px'
    };
    const titleStyle = {
      textAlign: 'center'
    };
    const messageTextFieldStyle = {
      width: '75%',
      textAlign: 'left'
    };
    const hintStyle = {
      verticalAlign: 'top'
    };
    return (
      <Dialog
        title="Start Conversation"
        contentStyle={contentStyle}
        titleStyle={titleStyle}
        ref="startConversationDialog"
        autoScrollBodyContent={true}
        onRequestClose={this.handleClose}
        modal={this.state.modal}
        open={this.state.open}
        style={containerStyle}>
        {errorTextElement}
        <div>
          <TextField
            style={messageTextFieldStyle}
            floatingLabelText="Campaign Details"
            hintText="Tell us about your campaign"
            hintStyle={hintStyle}
            ref="messageTextField"
            rows={3}
            rowsMax={4}
            multiLine={true} />
        </div>
        <div>
          <StandardButton
            label="Send"
            onMouseUp={this.onSendButtonClicked}
            disabled={this.state.sendButtonDisabled} />
        </div>
      </Dialog>
    );
  }

  /* Everything after render() is a non-React lifecycle function */

  handleClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
    this.setState({
      open: false,
      errorText: null,
      sendButtonDisabled: false,
      modal: false
    });
  }

  handleProps(props) {
    this.setState({
      open: props.open,
      listingId: props.listingId
    });
  }

  /**
   * When the 'Send' button is clicked, this function is triggered. This callback triggers a
   * Proposal Create call, and sets up the dialog to reflect a loading state.
   */
  onSendButtonClicked() {
    var message = this.refs.messageTextField.getValue();
    if (message.length > 0) {
      this.setState({
        sendButtonDisabled: true,
        modal: true
      });
      ProposalService.createProposal(this.state.listingId, message);
    }
  }

  /**
   * Whenever the ProposalStore emits a change event, this function handles any changes accordingly
   */
  handleProposalStoreChange() {
    // If a Proposal was not successfully created, notify the user that there was an issue sending
    // the message.
    // Otherwise, go to the proposal page
    if (ProposalStore.getProposal() === null) {
      this.setState({
        errorText: 'Your message could not be sent. Please try again.',
        sendButtonDisabled: false,
        modal: false
      });
    } else {
      browserHistory.push('/proposal/' + ProposalStore.getProposal().id);
    }
  }
}

StartConversationDialog.propTypes = {
  listingId: React.PropTypes.string.isRequired,
  open: React.PropTypes.bool,
  onClose: React.PropTypes.func
};

StartConversationDialog.defaultProps = {
  open: false
};
