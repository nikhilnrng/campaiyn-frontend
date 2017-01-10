import React from 'react';
import EditProfileCard from '../components/edit-profile-card.jsx';
const ProfilePic = require('../components/profile-pic.jsx');

class MyProfilePage extends React.Component {

  render() {
    return (
      <div>
        <ProfilePic />
        <EditProfileCard />
      </div>
    );
  }

}

export default MyProfilePage;
