import React from 'react';
import ListingCard from './listing-card.jsx';

class ListingList extends React.Component {

  render() {
    var ListingCards = this.props.listings.map(
      function(listing, index) {
        var images = (listing.hasOwnProperty('images')) ? listing.images : [];

        return (
          <ListingCard
            key={index}
            images={images}
            title={listing.title}
            index={index}
            listingId={listing.id} />
        );
      },
    this);

    return (
      <div
        className="listing-list"
        onScroll={this.props.onScroll}>
        {ListingCards}
      </div>
    );
  }
}

ListingList.propTypes = {
  listings: React.PropTypes.array.isRequired,
  onScroll: React.PropTypes.func
};

ListingList.defaultProps = {
  onScroll: null
};

export default ListingList;
