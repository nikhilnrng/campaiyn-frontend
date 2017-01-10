import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import StandardButton from '../components/standard-button.jsx';

// Braintree Services
import BraintreeService from '../../js/services/BraintreeService';
import braintree from 'braintree-web';
import ProposalService from '../../js/services/ProposalService';

var checkout;

/**
 * CheckoutForm renders a braintree form that allows a user to pay
 * with credit card or through PayPal
 */
class CheckoutForm extends React.Component {

  constructor() {
    super();
    ES6Utils.bind(
      this,
      '_setupBraintree'
    );
  }

  render() {
    const buttonStyle = {
      width: '275px',
      padding: '12px 20px'
    };

    return (
      <div className="checkout-form">
        <form>
          <div id="braintree-form"></div>
          <StandardButton type="submit" style={buttonStyle} label="Checkout" />
        </form>
      </div>
    );
  }

  componentWillMount() {
    BraintreeService.generateClientToken(this._setupBraintree);
  }

  componentWillUnmount() {
    // teardown form so braintree can run again
    checkout.teardown(function() {
      checkout = null;
    });
  }

  /**
   * setupBraintree is a callback function that initializes Braintree
   * after a Client Token is successfully generated
   *
   * @params err - error message
   * @params token - user token
   */
  _setupBraintree(err, token) {
    if (err) {
      // handle error/display error message
    } else {
      braintree.setup(token, 'dropin', {
        container: 'braintree-form',
        onPaymentMethodReceived: function(obj) {
          ProposalService.checkout(this.props.proposalId, obj.nonce);
        }.bind(this),
        onReady: function(integration) {
          checkout = integration;
        }
      });
    }
  }
}

CheckoutForm.propTypes = {
  chargeAmount: React.PropTypes.number,
  proposalId: React.PropTypes.string
};

export default CheckoutForm;
