import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import ProposalService from '../../js/services/ProposalService';

/**
 * MessengerField is a text field that allows a user to submit a
 * message in the messenger component
 */
class MessengerField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isShiftDown: false
    };
    ES6Utils.bind(
      this,
      'handleChange',
      'handleKeyDown',
      'handleKeyUp',
      'handleSubmit',
      'clearTextField',
      'isMessageEmpty'
    );
  }

  render() {
    return (
      <div className="messenger-field">
        <div className="messenger-field-textarea-container">
          <textarea
            placeholder="Type a message..."
            value={this.state.value}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
            onKeyDown={this.handleKeyDown} />
        </div>
      </div>
    );
  }

  /**
   * Change the value state of the text field
   * @param {ChangeEvent} e Synthetic event
   */
  handleChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  /**
   * Handle key down on the text field
   * @param {KeyDownEvent} e Synthetic event
   */
  handleKeyDown(e) {
    // ENTER key code is 13
    if (e.keyCode === 13) {
      if (!this.state.isShiftDown) {
        e.preventDefault(); // prevent extra newline
        if (this.isMessageEmpty(this.state.value)) {
          return; // return if no message entered
        }
        this.handleSubmit();
      }
    // SHIFT key code is 16
    } else if (e.keyCode === 16) {
      this.setState({
        isShiftDown: true
      });
    }
  }

  /**
   * Handle key up on the text field
   * @param {KeyUpEvent} e Synthetic event
   */
  handleKeyUp(e) {
    if (e.keyCode === 16) {
      this.setState({
        isShiftDown: false
      });
    }
  }

  /**
   * Add message to proposal object
   * @param {SubmitEvent} e Synthetic event
   */
  handleSubmit(e) {
    var message = this.state.value.trim();
    if (message !== '') {
      ProposalService.addMessage(this.props.proposalId, message);
      this.clearTextField();
    }
  }

  /**
   * Clear the text field by setting the value to empty
   */
  clearTextField() {
    this.setState({
      value: ''
    });
  }

  /**
   * Return true if received string is empty
   * @param {string} str String to be checked
   */
  isMessageEmpty(str) {
    return str === '';
  }
}

MessengerField.propTypes = {
  proposalId: React.PropTypes.string.isRequired
};

export default MessengerField;
