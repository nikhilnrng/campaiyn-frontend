import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import CheckoutForm from '../components/checkout-form.jsx';
import CheckoutCard from '../components/checkout-card.jsx';
import Dialog from 'material-ui/lib/dialog';
import StandardButton from '../components/standard-button.jsx';
import {browserHistory} from 'react-router';
const history = browserHistory;
import ProposalStore from '../../js/stores/ProposalStore';
import ProposalService from '../../js/services/ProposalService';
import ListingStore from '../../js/stores/ListingStore';
import ListingService from '../../js/services/ListingService';
import UserStore from '../../js/stores/UserStore';
import UserService from '../../js/services/UserService';
import AuthStore from '../../js/stores/AuthStore';
import {requireAuthentication} from '../hoc/require-authentication.jsx';

// enumerated user states
const UserState = {
  LOGGED_OUT: 0,
  SENDER: 1,
  UNKNOWN: 2,
  FORBIDDEN: 3
};

/**
 * Checkout renders the checkout page, which is only accessible
 * to the proposal sender after both the sender and recipient
 * have accepted the proposal; the page is tied to the route
 * proposal/:proposalId/checkout
 */
class Checkout extends React.Component {

  constructor() {
    super();
    this.state = {
      price: null,
      proposal: null,
      senders: null,
      listing: null,
      isProposalValid: false,
      userState: UserState.UNKNOWN,
      showDialog: false,
      checkoutSuccess: false
    };
    ES6Utils.bind(
      this,
      '_proposalReceived',
      '_listingReceived',
      '_userReceived',
      'proposalChanged',
      'handleDialogClose'
    );
  }

  render() {
    var checkoutCard = this._createCheckoutCard();
    var checkoutForm = this._createCheckoutForm();

    return (
      <div className="checkout">
        <Dialog
          title={this.state.checkoutSuccess ? "Checkout Successful!" : "Checkout Failed"}
          open={this.state.showDialog}
          onRequestClose={this.handleDialogClose}
          style={{textAlign: 'center'}}>
          {this.state.checkoutSuccess
            ? "Close this dialog to return to your proposal." : "Please try again."}
          <br />
          <StandardButton
            type="button"
            onMouseUp={this.handleDialogClose}
            label="Okay" />
        </Dialog>
        <div className="container">
        {checkoutCard}
        {checkoutForm}
        </div>
      </div>
    );
  }

  componentWillMount() {
    ProposalStore.addReceiveListener(this._proposalReceived);
    ProposalStore.addChangeListener(this.proposalChanged);
    ListingStore.addChangeListener(this._listingReceived);
    UserStore.addChangeListener(this._userReceived);
    ProposalService.getProposalById(this.props.params.proposalId);
    UserService.getMe();
  }

  componentWillUnmount() {
    ProposalStore.removeReceiveListener(this._proposalReceived);
    ProposalStore.removeChangeListener(this.proposalChanged);
    ListingStore.removeChangeListener(this._listingReceived);
    UserStore.removeChangeListener(this._userReceived);
  }

  /**
   * userReceived is a callback function that runs when UserStore
   * receives the user object; sets userId state and checks if
   * user has permission to view checkout page
   */
  _userReceived() {
    this.setState({
      userId: UserStore.getId()
    });
    // is user valid sender
    this._setUserState();
  }

  /**
   * listingReceived is a callback function that runs when
   * ListingStore receives the listing object; sets listing
   * state
   */
  _listingReceived() {
    this.setState({
      listing: ListingStore.getCurrentListing()
    });
  }

  /**
   * proposalReceived is a callback function that runs when
   * ProposalStore receives the proposal object; sets proposal
   * related states
   */
  _proposalReceived() {
    this.setState({
      proposal: ProposalStore.getProposal(),
      senders: ProposalStore.getSenders(),
      price: ProposalStore.getProposal().price
    });
    // get corresponding listing
    ListingService.getListingById(this.state.proposal.proposedListing);
    // is user valid sender
    this._setUserState();
    // is proposal 'in-progress' and accepted
    this._isProposalValid();
  }

  /**
   * proposalChanged is a callback function that runs when
   * ProposalStore changes the proposal object; sets proposal
   * related states
   */
  proposalChanged() {
    this.setState({
      showDialog: true,
      checkoutSuccess: ProposalStore.didCheckoutSucceed()
    });
  }

  /**
   * setUserState is called when the proposal and user information are
   * received; checks whether a user is logged in, a recipient, or a
   * sender
   */
  _setUserState() {
    // check if user is logged in
    if (!AuthStore.isLoggedIn()) {
      // TODO: Display forbidden page
      // TODO: open login dialog
      this.setState({
        userState: UserState.LOGGED_OUT
      });
    }
    var senders = this.state.senders;
    var userId = this.state.userId;
    // return if senders/user is null
    if (!senders || !userId) {
      return;
    }
    // check if user is sender
    for (let sender of senders) {
      if (sender.id === userId) {
        this.setState({
          userState: UserState.SENDER
        });
        return;
      }
    }
    // user does not have access to this proposal
    this.setState({
      userState: UserState.FORBIDDEN
    });
  }

  /**
   * isProposalValid checks if the proposal is in progress
   * and accepted by both the sender and recipient; if
   * valid, updates isProposalValid state to true
   */
  _isProposalValid() {
    var proposal = this.state.proposal;
    if (proposal.status === 'in_progress'
      && proposal.senderAccept
      && proposal.recipientAccept) {
      this.setState({
        isProposalValid: true
      });
    }
  }

  /**
   * createCheckoutCard loads the checkout card component
   * after the proposal and listing are validated
   */
  _createCheckoutCard() {
    var _state = this.state;
    if (_state.userState !== UserState.SENDER
        || !_state.isProposalValid
        || !_state.listing
        || !_state.price) {
      return null;
    }
    return <CheckoutCard listing={_state.listing} chargeAmount={_state.price} />;
  }

  /**
   * createCheckoutForm loads the braintree form after
   * the appropariate user and proposal are validated
   */
  _createCheckoutForm() {
    var _state = this.state;
    if (_state.userState !== UserState.SENDER
        || !_state.isProposalValid
        || !_state.price) {
      return null;
    }
    return <CheckoutForm chargeAmount={_state.price} proposalId={_state.proposal.id} />;
  }

  /**
   * handleDialogClose redirects the user to the account page if successful
   */
  handleDialogClose() {
    this.setState({
      showDialog: false
    });
    if (this.state.checkoutSuccess) {
      history.push('/proposal/' + this.state.proposal.id);
    }
  }
}

export default requireAuthentication(Checkout);
