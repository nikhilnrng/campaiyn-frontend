import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardMedia from 'material-ui/lib/card/card-media';
import ImageViewer from './image-viewer.jsx';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Colors from 'material-ui/lib/styles/colors';

// React Router History Handling
import {browserHistory} from 'react-router';
const history = browserHistory;

export default class ProposalListItem extends React.Component {

  constructor(props) {
    super(props);
    ES6Utils.bind(
      this,
      'directToProposal'
    );
  }

  render() {
    const styles = {
      primaryTextStyle: {
        color: Colors.darkBlack,
        textAlign: 'left',
        marginRight: '8px'
      },

      secondaryTextStyle: {
        textAlign: 'left'
      }
    };

    return (
      <Card
        className="proposal-list-card"
        onClick={this.directToProposal}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}>
        <CardTitle title={this.props.listingTitle} />
        <CardMedia>
          <ImageViewer images={this.props.listingImages} />
        </CardMedia>
        <ListItem
          leftAvatar={
            <Avatar src={this.props.proposerAvatar} />
          }
          primaryText={
            <div style={styles.primaryTextStyle}>
              {this.props.proposerName}
            </div>
          }
          secondaryText={
            <div style={styles.secondaryTextStyle}>
            </div>
          }
          secondaryTextLines={2}
          disabled={true} />
      </Card>
    );
  }

  /* Everything after render() is a non-React lifecycle function */

  directToProposal() {
    history.push('/proposal/' + this.props.proposalId);
  }

}

ProposalListItem.propTypes = {
  proposalId: React.PropTypes.string.isRequired,
  listingTitle: React.PropTypes.string.isRequired,
  listingImages: React.PropTypes.array,
  proposerName: React.PropTypes.string.isRequired,
  proposerAvatar: React.PropTypes.string
};
