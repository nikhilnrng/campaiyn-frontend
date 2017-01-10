import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import Messenger from '../components/messenger.jsx';
import ListingCard from '../components/listing-card.jsx';
import StandardButton from '../components/standard-button.jsx';
import Popover from 'material-ui/lib/popover/popover';
import {Link} from 'react-router';
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

// enumerated proposal states
const ProposalState = {
  DRAFT: 0,
  IN_PROGRESS: 1,
  FINALIZED: 2,
  CANCELLED: 3,
  UNKNOWN: 4
};

// enumerated user states
const UserState = {
  LOGGED_OUT: 0,
  SENDER: 1,
  RECIPIENT: 2,
  UNKNOWN: 3,
  FORBIDDEN: 4
};

/**
 * ViewProposal renders a proposal page that is accessible by the
 * recipients and senders, allowing for price modifications and
 * messaging between both parties
 */
class ViewProposal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      price: null,
      accepted: null,
      proposal: null,
      senders: null,
      recipients: null,
      listing: null,
      userId: null,
      userState: UserState.UNKNOWN,
      proposalState: ProposalState.UNKNOWN,
      checkout: null,
      showPopover: false,
      anchorElement: null
    };
    ES6Utils.bind(
      this,
      '_toggleAcceptedStatus',
      '_updateProposalStates',
      '_proposalReceived',
      '_listingReceived',
      '_userReceived',
      '_handlePriceChange',
      '_handleUpdatePrice',
      'handleCheckout',
      'handleDismissPopover'
    );
  }

  render() {
    // TODO: display forbidden page if not sender or recipient, load if unknown
    // TODO: place UserState checks in individual component render() functions
    if (this.state.userState !== UserState.SENDER
        && this.state.userState !== UserState.RECIPIENT) {
      return (
        <div className="view-proposal">
        </div>
      );
    }
    var acceptButtonLabel = this.state.accepted ? 'Cancel Proposal' : 'Accept Proposal';
    var proposalId = this.state.proposal ? this.state.proposal.id : undefined;
    var listingCard = this._createListingCard();
    var price = this._createPriceComponent();
    var acceptButton = <StandardButton
      label={acceptButtonLabel}
      onMouseUp={this._toggleAcceptedStatus} />;
    var checkoutButton = <StandardButton label="checkout" onMouseUp={this.handleCheckout} />;
    const popoverTextStyle = {
      paddingLeft: '5px',
      paddingRight: '5px',
      fontSize: '0.8em'
    };
    // TODO: develop individual components for each proposal feature
    return (
      <div id="view-proposal-page">
        <div className="view-proposal-container">
          <div className="view-proposal-messenger-container">
            <Messenger
              userId={this.state.userId}
              proposalId={proposalId} />
          </div>
          <div className="view-proposal-details-container">
            <div className="view-proposal-details">
              <div className="listing-details">
                {listingCard}
              </div>
              <div className="price-container">
                <div className="price">
                  <label>Price:
                    {price}
                  </label>
                </div>
              </div>
              <Popover
                open={this.state.showPopover}
                anchorEl={this.state.anchorElement}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleDismissPopover}
                style={{width: '100px'}}>
                <p style={popoverTextStyle}>
                  Please fill out the <Link to="/payout_preferences">payout form</Link> first.
                </p>
              </Popover>
              {this.state.proposalState === ProposalState.FINALIZED ? null : acceptButton}
              {this.state.checkout && this.state.proposalState !== ProposalState.FINALIZED
                ? checkoutButton : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    ProposalStore.addReceiveListener(this._proposalReceived);
    ProposalStore.addChangeListener(this._updateProposalStates);
    ListingStore.addChangeListener(this._listingReceived);
    UserStore.addChangeListener(this._userReceived);
    ProposalService.getProposalById(this.props.params.proposalId);
    UserService.getMe();
  }

  componentWillUnmount() {
    ProposalStore.removeReceiveListener(this._proposalReceived);
    ProposalStore.removeChangeListener(this._updateProposalStates);
    ListingStore.removeChangeListener(this._listingReceived);
    UserStore.removeChangeListener(this._userReceived);
  }

  /**
   * createListingCard constructs the ListingCard component from
   * the listing state
   */
  _createListingCard() {
    var listing = this.state.listing;
    if (!listing) {
      return null;
    }
    return (
      <ListingCard
        images={(listing.hasOwnProperty('images')) ? listing.images : []}
        title={listing.title}
        listingId={listing.id} />
    );
  }

  /**
   * createPriceComponent constructs the price input based on the UserState:
   * - UserState.RECIPIENT can edit and update the price
   * - UserState.SENDER can view the price without editing capabilities
   */
  _createPriceComponent() {
    var _state = this.state;
    if (!_state.proposal || _state.userState === UserState.UNKNOWN) {
      return null;
    }
    var price = null;
    if (_state.userState === UserState.SENDER) {
      price = (
        <div className="price-box-container">
          <input
            type="text"
            disabled="true"
            value={_state.price} />
        </div>
      );
    } else if (_state.userState === UserState.RECIPIENT) {
      price = (
        <div className="price-box-container">
          <input
            ref="priceInput"
            type="text"
            style={{paddingRight: '156px'}}
            disabled={_state.proposalState === ProposalState.FINALIZED}
            value={_state.price}
            onChange={this._handlePriceChange} />
          {_state.proposalState === ProposalState.FINALIZED
            ? null
            : <StandardButton
                label="Update"
                onMouseUp={this._handleUpdatePrice}
                secondary={true}
                style={{
                  position: 'absolute',
                  boxSizing: 'border-box',
                  width: '136px',
                  padding: '12px 20px',
                  margin: '22px 0px 20px 0px',
                  fontSize: '0.8em',
                  right: '10px'
                }} />}
        </div>
      );
    }
    return price;
  }

  /**
   * handlePriceChange is an event handler that changes the price state
   * when the input is changed by a recipient
   *
   * @param e - synthetic event
   */
  _handlePriceChange(e) {
    this.setState({
      price: e.target.value
    });
  }

  /**
   * handleUpdatePrice is an event handler that updates the price via
   * update request when a button press is detected from a recipient
   *
   * @param e - synthetic event
   */
  _handleUpdatePrice(e) {
    var newPrice = this.refs.priceInput.value;
    var currentPrice = this.state.proposal.price;
    var proposalId = this.state.proposal.id;
    if (newPrice !== currentPrice) {
      ProposalService.updatePrice(proposalId, newPrice);
    }
  }

  /**
   * toggleAcceptedStatus is an event handler that toggles the
   * corresponding sender/recipient accept status on a click
   * event
   */
  _toggleAcceptedStatus(e) {
    if (this.state.userState === UserState.SENDER || UserStore.getBraintreeMerchantId()) {
      var accepted = !this.state.accepted;
      ProposalService.updateConfirmationStatus(this.state.proposal.id, accepted);
    } else {
      this.setState({
        showPopover: true,
        anchorElement: e.currentTarget
      });
    }
  }

  /**
   * updateProposalStates updates all states associated with the
   * proposal object, when a proposal is received or updates in
   * ProposalStore
   */
  _updateProposalStates() {
    // set proposal related states
    this.setState({
      proposal: ProposalStore.getProposal(),
      price: ProposalStore.getProposal().price,
      senders: ProposalStore.getSenders(),
      recipients: ProposalStore.getRecipients()
    });
    // check if proposal is in progress or finalized
    this._setProposalState();
    // check if user has accepted proposal
    this._setAcceptedState();
    // check if checkout should be enabled
    this.setCheckoutState();
  }

  /**
   * proposalReceived is a callback function that is called when
   * a proposal is received in ProposalStore
   */
  _proposalReceived() {
    // update state
    this._updateProposalStates();
    // get listing for listing card
    ListingService.getListingById(this.state.proposal.proposedListing);
    // check if user is sender or recipient
    this._setUserState();
  }

  /**
   * listingReceived is a callback function that is called when a
   * listing is received in ListingStore
   */
  _listingReceived() {
    this.setState({
      listing: ListingStore.getCurrentListing()
    });
  }

  /**
   * userReceived is a callback function that is called when the
   * user information is received in UserStore
   */
  _userReceived() {
    this.setState({
      userId: UserStore.getId()
    });
    // check if user is sender or recipient
    this._setUserState();
  }

  /**
   * setUserState is called when the proposal and user information are
   * received; checks whether a user is logged in, a recipient, or a
   * sender; assigns accepted status based on recipient/sender state
   */
  _setUserState() {
    // check if user is logged in
    if (!AuthStore.isLoggedIn()) {
      // TODO: Display forbidden page
      this.setState({
        userState: UserState.LOGGED_OUT,
        openLoginDialog: true
      });
    }
    var senders = this.state.senders;
    var recipients = this.state.recipients;
    var userId = this.state.userId;
    // if null return
    if (!senders || !recipients || !userId) {
      return null;
    }
    // check if user is sender
    for (let sender of senders) {
      if (sender.id === userId) {
        this.setState({
          userState: UserState.SENDER
        });
        // check if proposal accepted by sender
        this._setAcceptedState();
        return;
      }
    }
    // check if user is recipient
    for (let recipient of recipients) {
      if (recipient.id === userId) {
        this.setState({
          userState: UserState.RECIPIENT
        });
        // check if proposal accepted by recipient
        this._setAcceptedState();
        return;
      }
    }
    // user does not have access to this proposal
    this.setState({
      userState: UserState.FORBIDDEN
    });
  }

  /**
   * setProposalState is called when the proposal information is
   * received; checks the status of the proposal based off the status,
   * senderAccept, and recipientAccept fields
   */
  _setProposalState() {
    var status = this.state.proposal.status;
    if (status === 'draft') { // draft state
      this.setState({
        proposalState: ProposalState.DRAFT
      });
    } else if (status === 'in_progress') { // in progress state
      this.setState({
        proposalState: ProposalState.IN_PROGRESS
      });
    } else if (status === 'finalized') { // finalized state
      this.setState({
        proposalState: ProposalState.FINALIZED
      });
    } else if (status === 'cancelled') { // cancelled state
      this.setState({
        proposalState: ProposalState.CANCELLED
      });
    }
  }

  /**
   * setAcceptedState updates the accepted state from ProposalStore
   * based on the sender/recipient status of the user
   */
  _setAcceptedState() {
    if (!ProposalStore.getProposal()) {
      return;
    }
    // assign updated accepted status
    var accepted = null;
    if (this.state.userState === UserState.RECIPIENT) {
      accepted = ProposalStore.getProposal().recipientAccept;
    } else if (this.state.userState === UserState.SENDER) {
      accepted = ProposalStore.getProposal().senderAccept;
    }
    this.setState({accepted: accepted});
  }

  /**
   * setCheckoutState updates the checkout state from ProposalStore
   * based on the sender and recipient status of the user
   */
  setCheckoutState() {
    if (!ProposalStore.getProposal()) {
      return;
    }
    var checkout = this.state.userState === UserState.SENDER
      && ProposalStore.getProposal().recipientAccept
      && ProposalStore.getProposal().senderAccept;
    this.setState({checkout: checkout});
  }

  /**
   * handleCheckout redirects the user to the checkout page
   */
  handleCheckout() {
    history.push('/proposal/' + this.state.proposal.id + '/checkout');
  }

  /**
   * handleDismissPopover dismisses the payout preferences popover
   */
  handleDismissPopover() {
    this.setState({
      showPopover: false
    });
  }
}

export default requireAuthentication(ViewProposal);
