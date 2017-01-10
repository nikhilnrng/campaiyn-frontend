// Default Import Statements
const React = require('react');
import {browserHistory} from 'react-router';
const history = browserHistory;
import StandardButton from './standard-button.jsx';
const TextField = require('material-ui/lib/text-field');
const Dialog = require('material-ui/lib/dialog');
const AuthStore = require('../../js/stores/AuthStore');
const AuthService = require('../../js/services/AuthService');

var LoginDialog = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      open: false,
      loginFailed: false
    };
  },

  componentDidMount: function() {
    AuthStore.addChangeListener(this._onSuccessfulLogin);
    AuthStore.addFailListener(this._onFailedLogin);
  },

  componentWillUnmount: function() {
    AuthStore.removeChangeListener(this._onSuccessfulLogin);
    AuthStore.removeFailListener(this._onFailedLogin);
  },

  _pressEnter: function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this._submitTouchTap();
    }
  },

  _onSuccessfulLogin: function() {
    this.setState({open: false});
    this.props.closeLogin();
  },

  _onFailedLogin: function() {
    this.setState({loginFailed: true});
  },

  _closeLoginFailedDialog: function() {
    this.setState({loginFailed: false});
  },

  render: function() {
    const containerStyle = {
      display: 'inline-block',
      textAlign: 'center',
      zIndex: '15'
    };

    const buttonStyle = {
      width: '256px',
      marginTop: '30px'
    };

    const contentStyle = {
      width: '430px'
    };

    const loginFailedContentStyle = {
      marginTop: '-150px'
    };

    return (
      <div className={"login-dialog"}>
        <Dialog
          title="Login"
          id="login"
          ref="loginDialog"
          autoScrollBodyContent={true}
          onRequestClose={this._closeLogin}
          open={this.state.open}
          style={containerStyle}
          contentStyle={contentStyle}>
            <Dialog
              title="Login Failed"
              ref="loginFail"
              style={containerStyle}
              contentStyle={loginFailedContentStyle}
              open={this.state.loginFailed}
              onRequestClose={this._closeLoginFailedDialog}>
              <StandardButton
                label="Okay" primary={true} onTouchTap={this._closeLoginFailedDialog} />
            </Dialog>
            <div>
              <TextField
                onKeyDown={this._pressEnter}
                hintText="Email Field"
                floatingLabelText="Email"
                ref="email" />
            </div>
            <div>
              <TextField
                onKeyDown={this._pressEnter}
                hintText="Password"
                type="password"
                ref="password"/>
            </div>
            <div>
              <StandardButton
                label="Login"
                style={buttonStyle}
                tertiary={true}
                onTouchTap={this._submitTouchTap}/>
            </div>
          <br /><hr />
          <div className={"signup"}>
            Don&#39;t have an account?
            <a href="#" onClick={this._handleSignupClick}> Sign up here</a>
          </div>
        </Dialog>
      </div>
    );
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.openLogin) {
      this.setState({
        open: true
      });
    }
  },

  _handleSignupClick: function(e) {
    e.preventDefault();
    this._closeLogin();
    history.push('/signup');
  },

  _submitTouchTap: function() {
    var primaryEmail = this.refs.email.getValue();
    var password = this.refs.password.getValue();
    AuthService.login(primaryEmail, password);
  },

  _closeLogin: function() {
    this.setState({
      open: false,
      loginFailed: false
    });
    this.props.closeLogin(true);
  }
});

module.exports = LoginDialog;
