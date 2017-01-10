import React from 'react';
import Header from './header.jsx';
import Footer from './footer.jsx';
import CampaiynDefaultTheme from '../../js/styles/CampaiynDefaultTheme.js';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import AuthService from '../../js/services/AuthService';
import AuthStore from '../../js/stores/AuthStore';

const NO_FOOTER_PAGES = ['/', '/search', '/proposal/:proposalId'];

export default class DefaultWrapper extends React.Component {
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(CampaiynDefaultTheme)
    };
  }

  componentDidMount() {
    if (AuthStore.isLoggedIn()) {
      AuthService.isAuthValid();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      AuthService.isAuthValid();
    }
  }

  render() {
    if (!this.isFooterVisible(this.props.location.pathname)) {
      return (
        <div id="default-wrapper">
          <Header currentPath={this.props.location.pathname} />
          {this.props.children}
        </div>
      );
    }
    return (
      <div>
        <div id="default-wrapper">
          <div id="body-wrapper">
            <Header currentPath={this.props.location.pathname} />
            {this.props.children}
          </div>
        </div>
        <div id="footer-wrapper">
          <Footer />
        </div>
      </div>
    );
  }

  /**
   * By analyzing predefined routes in NO_FOOTER_PAGES, tells whether the specified route should
   * ignore the footer.
   * @param {string} currentRoute The route used to match against the pages to ignore.
   * @return {boolean} Tells whether the specified route should ignore the footer.
   */
  isFooterVisible(currentRoute) {
    var currentRouteSplitPath = currentRoute.split('/');
    for (let i = 0; i < NO_FOOTER_PAGES.length; i++) {
      var keySplitPath = NO_FOOTER_PAGES[i].split('/');
      // continue to the next key if the two paths do not have the same length
      if (keySplitPath.length !== currentRouteSplitPath.length) {
        continue;
      }
      // Otherwise, verify each token, accounting for IDs with ':'
      for (let j = 0; j < keySplitPath.length; j++) {
        // If the current token is not equal to the key, and that key does not contain ':',
          // which denotes this token as a wildcard, stop this for-loop as this path does not
          // match this key.
        if (keySplitPath[j] !== currentRouteSplitPath[j] && keySplitPath[j].charAt(0) !== ':') {
          break;
        } else if (j === keySplitPath.length - 1) { // If we reached the last token, this path must resemble a no footer path
          return false;
        }
      }
    }
    return true;
  }
}

DefaultWrapper.propTypes = {
  location: React.PropTypes.object,
  children: React.PropTypes.object
};

DefaultWrapper.childContextTypes = {
  muiTheme: React.PropTypes.object
};
