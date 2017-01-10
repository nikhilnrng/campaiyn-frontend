import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import UserStore from '../../js/stores/UserStore';
import ProposalListItem from './proposal-list-item.jsx';

export default class ProposalList extends React.Component {

  constructor(props) {
    super(props);
    ES6Utils.bind(
      this,
      'onReceiveProposals'
    );
    this.state = {
      proposalsList: []
    };
  }

  componentDidMount() {
    UserStore.addChangeListener(this.onReceiveProposals);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.onReceiveProposals);
  }

  render() {
    var ProposalListItems = this.state.proposalsList.map(
      function(proposal, index) {
        var images = (proposal.proposedListing.hasOwnProperty('images'))
          ? proposal.proposedListing.images
          : [];
        var name;
        var avatar;
        if (this.props.type === 'incoming') {
          name = proposal.senders[0].firstName + ' ' + proposal.senders[0].lastName;
          avatar = proposal.senders[0].profileImage;
        } else {
          name = proposal.recipients[0].firstName + ' ' + proposal.recipients[0].lastName;
          avatar = proposal.recipients[0].profileImage;
        }
        return (
          <ProposalListItem
            key={index}
            proposalId={proposal.id}
            listingTitle={proposal.proposedListing.title}
            listingImages={images}
            proposerName={name}
            proposerAvatar={avatar} />
        );
      },
    this);

    return (
      <div className="proposal-list">
        {ProposalListItems}
      </div>
    );
  }

  onReceiveProposals() {
    if (this.props.type === 'incoming') {
      this.setState({
        proposalsList: UserStore.getMyIncomingProposals().proposals
      });
    } else {
      this.setState({
        proposalsList: UserStore.getMyOutgoingProposals().proposals
      });
    }
  }
}

ProposalList.propTypes = {
  type: React.PropTypes.string.isRequired
};
