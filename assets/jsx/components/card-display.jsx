import React from 'react';

// card image locations
// TODO: replace credit card PNGs with SVG vectors
const cards = {
  'visa': '/images/checkout/visa.png',
  'master-card': '/images/checkout/master-card.png',
  'discover': '/images/checkout/discover.png',
  'jcb': '/images/checkout/jcb.png',
  'american-express': '/images/checkout/american-express.png'
};

// enumerable card states
const CardState = {
  INVALID: 0,
  VALID: 1,
  UNKNOWN: 2
};

/**
 * CardDisplay renders a series of credit card images and
 * applies a blur effect when a credit card type is detected
 */
class CardDisplay extends React.Component {

  constructor() {
    super();
    this.state = {
      cardState: CardState.UNKNOWN
    };
  }

  render() {
    var cardDisplay = this._createCardDisplay();
    return (
      <div className="card-display">
        {cardDisplay}
      </div>
    );
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isValid && !newProps.card) {
      this.setState({
        cardState: CardState.UNKNOWN
      });
    } else if (newProps.isValid) {
      this.setState({
        cardState: CardState.VALID
      });
    } else {
      this.setState({
        cardState: CardState.INVALID
      });
    }
  }

  /**
   * createCardDisplay is a helper function that blurs the credit
   * card images according to the card state
   */
  _createCardDisplay() {
    var blur = 0;
    var indx = 0;
    var cardDisplay = [];
    for (let card in cards) {
      // blur corresponding cards on 'valid' state
      // blur all cards on 'invalid' state
      // don't blur cards on 'unknown' state
      if (this.state.cardState === CardState.VALID) {
        blur = this.props.card.type === card ? null : 'blur';
      } else if (this.state.cardState === CardState.INVALID) {
        blur = 'blur';
      } else {
        blur = null;
      }
      cardDisplay.push(
        <div className="card" key={indx++}>
          <img src={cards[card]} className={blur} />
        </div>
      );
    }
    return cardDisplay;
  }
}

CardDisplay.propTypes = {
  card: React.PropTypes.object,
  isValid: React.PropTypes.bool
};

export default CardDisplay;
