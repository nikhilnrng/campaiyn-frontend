const React = require('react');
const Dialog = require('material-ui/lib/dialog');
const UserStore = require('../../js/stores/UserStore');
const UserService = require('../../js/services/UserService');
const FileUpload = require('../components/file-upload.jsx');
const CircularProgress = require('material-ui/lib/circular-progress');
import {browserHistory} from 'react-router';
const history = browserHistory;
import Paper from 'material-ui/lib/paper';

var currentNetworkState;

const NetworkStateEnum = {
  OFF: 0,
  RUNNING: 1,
  ERROR: 2
};

const ProfilePic = React.createClass({

  getInitialState: function() {
    return {
      profileImage: "",
      firstName: "",
      networkState: NetworkStateEnum.OFF
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._grabProfilePic);
    UserService.getMe();
  },

  _grabProfilePic: function() {
    if (UserStore.getProfileImage().length > 0) {
      currentNetworkState = NetworkStateEnum.OFF;
      this.setState({
        networkState: currentNetworkState
      });
    }
    this.setState({
      profileImage: UserStore.getProfileImage(),
      firstName: UserStore.getFirstName()
    });
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._grabProfilePic);
  },

  _handleImageDrop: function(files) {
    this.setState({
      networkState: NetworkStateEnum.RUNNING
    });
    UserService.uploadProfileImage(files[0]);
  },

  render: function() {
    const containerStyle = {
      textAlign: 'center',
      height: '395px',
      width: '300px',
      padding: '37px'
    };
    var networkDialog;
    if (this.state.networkState === NetworkStateEnum.RUNNING) {
      networkDialog
        = <Dialog title="Uploading your picture. Do not close this window." open={true}>
            <CircularProgress mode="indeterminate" color={"pink"} size={1} />
          </Dialog>;
    } else if (this.state.networkState === NetworkStateEnum.ERROR) {
      networkDialog = <Dialog title="Picture did not successfully upload" open={true}
          onRequestClose={this._handleNetworkErrorClose} />;
    } else {
      networkDialog = <div />;
    }

    const profileImage = this._getProfileImage(this.state.profileImage);

    return (
      <div id="user-profile">
        <Paper style={containerStyle}>
          <div id="profile-left-tab">
            {profileImage}
            <h1>Hi {this.state.firstName}</h1>
          </div>
          {networkDialog}
        </Paper>
      </div>
    );
  },

  // check if the image is empty
  // if image is not empty it returns the image url or else it will allow the user to upload a new photo
  // TODO implement a change profile photo functionality
  _getProfileImage: function(image) {
    for (var prop in image) {
      if (image.hasOwnProperty(prop)) {
        return (
          <div id="pf-pic">
            <img src={image} />
          </div>
        );
      }
    }
    return (
      <FileUpload name="Profile Picture" id="profile-picture" onDrop={this._handleImageDrop}/>
    );
  },

  // this function links to the user's account information
  _handleEditProfile: function(e) {
    e.preventDefault();
    history.push('/profile');
  },

  _handleNetworkErrorClose: function() {
    this.setState({
      networkState: NetworkStateEnum.OFF
    });
  }

});

module.exports = ProfilePic;
