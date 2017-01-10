// Default Import Statements
const React = require('react');
import {browserHistory} from 'react-router';
const history = browserHistory;

// Material UI Import Statements
const CircularProgress = require('material-ui/lib/circular-progress');

// Flux Services
const UserService = require('../../js/services/UserService');
const UserStore = require('../../js/stores/UserStore');
const AuthStore = require('../../js/stores/AuthStore');

const NetworkStateEnum = {
  OFF: 0,
  RUNNING: 1
};

/**
 * The page a user arrives at when attempting to verify their account.
 */
const VerifyPage = React.createClass({

  getInitialState: function() {
    return {
      networkState: NetworkStateEnum.RUNNING
    };
  },

  componentWillMount: function() {
    if (AuthStore.isLoggedIn()) {
      // TODO redirect to forbidden/not found page if not the user's verifyToken
      history.push('/proposals');
    }
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._handleVerificationResponse);
    UserService.verifyUser(this.props.params.verifyToken);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._handleVerificationResponse);
  },

  render: function() {
    var containerStyle = {
      height: '300px',
      textAlign: 'center',
      margin: '100px'
    };

    var progressStyle = {
      display: 'inline-block'
    };

    if (this.state.networkState === NetworkStateEnum.RUNNING) {
      return (
        <div style={containerStyle}>
          <h1>Finding your account...</h1>
          <CircularProgress
            mode="indeterminate"
            size={1.5}
            style={progressStyle}/>
        </div>
      );
    }
    return (
      <div style={containerStyle}>
        <h1>{this.state.message}</h1>
      </div>
    );
  },

  _handleVerificationResponse: function() {
    var message = 'Sorry, but we could not verify your account. \
                  Please double check the URL sent to your email.';
    // If an id does exist, we successfully verified a user account.
    if (UserStore.getId()) {
      message = 'Welcome ' + UserStore.getFirstName() + '! You have successfully\
                  verified your account. Finish up by logging into your account.';
    }
    this.setState({
      networkState: NetworkStateEnum.OFF,
      message: message
    });
  }

});

module.exports = VerifyPage;
