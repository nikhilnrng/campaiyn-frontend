/* global alert: false */
import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import UserService from '../../js/services/UserService';
import UserStore from '../../js/stores/UserStore';
import Color from '../../js/constants/Color.js';
import StandardButton from '../components/standard-button.jsx';
import TextField from 'material-ui/lib/text-field';
import Paper from 'material-ui/lib/paper';

const MIN_PASSWORD_CHAR_COUNT = 6;

/**
* This component's purpose is to help a user reset password
*/
class ResetPasswordCard extends React.Component {
  constructor(props) {
    super(props);
    ES6Utils.bind(
      this,
      'handleOldPasswordChange',
      'handleNewPasswordChange',
      'handleConfirmPasswordChange',
      'handleConfirmPasswordFocus',
      'attemptUpdate',
      'handlePasswordUpdate',
      'isNewPasswordValid',
      'doPasswordsMatch'
    );
    this.state = {
      oldPassword: '',
      oldPasswordErrorText: '',
      newPassword: '',
      newPasswordErrorText: '',
      confirmPassword: '',
      confirmPasswordErrorText: '',
      confirmPasswordFocused: false
    };
  }

  componentDidMount() {
    UserStore.addChangeListener(this.handlePasswordUpdate);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.handlePasswordUpdate);
  }

  render() {
    // style for the edit profile paper
    const textFieldStyle = {
      marginTop: '10px'
    };

    const buttonStyle = {
      textAlign: 'right'
    };

    return (
      <Paper className={this.props.styleName}>
        <form method="put" autoComplete ="off">
          <h3>Reset Password</h3>
          <TextField
            value={this.state.oldPassword}
            style={textFieldStyle}
            floatingLabelText="Old Password"
            errorText={this.state.oldPasswordErrorText}
            type="password"
            onChange={this.handleOldPasswordChange} />
          <TextField
            value={this.state.newPassword}
            style={textFieldStyle}
            floatingLabelText="New Password"
            errorText={this.state.newPasswordErrorText}
            type="password"
            onChange={this.handleNewPasswordChange} />
          <TextField
            value={this.state.confirmPassword}
            style={textFieldStyle}
            floatingLabelText="Confirm New Password"
            errorText={this.state.confirmPasswordErrorText}
            type="password"
            onChange={this.handleConfirmPasswordChange}
            onFocus={this.handleConfirmPasswordFocus} />
          <br /> <br />
          <StandardButton
            label="Save"
            style={buttonStyle}
            primaryColor={Color.SUCCESS_PRIMARY}
            secondaryColor={Color.SUCCESS_SECONDARY}
            onMouseUp={this.attemptUpdate} />
        </form>
      </Paper>
    );
  }

  /* Everything after render() is a non-React lifecycle function */

  handleOldPasswordChange(e) {
    this.setState({
      oldPassword: e.target.value
    });
  }

  handleNewPasswordChange(e) {
    var newPasswordValid = this.isNewPasswordValid(e.target.value);
    if (this.state.confirmPasswordFocused) {
      var passwordMatch = this.doPasswordsMatch(e.target.value, this.state.confirmPassword);
      if (newPasswordValid && passwordMatch) {
        // confirm password has been focused, newPassword is valid, passwords do match
        this.setState({
          newPassword: e.target.value,
          newPasswordErrorText: '',
          confirmPasswordErrorText: ''
        });
      } else if (newPasswordValid) {
        // confirm password has been focused, newPassword is valid, passwords do not match
        this.setState({
          newPassword: e.target.value,
          newPasswordErrorText: '',
          confirmPasswordErrorText: 'Password does not match your new password'
        });
      } else if (passwordMatch) {
        // confirm password has been focused, newPassword is not valid, passwords do match
        this.setState({
          newPassword: e.target.value,
          newPasswordErrorText: 'Password needs to be at least 6 characters',
          confirmPasswordErrorText: ''
        });
      } else {
        // confirm password has been focused, newPassword is not valid, passwords do not match
        this.setState({
          newPassword: e.target.value,
          newPasswordErrorText: 'Password needs to be at least 6 characters',
          confirmPasswordErrorText: 'Password does not match your new password'
        });
      }
    } else if (newPasswordValid) {
      // confirm password has not been focused, newPassword is valid
      this.setState({
        newPassword: e.target.value,
        newPasswordErrorText: ''
      });
    } else {
      // confirm password has not been focused, newPassword is not valid
      this.setState({
        newPassword: e.target.value,
        newPasswordErrorText: 'Password needs to be at least 6 characters'
      });
    }
  }

  handleConfirmPasswordChange(e) {
    if (this.doPasswordsMatch(this.state.newPassword, e.target.value)) {
      this.setState({
        confirmPassword: e.target.value,
        confirmPasswordErrorText: ''
      });
    } else {
      this.setState({
        confirmPassword: e.target.value,
        confirmPasswordErrorText: 'Password does not match your new password'
      });
    }
  }

  handleConfirmPasswordFocus() {
    if (this.doPasswordsMatch(this.state.newPassword, this.state.confirmPassword)) {
      this.setState({
        confirmPasswordErrorText: '',
        confirmPasswordFocused: true
      });
    } else {
      this.setState({
        confirmPasswordErrorText: 'Password does not match your new password',
        confirmPasswordFocused: true
      });
    }
  }

  attemptUpdate() {
    if (this.isNewPasswordValid(this.state.newPassword)
      && this.doPasswordsMatch(this.state.newPassword, this.state.confirmPassword)) {
      UserService.resetPassword(this.state.oldPassword, this.state.newPassword);
    }
  }

  handlePasswordUpdate() {
    var resetPasswordSuccessful = UserStore.isResetPasswordSuccess();
    if (resetPasswordSuccessful) {
      // TODO use something other than an alert to inform user of successful update
      alert("Password reset!");
      this.setState({
        oldPassword: '',
        oldPasswordErrorText: '',
        newPassword: '',
        newPasswordErrorText: '',
        confirmPassword: '',
        confirmPasswordErrorText: ''
      });
    } else {
      this.setState({
        oldPasswordErrorText: 'Password does not match current password'
      });
    }
  }

  isNewPasswordValid(newPassword) {
    return newPassword.length >= MIN_PASSWORD_CHAR_COUNT;
  }

  doPasswordsMatch(newPassword, confirmPassword) {
    return newPassword === confirmPassword;
  }
}

ResetPasswordCard.propTypes = {
  styleName: React.PropTypes.string.isRequired
};

export default ResetPasswordCard;
