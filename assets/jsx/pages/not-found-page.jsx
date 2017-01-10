import React from 'react';
import {Link} from 'react-router';

/**
 * A page that is displayed whenever a user reaches a URL that does not exist.
 */
class NotFoundPage extends React.Component {
  render() {
    return (
      <div id="not-found-page">
        <h1>Sorry, that page doesn’t exist!</h1>
        <h3>
          <span>You can </span>
          <Link to="/search?lat=34.0522&lng=-118.2437&page=1" >search Campaiyn</Link>
          <span> or </span>
          <Link to="/">return to the homepage</Link>.
        </h3>
      </div>
    );
  }
}

export default NotFoundPage;
