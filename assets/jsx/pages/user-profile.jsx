const React = require('react');
var ProfileStore = require('../../js/stores/ProfileStore');
var UserService = require('../../js/services/UserService');

var UserProfile = React.createClass({

  getInitialState: function() {
    return this._getUserState();
  },

  _getUserState: function() {
    return {
      id: ProfileStore.getId(),
      primaryEmail: ProfileStore.getPrimaryEmail(),
      displayName: ProfileStore.getDisplayName()
    };
  },

  componentWillMount: function() {
    // This page is routed to by 'user/:userId', so a userId must exist.
    UserService.getUserById(this.props.params.userId);
  },

  componentDidMount: function() {
    ProfileStore.addChangeListener(this._onChange);
  },

  // After any change, we update the component’s state so that it’s rendered again.
  _onChange: function() {
    this.setState(this._getUserState());
  },

  componentWillUnmount: function() {
    ProfileStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(nextProps) {
    // When a user changes the userId in the address bar, we should respond accordingly
    // by fetching new data
    UserService.getUserById(nextProps.params.userId);
  },

  render: function() {
    return (
      <div>
        <h1>Hi, my name is {this.state.displayName}</h1>
        <h2>My email is {this.state.primaryEmail}</h2>
        <h2>My id is {this.state.id}</h2>
      </div>
    );
  }
});

module.exports = UserProfile;
