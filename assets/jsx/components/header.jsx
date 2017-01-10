import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils';
import LoginDialog from './login-dialog.jsx';
import Logo from './logo.jsx';
import AuthStore from '../../js/stores/AuthStore';
import AuthService from '../../js/services/AuthService';
import {darkBlack, grey50} from 'material-ui/lib/styles/colors';
import Color from '../../js/constants/Color';
import {Link} from 'react-router';
import {browserHistory} from 'react-router';
const history = browserHistory;

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    ES6Utils.bind(
      this,
      'getHeaderButtons',
      'setLoginState',
      'getLoginState',
      'handleMyAccount',
      'handleLogout',
      'openLoginDialog',
      'closeLoginDialog',
      'handleSignup'
    );
    this.state = {
      userLoggedIn: this.getLoginState().userLoggedIn,
      loginActive: false
    };
  }

  componentDidMount() {
    AuthStore.addChangeListener(this.setLoginState);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this.setLoginState);
  }

  render() {
    var textColor;
    var headerStyle;
    var loggedIn = this.state.userLoggedIn;
    if (this.props.currentPath === '/') {
      textColor = 'white';
      headerStyle = {position: 'absolute'};
    } else {
      headerStyle = {
        textColor: Color.CAMPAIYN_PRIMARY,
        position: 'relative',
        borderBottom: '1px solid #D3D3D3',
        background: grey50
      };
    }
    var headerButtons = this.getHeaderButtons(loggedIn, this.props.currentPath === '/');
    return (
      <div className="header" style={headerStyle}>
        <LoginDialog openLogin={this.state.loginActive} closeLogin={this.closeLoginDialog} />
        <div className="container">
          <Link to="/">
            <div className="logo-container">
              <div className="logo">
                <Logo />
              </div>
              <div className="name">
                <svg version="1.0"
                width="133" height="40" viewBox="0 0 1000.000000 250.000000"
                preserveAspectRatio="xMidYMid meet">
                  <g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
                  fill={textColor} stroke="none">
                    <path d="M7130 2340 l0 -100 85 0 85 0 0 100 0 100 -85 0 -85 0 0 -100z"/>
                    <path d="M3223 2095 c-59 -18 -126 -59 -157 -96 l-26 -31 0 56 0 56 -80 0 -80
                    0 0 -515 0 -515 79 0 79 0 4 348 c3 340 4 348 27 400 83 185 333 207 424 38
                    21 -40 22 -51 25 -413 l3 -373 84 0 85 0 0 338 c0 379 4 408 64 479 98 114
                    296 110 368 -8 15 -24 32 -68 38 -98 5 -29 10 -202 10 -382 l0 -329 81 0 80 0
                    -3 393 -3 392 -32 67 c-40 85 -105 150 -181 179 -45 18 -78 23 -157 23 -94 1
                    -105 -1 -167 -32 -43 -21 -83 -51 -113 -84 -40 -44 -48 -50 -56 -36 -67 120
                    -255 188 -396 143z"/>
                    <path d="M5030 2094 c-72 -19 -151 -68 -206 -126 l-44 -47 0 79 0 80 -80 0
                    -80 0 0 -745 0 -745 80 0 80 0 0 300 c0 165 3 300 7 300 3 0 29 -22 58 -49
                    138 -131 325 -155 512 -67 97 46 178 127 227 228 85 172 85 354 0 526 -102
                    208 -341 323 -554 266z m246 -177 c68 -35 147 -122 175 -195 95 -248 -56 -524
                    -296 -540 -270 -17 -454 303 -325 564 37 76 119 154 193 183 73 30 182 24 253
                    -12z"/>
                    <path d="M9087 2099 c-54 -13 -126 -52 -169 -92 l-38 -35 0 54 0 54 -80 0 -80
                    0 0 -515 0 -515 79 0 79 0 4 348 c3 327 4 350 24 392 42 91 127 149 229 157
                    114 10 198 -37 247 -135 23 -46 23 -54 26 -404 l3 -358 80 0 79 0 0 358 c0
                    388 -5 432 -56 519 -81 140 -260 211 -427 172z"/>
                    <path d="M823 2086 c-83 -20 -161 -64 -232 -132 -176 -165 -219 -416 -109
                    -635 128 -257 430 -360 686 -233 108 53 206 162 237 262 6 22 5 22 -84 22 -50
                    0 -91 -4 -91 -9 0 -5 -22 -34 -50 -64 -71 -77 -129 -102 -245 -102 -79 0 -96
                    4 -143 28 -73 38 -128 97 -165 175 -29 61 -32 76 -32 167 0 93 2 105 32 166
                    90 183 287 258 457 175 50 -25 146 -115 146 -137 0 -5 41 -9 91 -9 89 0 90 0
                    84 23 -30 96 -144 220 -247 267 -108 48 -229 61 -335 36z"/>
                    <path d="M1936 2084 c-259 -63 -429 -328 -388 -606 14 -99 69 -220 131 -290
                    142 -160 385 -212 565 -121 28 14 76 50 108 81 l58 55 0 -76 0 -77 80 0 80 0
                    0 510 0 510 -80 0 -80 0 0 -77 0 -77 -51 52 c-115 114 -264 155 -423 116z
                    m260 -177 c105 -53 179 -157 204 -284 31 -158 -55 -333 -201 -410 -47 -24 -66
                    -28 -139 -28 -71 0 -94 4 -140 26 -72 34 -132 96 -172 177 -31 62 -33 74 -33
                    167 1 130 24 193 104 276 77 82 147 111 251 106 56 -3 88 -10 126 -30z"/>
                    <path d="M6186 2084 c-259 -63 -429 -328 -388 -606 14 -99 69 -220 131 -290
                    142 -160 385 -212 565 -121 28 14 76 50 108 81 l58 55 0 -76 0 -77 80 0 80 0
                    0 510 0 510 -80 0 -80 0 0 -77 0 -77 -51 52 c-115 114 -264 155 -423 116z
                    m260 -177 c105 -53 179 -157 204 -284 31 -158 -55 -333 -201 -410 -47 -24 -66
                    -28 -139 -28 -71 0 -94 4 -140 26 -72 34 -132 96 -172 177 -31 62 -33 74 -33
                    167 1 130 24 193 104 276 77 82 147 111 251 106 56 -3 88 -10 126 -30z"/>
                    <path d="M7130 1565 l0 -515 85 0 85 0 0 515 0 515 -85 0 -85 0 0 -515z"/>
                    <path d="M7580 1722 c0 -332 1 -362 20 -418 56 -164 209 -268 395 -269 105 0
                    140 8 210 50 31 19 60 35 63 35 3 0 2 -50 -1 -112 -8 -134 -35 -202 -98 -247
                    -77 -57 -209 -67 -296 -23 -45 23 -100 84 -109 120 -6 21 -11 22 -95 22 l-88
                    0 13 -45 c59 -196 268 -314 489 -277 147 25 249 100 310 230 l32 67 3 613 3
                    612 -80 0 -79 0 -4 -347 c-4 -392 -4 -393 -80 -470 -55 -56 -118 -77 -209 -71
                    -114 9 -199 78 -229 188 -6 20 -10 181 -10 368 l0 332 -80 0 -80 0 0 -358z"/>
                  </g>
                </svg>
              </div>
            </div>
          </Link>
          {headerButtons}
        </div>
      </div>
    );
  }

  /**
   * getHeaderButtons returns the appropriate header buttons
   * depending on the login state and page name; homepage
   * color is white and other page colors are black
   *
   * @param loggedIn - boolean depending on user login state
   * @param colorCode - string hex digit for black or white
   */
  getHeaderButtons(loggedIn, isHomePage) {
    var firstButton;
    var secondButton;
    var firstButtonClick;
    var secondButtonClick;
    var createListingButtonColor;
    var firstButtonColor;
    var secondButtonColor;
    if (loggedIn) {
      firstButton = 'My Account';
      secondButton = 'Logout';
      firstButtonClick = this.handleMyAccount;
      secondButtonClick = this.handleLogout;
    } else {
      firstButton = 'Login';
      secondButton = 'Signup';
      firstButtonClick = this.openLoginDialog;
      secondButtonClick = this.handleSignup;
    }
    if (isHomePage) {
      createListingButtonColor = Color.CAMPAIYN_PRIMARY;
      firstButtonColor = Color.ORANGE_BROWN;
      secondButtonColor = Color.CAMPAIYN_TERTIARY;
    } else {
      createListingButtonColor = darkBlack;
      firstButtonColor = darkBlack;
      secondButtonColor = darkBlack;
    }
    return (
      <div className="menu-buttons">
        <Link to="/publish">
          <div className="menu-button" style={{color: createListingButtonColor}}>
            Create Listing
          </div>
        </Link>
        <div className="menu-button" style={{color: firstButtonColor}} onClick={firstButtonClick}>
            {firstButton}
        </div>
       <div className="menu-button" style={{color: secondButtonColor}} onClick={secondButtonClick}>
            {secondButton}
        </div>
      </div>
    );
  }

  /**
   * setLoginState updates the userLoggedIn statewith
   * the current login status
   */
  setLoginState() {
    this.setState(this.getLoginState());
  }

  /**
   * getLoginState returns an object containing
   * login state status
   *
   * @return object containing userLoggedIn key
   */
  getLoginState() {
    return {userLoggedIn: AuthStore.isLoggedIn()};
  }

  /**
   * handleMyAccount updates the page to the users'
   * dashboard page while preventing the default
   * anchor behavior
   *
   * @param e - synthetic event
   */
  handleMyAccount(e) {
    e.preventDefault();
    history.push('/dashboard');
  }

  /**
   * handleLogout is an event handler that logs a user
   * out when the Logout button is pressed
   *
   * @param e - synthetic event
   */
  handleLogout(e) {
    e.preventDefault();
    AuthService.logout();
  }

  /**
   * openLoginDialog is an event handler that sets the
   * loginActive state to true when the Login button is
   * pressed
   *
   * @param e - synthetic event
   */
  openLoginDialog(e) {
    e.preventDefault();
    this.setState({loginActive: true});
  }

  /**
   * closeLoginDialog sets the loginActive state to false
   * when the Submit or Cancel buttons are pressed on the
   * login dialog
   */
  closeLoginDialog() {
    this.setState({loginActive: false});
  }

  handleSignup(e) {
    e.preventDefault();
    history.push('/signup');
  }
}
