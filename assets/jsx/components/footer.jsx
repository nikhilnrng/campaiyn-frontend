// Default Import Statements
const React = require('react');
import {browserHistory} from 'react-router';
const history = browserHistory;

/**
 * A React component that sits on the bottom of nearly every page, providing
 * quick links to social media and other helpful pages.
 */
export default class Footer extends React.Component {
  render() {
    return (
      <div className={'footer'}>
        <div className={'menu'}>
          <ul>
            <li><a onClick={this._handleContactClick}>Contact Us</a></li>
            <li><a onClick={this._handleTermsClick}>Terms and Conditions</a></li>
          </ul>
        </div>
        <div className={'logo'}>
        </div>
        <div className={'socialMedia'}>
          <div className={'column'}>
            <div className={'row'}>
              <div className={'socialMediaIcon'}>
                <a href="https://www.facebook.com/campaiyn" target="_blank"><img src={'/images/footer/fb.png'} alt="Facebook" /></a>
              </div>
              <div className={'socialMediaIcon'}>
                <a href="https://plus.google.com/101513070834065667632/about" target="_blank"><img src={'/images/footer/gplus.png'} alt="Google Plus" /></a>
              </div>
            </div>
            <div className={'row'}>
              <div className={'socialMediaIcon'}>
                <a href="https://twitter.com/campaiynnow" target="_blank"><img src={'/images/footer/twitter.png'} alt="Twitter" /></a>
              </div>
              <div className={'socialMediaIcon'}>
                <a href="https://www.linkedin.com/company/campaiyn" target="_blank"><img src={'/images/footer/linkedin.png'} alt="LinkedIn" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _handleTermsClick() {
    history.push('/terms');
  }

  _handleContactClick() {
    history.push('/contact');
  }
}
