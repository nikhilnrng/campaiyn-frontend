import React from 'react';
import AuthStore from '../../js/stores/AuthStore';
import {browserHistory} from 'react-router';

/**
 * A higher-order component that restricts access to the composed component unless a user is logged
 * in. If a user's authentication ever changes during the duration the composed component is in
 * view (such as logging out), this higher-order component forwards the user to the login page.
 */
export function requireAuthentication(ComposedComponent) {
  class AuthenticatedComponent extends React.Component {
    componentWillMount() {
      // If the user is not logged in, redirect to the Login page
      if (!AuthStore.isLoggedIn()) {
        // We use replace since the user should not have this page in his or her history
        // as they never should have reached this page in the first place.
        browserHistory.replace('/login');
      }
    }

    componentDidMount() {
      AuthStore.addChangeListener(this.onAuthenticationChange);
    }

    componentWillUnmount() {
      AuthStore.removeChangeListener(this.onAuthenticationChange);
    }

    /**
     * If the user logs out, or the user's session expires, redirect the user to a new page.
     */
    onAuthenticationChange() {
      // If there is no user logged in anymore, redirect to the login page to indicate
      // to the user that he is no longer logged in and cannot view this page.
      if (!AuthStore.isLoggedIn()) {
        browserHistory.push('/login');
      }
    }

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  }

  // Provide proper display name before returning
  var composedComponentName = (ComposedComponent.displayName)
    ? ComposedComponent.displayName
    : ComposedComponent.name;
  AuthenticatedComponent.displayName = 'RequireAuthenticationHOC('
        + composedComponentName
        + ')';
  return AuthenticatedComponent;
}
