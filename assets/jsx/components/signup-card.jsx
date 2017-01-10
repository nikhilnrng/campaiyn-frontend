/* global alert: false */
import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils';
import Color from '../../js/constants/Color';
import LoginDialog from './login-dialog.jsx';
import StandardButton from './standard-button.jsx';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import AuthStore from '../../js/stores/AuthStore';
import AuthService from '../../js/services/AuthService';
import {browserHistory, Link} from 'react-router';
const history = browserHistory;

var emailIsValid = false;
var passwordIsValid = false;
var firstNameIsValid = false;
var lastNameIsValid = false;

// This counter helps control whether or not an error text will be displayed on the confirm password
// If a user types in a string into the confirm password input field, and the original password
// field is blank, there should not be an error text
var counter = [false];

class SignupCard extends React.Component {
  constructor(props) {
    super(props);
    ES6Utils.bind(
      this,
      'handleErrorInputForfName',
      'handleErrorInputForlName',
      'handleErrorInputForEmail',
      'handleErrorInputForPass',
      'setPassToken',
      'submitTouchTap',
      'handleAuthStoreChange',
      'routeToHomePage',
      'handleLogin',
      'handleLoginClose'
    );
    this.state = {
      // openLoginDialog is changed when the user wants to open the login dialog from the signup card
      openLoginDialog: false,
      // success is changed when a user successfully creates an account. This causes a dialog to appear tha re-routes
      // the user to the homepage and tells the user to verify his account with his email
      userCreateSuccess: false,
      disabled: false,
      userCreateFailed: false,
      firstNameErrorText: '',
      lastNameErrorText: '',
      emailErrorText: '',
      confirmPasswordErrorText: ''
    };
  }

  handleErrorInputForfName() {
    var name = this.refs.fname.getValue();
    var re = /^[a-zA-Z]+$/;
    var minFirstNameCharCount = 0;
    if (name.length > minFirstNameCharCount) {
      if (re.test(name)) {
        this.setState({
          firstNameErrorText: ''
        });
        firstNameIsValid = true;
      } else {
        this.setState({
          firstNameErrorText: 'Please input a valid first name'
        });
        firstNameIsValid = false;
      }
    } else {
      this.setState({
        firstNameErrorText: ''
      });
      firstNameIsValid = false;
    }
  }

  handleErrorInputForlName() {
    var name = this.refs.lname.getValue();
    var re = /^[a-zA-Z]+$/;
    var minLastNameCharCount = 0;
    if (name.length > minLastNameCharCount) {
      if (re.test(name)) {
        this.setState({
          lastNameErrorText: ''
        });
        lastNameIsValid = true;
      } else {
        this.setState({
          lastNameErrorText: 'Please input a valid last name'
        });
        lastNameIsValid = false;
      }
    } else {
      this.setState({
        lastNameErrorText: ''
      });
      lastNameIsValid = false;
    }
  }

  handleErrorInputForEmail() {
    // javascript regular expression for valid email string
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var email = this.refs.email.getValue();
    var minEmailCharCount = 0;
    if (email.length > minEmailCharCount) {
      if (re.test(email)) {
        this.setState({
          emailErrorText: ''
        });
        emailIsValid = true;
      } else {
        this.setState({
          emailErrorText: 'Please enter a valid email'
        });
        emailIsValid = false;
      }
    } else {
      this.setState({
        emailErrorText: ''
      });
      emailIsValid = false;
    }
  }

  handleErrorInputForPass() {
    var password = this.refs.password.getValue();
    var minPasswordCharCount = 6;
    var confirmedPassword = this.refs.confirmPassword.getValue();
    if (password !== confirmedPassword && counter[0] === true) {
      this.setState({
        confirmPasswordErrorText: 'Passwords do not match!'
      });
      passwordIsValid = false;
    } else if (password.length < minPasswordCharCount && counter[0] === true) {
      this.setState({
        confirmPasswordErrorText: 'Password needs to be at least 6 char!'
      });
      passwordIsValid = false;
    } else {
      this.setState({
        confirmPasswordErrorText: ''
      });
      passwordIsValid = true;
    }
  }

  setPassToken() {
    // Prevent the application from running a password check when the user has not inputted any value for password
    if (this.refs.password.getValue() === "") {
      counter[0] = false;
    } else {
      counter[0] = true;
    }
  }

  componentWillMount() {
    if (AuthStore.isLoggedIn()) {
      history.push('/proposals');
    }
  }

  componentDidMount() {
    AuthStore.addChangeListener(this.handleAuthStoreChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this.handleAuthStoreChange);
  }

  render() {
    var signupFailedTextView;
    if (this.state.userCreateFailed) {
      signupFailedTextView = <p style={{color: Color.FAILURE_PRIMARY}}>
          There was an issue creating your account. Please try again.
        </p>;
    }

    const containerStyle = {
      minHeight: '400px',
      width: '700px',
      margin: '35px'
    };

    const signupDialogStyle = {
      textAlign: 'center'
    };

    const spacingStyle = {
      marginLeft: '4px'
    };

    const buttonStyle = {
      margin: '20px'
    };

    return (
      <div className={"signup-container"}>
        <LoginDialog openLogin={this.state.openLoginDialog} closeLogin={this.handleLoginClose} />
        <Dialog
          title="You have successfully registered for Campaiyn!"
          contentStyle={signupDialogStyle}
          autoScrollBodyContent={true}
          open={this.state.userCreateSuccess}
          onRequestClose={this._doNothing}>
          Please check your email to verify your account.<br />
          <StandardButton
            label="Okay"
            style={buttonStyle}
            primary={true}
            onTouchTap={this.routeToHomePage} />
        </Dialog>
        <Paper style={containerStyle}>
          <h1>Create an Account</h1>
          {signupFailedTextView}
          <form action="/login" method="post" autoComplete ="off">
            <div>
              <TextField
                hintText="First Name"
                ref="fname"
                onBlur={this.handleErrorInputForfName}
                errorText={this.state.firstNameErrorText}
                disabled={this.state.disabled} />
              <br />
              <TextField
                style={spacingStyle}
                hintText="Last Name"
                ref="lname"
                onBlur={this.handleErrorInputForlName}
                errorText={this.state.lastNameErrorText}
                disabled={this.state.disabled} />
              <br />
              <TextField
                style={spacingStyle}
                hintText="Email"
                ref="email"
                onBlur={this.handleErrorInputForEmail}
                errorText={this.emailErrorText}
                disabled={this.state.disabled} />
              <br />
              <TextField
                hintText="Password"
                type="password"
                ref="password"
                onBlur={this.setPassToken}
                onChange={this.handleErrorInputForPass}
                disabled={this.state.disabled} />
              <br />
              <TextField
                style={spacingStyle}
                hintText="Confirm Password"
                type="password"
                ref="confirmPassword"
                onBlur={this.handleErrorInputForPass}
                onChange={this.handleErrorInputForPass}
                errorText={this.state.confirmPasswordErrorText}
                disabled={this.state.disabled} />
            </div>
            <br /><br />
            <div>
              By signing up, I agree to Campaiyn's <Link to={'terms'}>Terms and Conditions</Link>
            </div>
            <div>
              <br />
              <StandardButton
                label="Create Account"
                tertiary={true}
                onTouchTap={this.submitTouchTap}
                disabled={this.state.disabled} />
            </div>
          </form>
          <br /><hr />
          <div className={"login"}>
            Already have an account? <a href="#" onClick={this.handleLogin}>Login Here</a>
          </div>
        </Paper>

      </div>
    );
  }

  submitTouchTap() {
    // check if any of the values inputed are not valid
    if (!emailIsValid
      || !passwordIsValid
      || !firstNameIsValid
      || !lastNameIsValid) {
      alert("Invalid Inputs");
    } else {
      var firstName = this.refs.fname.getValue();
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      var lastName = this.refs.lname.getValue();
      lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
      var primaryEmail = this.refs.email.getValue();
      var password = this.refs.password.getValue();
      var data = {
        firstName: firstName,
        lastName: lastName,
        primaryEmail: primaryEmail,
        password: password
      };
      this.setState({
        openLoginDialog: false,
        disabled: true
      });
      AuthService.signup(data);
    }
  }

  handleAuthStoreChange(e) {
    if (AuthStore.isLoggedIn()) {
      this.routeToHomePage();
    } else if (AuthStore.didUserCreateFail() !== undefined) {
      this.setState({
        userCreateSuccess: !AuthStore.didUserCreateFail(),
        userCreateFailed: AuthStore.didUserCreateFail(),
        disabled: false
      });
    }
  }

  routeToHomePage(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({userCreateSuccess: false});
    history.push('/'); // TODO Should notify user to check email instead of redirecting
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState({
      openLoginDialog: true
    });
  }

  handleLoginClose() {
    this.setState({
      openLoginDialog: false
    });
  }
}

export default SignupCard;
