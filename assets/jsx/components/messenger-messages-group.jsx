import React from 'react';

/**
 * MessengerMessagesGroup is a wrapper for groups of messages sent by the same user
 */
class MessengerMessagesGroup extends React.Component {

  render() {
    return (
      <div className="messenger-messages-group-container">
        <div className="messenger-messages-group-user-avatar">
          <img
            className={this.getPositionClass()}
            src={this.props.profileImage} />
        </div>
        <div className={this.mergeClassNames("messenger-messages-group", this.getPositionClass())}>
          {this.props.children}
        </div>
      </div>
    );
  }

  /**
   * Return an class name based on expected messages group positioning
   */
  getPositionClass() {
    return this.props.appearOnLeft
      ? 'messenger-messages-group-left'
      : 'messenger-messages-group-right';
  }

  /**
   * Merge multiple class names into one string
   */
  mergeClassNames(...classNames) {
    return classNames.join(' ');
  }
}

MessengerMessagesGroup.propTypes = {
  appearOnLeft: React.PropTypes.bool.isRequired,
  profileImage: React.PropTypes.string,
  children: React.PropTypes.array
};

MessengerMessagesGroup.defaultProps = {
  profileImage: '/images/avatar-default.svg'
};

export default MessengerMessagesGroup;
