import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import Color from '../../js/constants/Color.js';

// TODO remove this once CampaiynDefaultTheme is integrated for this Button
const ButtonColors = {
  disabled: {
    primaryColor: Color.GRAY_LIGHT,
    secondaryColor: Color.GRAY_DARK,
    labelColor: Color.GRAY_DARK
  },
  default: {
    primaryColor: Color.CAMPAIYN_PRIMARY,
    secondaryColor: Color.CAMPAIYN_PRIMARY_DARK,
    labelColor: Color.ORANGE_LIGHT2
  },
  primary: {
    primaryColor: Color.CAMPAIYN_SECONDARY,
    secondaryColor: Color.CAMPAIYN_SECONDARY_DARK,
    labelColor: Color.CAMPAIYN_TERTIARY
  },
  secondary: {
    primaryColor: Color.CAMPAIYN_TERTIARY,
    secondaryColor: Color.CAMPAIYN_TERTIARY_DARK,
    labelColor: Color.CAMPAIYN_PRIMARY
  },
  tertiary: {
    primaryColor: Color.CAMPAIYN_ACCENT1,
    secondaryColor: Color.CAMPAIYN_ACCENT1_DARK,
    labelColor: Color.ORANGE_LIGHT2
  }
};

/**
 * StandardButton is a basic clickable button element
 */
class StandardButton extends React.Component {
  constructor(props) {
    super(props);
    var colors = this.getColorsFromProps(props);
    this.state = {
      hovered: false,
      focused: false,
      active: false,
      primaryColor: colors.primaryColor,
      secondaryColor: colors.secondaryColor,
      labelColor: colors.labelColor
    };
    ES6Utils.bind(
      this,
      '_handleMouseDown',
      '_handleMouseUp',
      '_handleMouseOver',
      '_handleMouseOut',
      '_handleFocus',
      '_handleBlur'
    );
  }

  componentWillReceiveProps(nextProps) {
    // Because we handle the color via state, we must react to the changing of props
      // and set state accordingly
    var colors = this.getColorsFromProps(nextProps);
    this.setState({
      primaryColor: colors.primaryColor,
      secondaryColor: colors.secondaryColor,
      labelColor: colors.labelColor
    });
  }

  render() {
    var _props = this.props;
    var className = _props.className ? (' ' + _props.className) : '';
    var disabled = _props.disabled;
    var label = _props.label;
    var type = _props.type ? _props.type : 'button';
    var styles = this._getStyles();

    // compile additional props
    var other = this._objectWithoutProperties(_props, ['className',
                                                       'disabled',
                                                       'label',
                                                       'onMouseDown',
                                                       'onMouseUp',
                                                       'onMouseOver',
                                                       'onMouseOut',
                                                       'onFocus',
                                                       'onBlur',
                                                       'labelStyle',
                                                       'primaryColor',
                                                       'secondaryColor',
                                                       'labelColor',
                                                       'disabledPrimaryColor',
                                                       'disabledSecondaryColor',
                                                       'disabledLabelColor',
                                                       'style',
                                                       'textTransform']);

    // construct HTML label element
    var labelElement = null;
    if (label) {
      labelElement = (
        <span style={styles.label}>{label}</span>
      );
    }

    // call event handlers if enabled
    var buttonEventHandlers = disabled ? null : {
      onMouseDown: this._handleMouseDown,
      onMouseUp: this._handleMouseUp,
      onMouseOver: this._handleMouseOver,
      onMouseOut: this._handleMouseOut,
      onFocus: this._handleFocus,
      onBlur: this._handleBlur
    };

    // add button animation styles
    this._animateButton();

    return (
      <button
        type={type}
        ref={'button'}
        style={styles.root}
        className={'button standard-button' + className}
        {...buttonEventHandlers}
        {...other}>
        {labelElement}
      </button>
    );
  }

  /**
   * objectWithoutProperties constructs an object populated by
   * extra props that would otherwise not be added to the
   * button component
   *
   * @param obj - object to search
   * @param keys - array of keys to exclude
   * @return target object if extra props exist
   */
  _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0) {
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(obj, i)) {
        continue;
      }
      target[i] = obj[i];
    }
    if (Object.keys(target).length === 0) {
      return null;
    }
    return target;
  }

  /**
   * getStyles construct a styles object containing label
   * and root styling based on added props
   *
   * @return styles object
   */
  _getStyles() {
    var props = this.props;
    var style = props.style;
    var labelStyle = props.labelStyle;

    // construct styles object
    var styles = {
      root: {
        background: this.state.primaryColor,
        boxShadow: props.disabled ? '0 0' : '0 4px ' + this.state.secondaryColor,
        textTransform: props.textTransform
      },
      label: {
        color: this.state.labelColor,
        fontWeight: 'bold'
      }
    };
    // add extra style elements
    styles.root = $.extend(styles.root, style);
    styles.label = $.extend(styles.label, labelStyle);
    return styles;
  }

  /**
   * Extracts what the final colors should be for the button.
   * @param {object} props The object that holds descriptors assigned by the parent component
   * @return {object} Returns three fields, primaryColor, secondaryColor, and labelColor wrapped in an object
   */
  getColorsFromProps(props) {
    var primaryColor;
    var secondaryColor;
    var labelColor;
    if (props.disabled) {
      primaryColor = props.disabledPrimaryColor
        ? props.disabledPrimaryColor
        : ButtonColors.disabled.primaryColor;
      secondaryColor = props.disabledSecondaryColor
        ? props.disabledSecondaryColor
        : ButtonColors.disabled.secondaryColor;
      labelColor = props.disabledLabelColor
        ? props.disabledLabelColor
        : ButtonColors.disabled.labelColor;
    } else if (props.primary) {
      primaryColor = ButtonColors.primary.primaryColor;
      secondaryColor = ButtonColors.primary.secondaryColor;
      labelColor = ButtonColors.primary.labelColor;
    } else if (props.secondary) {
      primaryColor = ButtonColors.secondary.primaryColor;
      secondaryColor = ButtonColors.secondary.secondaryColor;
      labelColor = ButtonColors.secondary.labelColor;
    } else if (props.tertiary) {
      primaryColor = ButtonColors.tertiary.primaryColor;
      secondaryColor = ButtonColors.tertiary.secondaryColor;
      labelColor = ButtonColors.tertiary.labelColor;
    } else { // resort to default colors
      primaryColor = props.primaryColor
        ? props.primaryColor
        : ButtonColors.default.primaryColor;
      secondaryColor = props.secondaryColor
        ? props.secondaryColor
        : ButtonColors.default.secondaryColor;
      labelColor = props.labelColor
        ? props.labelColor
        : ButtonColors.default.labelColor;
    }

    return {
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      labelColor: labelColor
    };
  }

  /**
   * animateButton is a helper function that changes the button styles
   * during the active and hover states
   */
  _animateButton() {
    if (!this.refs.button) {
      return;
    }
    var state = this.state;
    var secondaryColor = state.secondaryColor;
    if (state.active || this.props.disabled) {
      this.refs.button.style.top = '4px';
      this.refs.button.style.boxShadow = '0 0';
    } else if (state.hovered) {
      this.refs.button.style.top = '2px';
      this.refs.button.style.boxShadow = '0 2px ' + secondaryColor;
    } else {
      this.refs.button.style.top = '0px';
      this.refs.button.style.boxShadow = '0 4px ' + secondaryColor;
    }
  }

  /**
   * handleMouseDown is an event handler that is called
   * when a mouse click occurs; calls onMouseDown prop
   * if it exists
   *
   * @param e - synthetic event
   */
  _handleMouseDown(e) {
    this.setState({active: true});
    if (this.props.onMouseDown) {
      this.props.onMouseDown(e);
    }
  }

  /**
   * handleMouseUp is an event handler that is called
   * when a mouse release occurs; calls onMouseUp prop
   * if it exists
   *
   * @param e - synthetic event
   */
  _handleMouseUp(e) {
    this.setState({active: false});
    if (this.props.onMouseUp) {
      this.props.onMouseUp(e);
    }
  }

  /**
   * handleMouseOver is an event handler that is called
   * when the cursor moves over the button; calls
   * onMouseOver prop if it exists
   *
   * @param e - synthetic event
   */
  _handleMouseOver(e) {
    this.setState({hovered: true});
    if (this.props.onMouseOver) {
      this.props.onMouseOver(e);
    }
  }

  /**
   * handleMouseOut is an event handler that is called
   * when the cursor is moved off from the button;
   * calls onMouseOut prop if it exists
   *
   * @param e - synthetic event
   */
  _handleMouseOut(e) {
    this.setState({
      active: false,
      hovered: false
    });
    if (this.props.onMouseOut) {
      this.props.onMouseOut(e);
    }
  }

  /**
   * handleFocus is an event handler that is called
   * when the button is focussed, or clicked; calls
   * onFocus prop if it exists
   *
   * @param e - synthetic event
   */
  _handleFocus(e) {
    this.setState({focused: true});
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  /**
   * handleBlur is an event handler that is called
   * when a click outside the button is detected;
   * calls onBlur prop if it exists
   *
   * @param e - synthetic event
   */
  _handleBlur(e) {
    this.setState({focused: false});
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }
}

// Note: propTypes must be defined outside class definition
// http://cheng.logdown.com/posts/2015/09/29/converting-es5-react-to-es6

StandardButton.propTypes = {
  primary: React.PropTypes.bool,
  secondary: React.PropTypes.bool,
  tertiary: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  className: React.PropTypes.string,
  type: React.PropTypes.string,
  label: React.PropTypes.string,
  onMouseDown: React.PropTypes.func,
  onMouseUp: React.PropTypes.func,
  onMouseOver: React.PropTypes.func,
  onMouseOut: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  labelStyle: React.PropTypes.object,
  labelColor: React.PropTypes.string,
  disabledPrimaryColor: React.PropTypes.string,
  disabledSecondaryColor: React.PropTypes.string,
  disabledLabelColor: React.PropTypes.string,
  style: React.PropTypes.object,
  primaryColor: React.PropTypes.string,
  secondaryColor: React.PropTypes.string,
  textTransform: React.PropTypes.string
};

StandardButton.defaultProps = {
  primary: false,
  secondary: false,
  tertiary: false,
  disabled: false,
  type: 'button',
  textTransform: 'uppercase'
};

export default StandardButton;
