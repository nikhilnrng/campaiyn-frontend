/* global window: false */
const React = require('react');

/**
 * ImageLibrary is a lightbox image viewer that opens when
 * an image is clicked in the view listing page. The component
 * is configured with keyboard navigation, and buttons
 * for navigation and close. A click on the component moves
 * to the next image
 *
 * TODO: fade in/fade out using ReactTransitionGroup
 */
const ImageLibrary = React.createClass({

  getInitialState: function() {
    return {
      indx: 0,
      imageHover: false
    };
  },

  render: function() {
    if (!this.props.isOpen) {
      return null;
    }
    var image = this.props.images[this.state.indx];
    return (
      <div className="image-library">
        <svg
          className="close"
          onClick={this._closeImageLibrary}
          fill="#000000"
          height="50"
          viewBox="0 0 24 24"
          width="50">
          {/* eslint-disable max-len */}
          <path className="icon" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          {/* eslint-enable max-len */}
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        <svg
          className="right"
          onClick={this._displayNextImage}
          fill="#000000" height="60"
          viewBox="0 0 24 24"
          width="60">
          <path className="icon" d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
          <path d="M0-.25h24v24H0z" fill="none"/>
        </svg>
        <svg
          className="left"
          onClick={this._displayPrevImage}
          fill="#000000"
          height="60"
          viewBox="0 0 24 24"
          width="60">
          <path className="icon" d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
          <path d="M0-.5h24v24H0z" fill="none"/>
        </svg>
        <div className="image-library-container" onClick={this._closeImageLibrary}>
          <img
            src={image}
            onClick={this._displayNextImage}
            onMouseOver={this._setImageHover}
            onMouseOut={this._unsetImageHover} />
        </div>
        <div className="image-library-overlay" onClick={this._closeImageLibrary}></div>
      </div>
    );
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.indx !== this.state.indx) {
      this.setState({
        indx: newProps.indx
      });
    }
  },

  componentDidMount: function() {
    window.addEventListener('keydown', this._handleKeyDown);
  },

  componentWillUnmount: function() {
    window.removeEventListener('keydown', this._handleKeyDown);
  },

  /**
   * handleKeyDown is an event handler that handles a keydown
   * escape, left arrow, or right arrow press when the image
   * library is open
   *
   * @param e - synthetic keyboard event
   */
  _handleKeyDown: function(e) {
    if (!this.props.isOpen) {
      return;
    }
    if (e.keyCode === 27) {
      // escape key pressed
      this.props.closeImageLibrary();
    } else if (e.keyCode === 39) {
      // right key pressed
      this._displayNextImage();
    } else if (e.keyCode === 37) {
      // left key pressed
      this._displayPrevImage();
    }
  },

  /**
   * displayNextImage is a callback function that increments the
   * indx state during a right arrow click or keydown
   */
  _displayNextImage: function() {
    var maxIndx = this.props.images.length - 1;
    var nextIndx = this.state.indx + 1;
    if (nextIndx > maxIndx) {
      nextIndx = 0;
    }
    this.setState({
      indx: nextIndx
    });
  },

  /**
   * displayPrevImage is a callback function that decrements the
   * indx state during a left arrow click or keydown
   */
  _displayPrevImage: function() {
    var maxIndx = this.props.images.length - 1;
    var prevIndx = this.state.indx - 1;
    if (prevIndx < 0) {
      prevIndx = maxIndx;
    }
    this.setState({
      indx: prevIndx
    });
  },

  /**
   * closeImageLibrary is a helper function that changes the parent
   * isImageLibraryOpen state to false using the closeImageLibrary
   * prop
   */
  _closeImageLibrary: function() {
    if (this.state.imageHover) {
      return;
    }
    this.props.closeImageLibrary();
  },

  /**
   * setImageHover sets the imageHover state to true when a
   * mouseover occurs over the image; prevents false close on image
   * click
   */
  _setImageHover: function() {
    this.setState({
      imageHover: true
    });
  },

  /**
   * unsetImageHover sets the imageHover state to false when a
   * mouseout occurs over the image
   */
  _unsetImageHover: function() {
    this.setState({
      imageHover: false
    });
  }
});

module.exports = ImageLibrary;
