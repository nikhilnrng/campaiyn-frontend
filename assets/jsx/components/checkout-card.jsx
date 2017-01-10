import React from 'react';

/**
 * CheckoutCard renders a div containing listing details
 * and the finalized charge amount
 */
class CheckoutCard extends React.Component {
  render() {
    return (
      <div className="checkout-card">
        <div className="card-container">
          <h1>{this.props.listing.title}</h1>
          <span>Amount: ${this.props.chargeAmount}</span>
        </div>
      </div>
    );
  }
}

CheckoutCard.propTypes = {
  listing: React.PropTypes.object,
  chargeAmount: React.PropTypes.number
};

export default CheckoutCard;
