const React = require('react');
const TextField = require('material-ui/lib/text-field');
import StandardButton from '../components/standard-button.jsx';

var EmailService = require('../../js/services/EmailService');

// Contact Us Class code
const ContactPage = React.createClass({
  render: function() {
    const spacingStyle = {
      margin: '10px'
    };

    const inputStyle = {
      width: '532px',
      textAlign: 'left'
    };

    return (
      <div className={"contact-container"}>
        <h1>Contact Us</h1>
        <form>
          <TextField hintText="Name" style={spacingStyle} ref="name"/>
          <TextField hintText="Email" style={spacingStyle} ref="email"/><br />
          <TextField hintText="Subject" style={inputStyle} ref="subject"/><br />
          <TextField
            floatingLabelText="Message"
            style={inputStyle}
            rows={6}
            multiLine={true}
            ref="message"/><br />
          <br />
          <StandardButton label="Send" style={spacingStyle} onMouseUp={this._handleSend} />
        </form>
        <br />
        <br />
      </div>
    );
  },

  _handleSend: function() {
    var name = this.refs.name.getValue();
    var email = this.refs.email.getValue();
    var subject = this.refs.subject.getValue();
    var message = this.refs.message.getValue();
    EmailService.contactUs(name, email, subject, message);
  }
});

module.exports = ContactPage;
