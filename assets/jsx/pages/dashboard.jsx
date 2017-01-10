/* UNUSED */
const React = require('react');
const ProfilePic = require('../components/profile-pic.jsx');
const FlatButton = require('material-ui/lib/flat-button');
var AuthStore = require('../../js/stores/AuthStore');
import {browserHistory} from 'react-router';
const history = browserHistory;

var Dashboard = React.createClass({

  componentWillMount: function() {
    // If the user is not logged in, redirect to the Login page
    if (!AuthStore.isLoggedIn()) {
      history.replace('/login');
    }
  },

  componentDidMount: function() {
    AuthStore.addChangeListener(this._onAuthenticationChange);
  },

  _onAuthenticationChange: function() {
    // If there is no user logged in anymore, redirect to the Homepage
    if (!AuthStore.isLoggedIn()) {
      history.push('/');
    }
  },

  componentWillUnmount: function() {
    AuthStore.removeChangeListener(this._onAuthenticationChange);
  },

  render: function() {
    const buttonStyle = {
      border: '2px solid #00d2ff',
      marginLeft: '60px',
      marginTop: '30px'
    };

    return (
      <div className={"dashboard-container"}>
        <ProfilePic />
        <div id="user-dashboard">
          <h1>My Listings</h1>
          <hr />
          <div className={"text"}>You currently have no listings.</div>
          <FlatButton style={buttonStyle} label="Create new listing" />
          <div className={"clear"} />
          <h2>My Favorites</h2>
          <hr />
          <div className={"text"}>You currently have no favorites.</div>
          <FlatButton style={buttonStyle} label="Search listings" />
        </div>
      </div>

    );
  }
});

module.exports = Dashboard;
