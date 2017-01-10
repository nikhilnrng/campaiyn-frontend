/* global alert: false */
import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import Color from '../../js/constants/Color.js';
import StandardButton from '../components/standard-button.jsx';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import UserService from '../../js/services/UserService';
import UserStore from '../../js/stores/UserStore';

class EditProfileCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: UserStore.getFirstName(),
      firstNameErrorText: '',
      lastName: UserStore.getLastName(),
      lastNameErrorText: ''
    };
    ES6Utils.bind(
      this,
      'handleUserStoreUpdate',
      'handleFirstNameChange',
      'handleLastNameChange',
      'attemptUpdate',
      'onSuccessfulUpdate'
    );
  }

  componentDidMount() {
    UserStore.addChangeListener(this.handleUserStoreUpdate);
    UserStore.addUpdateListener(this.onSuccessfulUpdate);
    UserService.getMe();
  }

  componentWillUnmount() {
    UserStore.removeUpdateListener(this.onSuccessfulUpdate);
    UserStore.removeChangeListener(this.handleUserStoreUpdate);
  }

  render() {
    // style for the edit profile paper
    const containerStyle = {
      textAlign: 'center',
      height: '395px',
      width: '400px',
      padding: '50px',
      marginLeft: '75px'
    };

    const textFieldStyle = {
      marginTop: '10px'
    };

    const buttonStyle = {
      textAlign: 'right'
    };

    return (
      <div className={"profile-container"}>
        <Paper style={containerStyle}>
          <form method="post" autoComplete ="off">
            <h3>Edit Profile</h3>
            <TextField
              id="firstName"
              style={textFieldStyle}
              floatingLabelText="First Name"
              errorText={this.state.firstNameErrorText}
              value={this.state.firstName}
              onChange={this.handleFirstNameChange} />
            <TextField
              id="lastName"
              style={textFieldStyle}
              floatingLabelText="Last Name"
              errorText={this.state.lastNameErrorText}
              value={this.state.lastName}
              onChange={this.handleLastNameChange} />
            <br /> <br />
            <StandardButton
              style={buttonStyle}
              label="Save"
              primaryColor={Color.SUCCESS_PRIMARY}
              secondaryColor={Color.SUCCESS_SECONDARY}
              onMouseUp={this.attemptUpdate} />
          </form>
        </Paper>
      </div>
    );
  }

  handleUserStoreUpdate() {
    this.setState({
      firstName: UserStore.getFirstName(),
      firstNameErrorText: '',
      lastName: UserStore.getLastName(),
      lastNameErrorText: ''
    });
  }

  handleFirstNameChange(e) {
    this.setState({
      firstName: e.target.value
    });
    if (e.target.value === '') {
      this.setState({
        firstNameErrorText: 'First name cannot be empty'
      });
    } else {
      this.setState({
        firstNameErrorText: ''
      });
    }
  }

  handleLastNameChange(e) {
    this.setState({
      lastName: e.target.value
    });
    if (e.target.value === '') {
      this.setState({
        lastNameErrorText: 'Last name cannot be empty'
      });
    } else {
      this.setState({
        lastNameErrorText: ''
      });
    }
  }

  attemptUpdate() {
    if (this.state.firstName !== '' || this.state.lastName !== '') {
      UserService.updateUser(this.state.firstName, this.state.lastName);
    }
  }

  onSuccessfulUpdate() {
    // TODO use material UI dialog to inform user of successful update
    alert("Profile updated!");
    this.handleUserStoreUpdate();
  }
}

export default EditProfileCard;
