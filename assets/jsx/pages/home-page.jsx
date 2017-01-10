import React from 'react';
import StandardButton from '../components/standard-button.jsx';
import {browserHistory} from 'react-router';
const history = browserHistory;

export default class HomePage extends React.Component {

  render() {
    return (
      <div className="home">
          <div className="home-panel" id="home-panel-left">
            <div className="home-panel-content">
              <div>
                <h1>Need Advertising Space?</h1>
                <p>
                  Discover great advertising opportunities, negotiate for space, and start advertising all in one place.
                </p>
                <div>
                  <StandardButton
                    label="Find a Space"
                    primary={true}
                    onTouchTap={this.handleSponsorClick} />
                </div>
              </div>
            </div>
          </div>
          <div className="home-panel" id="home-panel-right">
            <div className="home-panel-content">
              <div>
                <h1>Have Advertising Space?</h1>
                <p>
                  Turn your free space into advertising opportunities and start earning money today.
                </p>
                <div>
                  <StandardButton
                    label="Create a Listing"
                    secondary={true}
                    onTouchTap={this.handleListingOwnerClick} />
                </div>
              </div>
            </div>
          </div>
          {/*
          <div className="home-help-flag">
            <p className="home-help-flag-label">
              Not Sure?
            </p>
          </div>
          */}
      </div>
    );
  }

  handleSponsorClick() {
    // push default LA coordinates
    history.push('/search?'
      + 'lat=' + 34.0522 + '&'
      + 'lng=' + -118.2437 + '&'
      + 'page=1');
  }

  handleListingOwnerClick() {
    history.push('/publish');
  }

  /**
   * UNUSED
   * When a user clicks the help flag, this function is triggered.
   */
  handleSideBoxClick() {
    // TODO: display not sure infographic
  }
}
