import React from 'react';

/**
 * MessengerMessage displays a single message in the messenger view
 */
class MessengerMessage extends React.Component {

  render() {
    const whiteSpaceStyle = {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word'
    };
    return (
      <div className="messenger-message-container">
        <div className="messenger-message">
          <div className={this.mergeClassNames("messenger-message-box", this.getFloatClass())}>
            <div className="messenger-message-text">
              <p style={whiteSpaceStyle}>
                {this.props.message.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Return float class based on expected message positioning
   */
  getFloatClass() {
    return this.props.appearOnLeft
      ? 'messenger-message-box-left'
      : 'messenger-message-box-right';
  }

  /**
   * Merge multiple class names into one string
   */
  mergeClassNames(...classNames) {
    return classNames.join(' ');
  }
}

MessengerMessage.propTypes = {
  appearOnLeft: React.PropTypes.bool.isRequired,
  message: React.PropTypes.object.isRequired
};

export default MessengerMessage;
