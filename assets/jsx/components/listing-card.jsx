import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import Card from 'material-ui/lib/card/card';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import ImageViewer from './image-viewer.jsx';
import {browserHistory} from 'react-router';
const history = browserHistory;

class ListingCard extends React.Component {

  constructor(props) {
    super(props);
    ES6Utils.bind(
      this,
      'handleMouseOver',
      'handleMouseOut',
      'handleListingRedirect',
      'getEvents'
    );
    this.state = {
      isHovering: false
    };
  }

  render() {
    // TODO properly handle the styles prop
    return (
      <Card
        className="listing-card"
        onClick={this.handleListingRedirect}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}>
        <CardMedia>
          <ImageViewer
            ref="imageViewer"
            images={this.props.images} />
        </CardMedia>
        <CardTitle
          title={this.props.title}
          style={{padding: "0px"}}
          titleStyle={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            padding: "16px"}} />
      </Card>
    );
  }

  /**
   * handleMouseOver is an event handler that runs when
   * a mouse over occurs on the listing card; isHovering
   * is set to true and parent events object is updated
   */
  handleMouseOver() {
    this.setState({isHovering: true});
    if (this.props.updateEvents) {
      this.props.updateEvents(this.getEvents('mouseover'));
    }
  }

  /**
   * handleMouseOut is an event handler that runs when
   * a mouse out event occurs on the listing card; isHovering
   * is set to false and parent events object is updated
   */
  handleMouseOut() {
    this.setState({isHovering: false});
    if (this.props.updateEvents) {
      this.props.updateEvents(this.getEvents('mouseout'));
    }
  }

  /**
   * handleListingRedirect is an event handler that runs
   * when a listing card is clicked; the view is redirected
   * to the corresponding listing page based on the
   * listingId prop; if the mouse is hovering over nav icons
   * redirect will not occur
   */
  handleListingRedirect() {
    if (!this.refs.imageViewer.state.navHover) {
      history.push('/listing/' + this.props.listingId);
    }
  }

  /**
   * getEvents is a helper function that returns an events
   * object filled with the current listing card event
   *
   * @param currentEvent - current listing card event
   */
  getEvents(currentEvent) {
    return {
      event: currentEvent,
      id: this.props.index
    };
  }
}

ListingCard.propTypes = {
  title: React.PropTypes.string.isRequired,
  listingId: React.PropTypes.string.isRequired,
  images: React.PropTypes.array,
  index: React.PropTypes.number.isRequired,
  updateEvents: React.PropTypes.func
};

export default ListingCard;
