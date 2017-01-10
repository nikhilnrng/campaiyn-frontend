import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
const selectableContainerEnhance
        = require('material-ui/lib/hoc/selectable-enhance').SelectableContainerEnhance;
import {browserHistory} from 'react-router';
const history = browserHistory;
import {requireAuthentication} from '../hoc/require-authentication.jsx';

var SelectableList = selectableContainerEnhance(List);

// We purposefully provide an empty string as the zero-th index as Material UI Lists are
// 1-indexed
var pageMappings = ['',
                    '/dashboard',
                    '/campaigns',
                    '/proposals',
                    '/listings',
                    '/profile',
                    '/account'];

var UserProfileWrapper = React.createClass({
  getInitialState: function() {
    return this._getListIndexState(this.props.location.pathname);
  },

  componentWillReceiveProps: function(nextProps) {
    // When the url changes (thus causing props to update), we should set new states
    // for this wrapper
    this.setState(this._getListIndexState(nextProps.location.pathname));
  },

  _getListIndexState: function(currentPageName) {
    return {
      selectedIndex: this._getCurrentListIndex(currentPageName)
    };
  },

  /**
  * This function compares a string passed in with all of the page names in pageMappings,
  *   which holds all pagename strings for the user profile.
  * @param currentPageName The string of the route's pathname in the current window
  */
  _getCurrentListIndex: function(currentPageName) {
    for (var i = 1; i < pageMappings.length; i++) {
      if (currentPageName.indexOf(pageMappings[i]) >= 0) {
        return i;
      }
    }
    return 0;
  },

  /**
  * When an item in this navbar is clicked, we should perform some specified action.
  * TODO because this is an action, we should follow the Flux pattern
  *   of having it route through an Action and Store and listen to change
  *   events.
  * TODO some pages don't exist yet, but a link is still pushed to history.
  *   This currently does not cause any major issues, and will soon be gone
  *   with the addition of the new pages.
  * @param err An error, if there is one. Otherwise, null or undefined
  * @param index The list item's value
  */
  _handleUpdateSelectedIndex: function(err, index) {
    if (index > 0 && index < pageMappings.length) {
      history.push(pageMappings[index]);
    } else {
      // TODO go to a 404 page, as the user as attempted going to a page that is not
      // listed in the pageMappings array at the top of the file.
    }
  },

  render: function() {
    var navigationListStyle = {
      minWidth: '300px',
      float: 'left',
      margin: '16px'
    };

    var containerStyle = {
      display: 'inline-block',
      minWidth: '300px',
      width: '60%',
      margin: '16px'
    };

    return (
      <div>
        <div style={navigationListStyle}>
          <SelectableList
            subheader="User Profile"
            zDepth={1}
            valueLink={{
              value: this.state.selectedIndex,
              requestChange: this._handleUpdateSelectedIndex
            }}>
            {/* The ListItem values are associated with the index in pageMappings */}
            {/* <ListItem value={1} key={'0'} primaryText="Dashboard" /> */}
            {/* <ListItem value={2} key={'1'} primaryText="Campaigns" /> */}
            <ListItem value={3} key={'2'} primaryText="Proposals" />
            <ListItem value={4} key={'4'} primaryText="Listings" />
            <Divider />
            <ListItem value={5} key={'5'} primaryText="Profile" />
            <ListItem value={6} key={'6'} primaryText="Account" />
          </SelectableList>
        </div>
        <div style={containerStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = requireAuthentication(UserProfileWrapper);
