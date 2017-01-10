import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils';
import UserService from '../../js/services/UserService';
import StandardButton from '../components/standard-button.jsx';
import ProposalList from '../components/proposal-list.jsx';

/**
* A page to allow an authenticated user to view his or her Proposals.
*/
class MyProposalsPage extends React.Component {

  constructor(props) {
    super(props);
    ES6Utils.bind(
      this,
      'handleIncomingButtonClick',
      'handleOutgoingButtonClick'
    );
    this.state = {
      value: 'incoming',
      incomingSelected: true,
      outgoingSelected: false
    };
  }

  componentDidMount() {
    UserService.getIncomingProposals();
  }

  render() {
    const styles = {
      headline: {
        textAlign: 'left',
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
      }
    };

    return (
      <div className="my-proposals-page">
        <h2 style={styles.headline}>PROPOSALS</h2>
        <StandardButton
          label="OFFERED TO ME"
          disabled={this.state.incomingSelected}
          secondary={true}
          onMouseUp={this.handleIncomingButtonClick} />
        &nbsp;
        <StandardButton
          label="MY PROPOSALS"
          disabled={this.state.outgoingSelected}
          secondary={true}
          onMouseUp={this.handleOutgoingButtonClick} />
        <p> </p>
        <div> <ProposalList type={this.state.value}/> </div>
      </div>
    );
  }

  /* Everything after render() is a non-React lifecycle function */

  handleIncomingButtonClick() {
    this.setState({
      value: 'incoming',
      incomingSelected: true,
      outgoingSelected: false
    });
    UserService.getIncomingProposals();
  }

  handleOutgoingButtonClick() {
    this.setState({
      value: 'outgoing',
      incomingSelected: false,
      outgoingSelected: true
    });
    UserService.getOutgoingProposals();
  }

}

export default MyProposalsPage;
