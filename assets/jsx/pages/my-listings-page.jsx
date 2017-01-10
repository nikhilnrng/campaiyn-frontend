import React from 'react';
import UserService from '../../js/services/UserService';
import ES6Utils from '../../js/utils/ES6Utils';
import UserStore from '../../js/stores/UserStore';
import ListingList from '../components/listing-list.jsx';

class MyListingsPage extends React.Component {

  constructor(props) {
    super(props);
    ES6Utils.bind(
      this,
      'onReceiveListings'
    );
    this.state = {
      listings: []
    };
  }

  componentDidMount() {
    UserStore.addChangeListener(this.onReceiveListings);
    UserService.getMyListings();
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this.onReceiveListings);
  }

  render() {
    return <div className="my-listings-page">
      <ListingList listings={this.state.listings}/>
    </div>;
  }

  onReceiveListings() {
    this.setState({
      listings: UserStore.getMyListings()
    });
  }

}

export default MyListingsPage;
