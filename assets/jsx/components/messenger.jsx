import React from 'react';
import MessengerField from '../components/messenger-field.jsx';
import MessengerWindow from '../components/messenger-window.jsx';

/**
 * Messenger renders a messaging component that allows a recipient and
 * a sender to communicate with each other during a proposal
 */
class Messenger extends React.Component {
  render() {
    return (
      <div className="messenger">
        <div className="messenger-window-container">
          <MessengerWindow
            proposalId={this.props.proposalId}
            userId={this.props.userId} />
        </div>
        <div className="messenger-message-field-container">
          <MessengerField proposalId={this.props.proposalId} />
        </div>
      </div>
    );
  }
}

Messenger.propTypes = {
  proposalId: React.PropTypes.string.isRequired,
  userId: React.PropTypes.string.isRequired
};

export default Messenger;
