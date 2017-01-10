const React = require('react');
const Paper = require('material-ui/lib/paper');
const Avatar = require('material-ui/lib/avatar');

const Message = React.createClass({

  render: function() {
    const msgStyle = {
      width: '400px',
      height: '150px'
    };

    return (
      <div className={"message-proposal"}>
        {/* These are custom class names, when this component is used in the proposal message box
          we will pass in which user this message box belongs to. if it is a sender the box will
          float right, if it is the reciever it will float left */}
        <Avatar
          size={65}
          className={this.props.thisUser + "-pic"}
          src={"../../images/view-proposal/" + this.props.user + ".jpg"} />
        <Paper zDepth={3} style={msgStyle} className={this.props.thisUser + "-message"}></Paper>
      </div>
    );
  }
});

module.exports = Message;
