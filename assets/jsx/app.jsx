/* global localStorage: false, window: false, document: false */
import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router';
import DefaultWrapper from './components/default-wrapper.jsx';
import HomePage from './pages/home-page.jsx';
import ViewProposal from './pages/view-proposal.jsx';
import Checkout from './pages/checkout.jsx';
import MyPayoutPreferencesPage from './pages/my-payout-preferences-page.jsx';
import MyProfilePage from './pages/my-profile-page.jsx';
import MyAccountPage from './pages/my-account-page.jsx';
import MyListingsPage from './pages/my-listings-page.jsx';
import MyProposalsPage from './pages/my-proposals-page.jsx';
import SignupPage from './pages/signup-page.jsx';
import NotFoundPage from './pages/not-found-page.jsx';

// Note, wrapping this file in an anonymous function causes it to be the first to run,
// letting it function as the main app file.
(function() {
  var React = require('react');
  var ReactDOM = require('react-dom');
  var injectTapEventPlugin = require('react-tap-event-plugin');

  // Wrappers
  var UserProfileWrapper = require('./components/wrapper-user-profile.jsx');

  // Pages
  var PublishListing = require('./pages/publish-listing.jsx');
  var UserProfile = require('./pages/user-profile.jsx');
  var Search = require('./pages/search-listings.jsx');
  var Contact = require('./pages/contact-us.jsx');
  var Listing = require('./pages/view-listing.jsx');
  var ToC = require('./pages/ToC.jsx');
  var VerifyPage = require('./pages/verify-page.jsx');
  var EditListing = require('./pages/edit-listing.jsx');

  // Check if user is available everytime the user refreshes the page.
  // We only check the token, because if the token is there, then we can
  // attempt to request the current user from the server with the token
  var AuthActions = require('../js/actions/AuthActions');
  var token = localStorage.getItem('token');
  var user = localStorage.getItem('user');
  if (token) {
    AuthActions.userLoggedIn(user, token);
  }

  // Needed for React Developer Tools
  window.React = React;

  // Needed for onTouchTap
  // Can go away when react 1.0 release
  // Check this repo:
  // https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  var routes = (
    <Router history={browserHistory}>
      <Route path="/" component={DefaultWrapper}>
        <IndexRoute component={HomePage} />
        <Route path="signup" component={SignupPage} />
        <Route path="me" component={UserProfileWrapper}>
          <Route path="/listings" component={MyListingsPage} />
          <Route path="/profile" component={MyProfilePage} />
          <Route path="/account" component={MyAccountPage} />
          <Route path="/payout_preferences" component={MyPayoutPreferencesPage} />
          <Route path="/proposals" component={MyProposalsPage} />

          {/* Redirect /me/{path} to /{path} */}
          <Redirect from="/dashboard" to="/proposals" />
          <Redirect from="listings" to="/listings" />
          <Redirect from="profile" to="/profile" />
          <Redirect from="proposals" to="/proposals" />
        </Route>
        <Route path="user">
          <Route path=":userId" component={UserProfile} />
        </Route>
        <Route path="proposal">
          <Route path=":proposalId" component={ViewProposal} />
          <Route path=":proposalId/checkout" component={Checkout} />
        </Route>
        <Route path="publish" component={PublishListing} />
        <Route path="search" component={Search} />
        <Route path="listing">
          <Route path=":listingId" component={Listing} />
          <Route path=":listingId/edit" component={EditListing} />
        </Route>

        {/* The page a user goes to for verifying their account */}
        <Route path="verify/:verifyToken" component={VerifyPage} />

        {/* TODO Redirect '/login' to '/'. Remove when /login as a page is available */}
        <Redirect from="login" to="/" />
        <Route path="contact" component={Contact} />
        <Route path="terms" component={ToC} />

        {/* Redirect all remaining pages to a Not Found page */}
        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  );

  // Render the main app react component into the app div.
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
  ReactDOM.render(routes, document.getElementById('container'));
})();
