const React = require('react');

var ImageViewer = React.createClass({

  getInitialState: function() {
    return {
      imageCount: this._getImageCount(),
      imageIndx: 0,
      favRequired: false, // TODO: remove field when fav functionality added
      favActive: this._getFavStatus(),
      navRequired: this._getNavStatus(),
      navHover: false
    };
  },

  render: function() {
    var media = this._createMedia(this.state.imageIndx, this.state.imageCount);
    var nav = this._createNav(this.state.navRequired);
    var favorites = this._createFav(this.state.favRequired);
    return (
      <div
        className="image-viewer-container"
        onMouseOver={this._handleMouseOver}
        onMouseOut={this._handleMouseOut}>
        {favorites}
        {nav}
        {media}
      </div>
    );
  },

  /**
   * getImageCount
   *
   * @return boolean - length of images array prop
   */
  _getImageCount: function() {
    return this.props.images.length;
  },

  /**
   * getFavStatus
   * TODO: add favorites check when fav functionality added
   *
   * @returns boolean - listing favorite status
   */
  _getFavStatus: function() {
    return false;
  },

  /**
   * getNavStatus
   *
   * @return boolean - multiple images available
   */
  _getNavStatus: function() {
    return (this.props.images.length > 1);
  },

  /**
   * createMedia creates the image media based on the
   * currend indx and the total image count
   *
   * @param indx - current image indx
   * @param count - total image count
   */
  _createMedia: function(indx, count) {
    var media;

    if (count) { // image(s) available
      media = <img className="media" src={this.props.images[indx]} />;
    } else { // no available images
      media = (
        <svg className="placeholder" fill="#000000" height="200" viewBox="0 0 24 24" width="200" xmlns="http://www.w3.org/2000/svg">
            <circle className="icon" cx="12" cy="12" r="3.2"/>
            {/* eslint-disable max-len */}
            <path className="icon" d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            {/* eslint-enable max-len */}
            <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
      );
    }
    return (
      <div className="media-container">
        {media}
      </div>
    );
  },

  /**
   * createNav creates the navigation buttons
   * if multiple images are required
   *
   * @param navRequired - boolean
   */
  _createNav: function(navRequired) {
    if (!navRequired) {
      return null;
    }
    return (
      <div className="nav-container" ref="nav">
        <a
          onClick={this._navLeft}
          onMouseOver={this._handleNavMouseOver}
          onMouseOut={this._handleNaveMouseOut} >
          <svg className="nav-left" fill="#000000" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
            <path className="icon" d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
            <path d="M0-.5h24v24H0z" fill="none"/>
          </svg>
        </a>
        <a
          onClick={this._navRight}
          onMouseOver={this._handleNavMouseOver}
          onMouseOut={this._handleNaveMouseOut} >
          <svg className="nav-right" fill="#000000" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
            <path className="icon" d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
            <path d="M0-.25h24v24H0z" fill="none"/>
          </svg>
        </a>
      </div>
    );
  },

  /**
   * createFav creates the favorites button
   * if the favRequired state is true
   *
   * @param favRequired - boolean
   */
  _createFav: function(favRequired) {
    if (!favRequired) {
      return null;
    }
    var favActive = (this.state.favActive) ? 'active' : 'inactive';
    return (
      <div className="favorites-container">
        <a href="#" className={favActive} onClick={this._toggleFavorites}>
          <svg className="favorites" fill="#000000" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            {/* eslint-disable max-len */}
            <path className="icon" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            {/* eslint-enable max-len */}
          </svg>
        </a>
      </div>
    );
  },

  /**
   * toggleFavorites is an event handler
   * that toggles the favActive state
   *
   * @param e - favorites click event
   */
  _toggleFavorites: function(e) {
    e.preventDefault();
    var active = !this.state.favActive;
    this.setState({favActive: active});
  },

  /**
   * incrementIndx increments the image index
   *
   * @param indx - current index
   * @param count - total images count
   */
  _incrementIndx: function(indx, count) {
    var newIndx = indx + 1;
    if (newIndx === count) {
      return 0;
    }
    return newIndx;
  },

  /**
   * decrementIndx decrements the image index
   *
   * @param indx - current index
   * @param count - total images count
   */
  _decrementIndx: function(indx, count) {
    var newIndx = indx - 1;
    if (newIndx < 0) {
      return (count - 1);
    }
    return newIndx;
  },

  /**
   * navLeft is an event handler that updates
   * the imageIndx state on a left nav click event
   *
   * @param e - left nav click event
   */
  _navLeft: function(e) {
    e.preventDefault();
    var indx = this.state.imageIndx;
    var count = this.state.imageCount;
    var newIndx = this._decrementIndx(indx, count);
    this.setState({imageIndx: newIndx});
  },

  /**
   * navRight is an event handler that updates
   * the imageIndx state on a right nav click event
   *
   * @param e - right nav click event
   */
  _navRight: function(e) {
    e.preventDefault();
    var indx = this.state.imageIndx;
    var count = this.state.imageCount;
    var newIndx = this._incrementIndx(indx, count);
    this.setState({imageIndx: newIndx});
  },

  /**
   * handleMouseOver is an event handler that updates
   * the nav opacity to 1 when an image viewer
   * mouseover occurs
   */
  _handleMouseOver: function() {
    if (this.state.navRequired) {
      this.refs.nav.style.opacity = '1';
    }
  },

  /**
   * handleMouseOut is an event handler that updates
   * the nav opacity to 0 when an image viewer
   * mouseout occurs
   */
  _handleMouseOut: function() {
    if (this.state.navRequired) {
      this.refs.nav.style.opacity = '0';
    }
  },

  /**
   * handleNavMouseOver is an event handler that
   * updates the navHover state to true when a
   * nav icon mouse over occurs
   */
  _handleNavMouseOver: function() {
    this.setState({navHover: true});
  },

  /**
   * handleNaveMouseOut is an event handler that
   * updates the navHover state to false when a
   * nav icon mouse out occurs
   */
  _handleNaveMouseOut: function() {
    this.setState({navHover: false});
  }
});

module.exports = ImageViewer;
