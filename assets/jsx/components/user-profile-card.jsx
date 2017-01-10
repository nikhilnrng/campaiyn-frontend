import React from 'react';

export default class UserProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.avatar,
      name: props.name,
      location: props.location
    };
  }

  render() {
    var nameTextView = (this.state.name) ? <h1>Hi, I&#39;m {this.state.name}</h1> : null;
    var locationTextView = (this.state.location) ? <h2>{this.state.location}</h2> : null;
    return (
      <div className="user-profile-card">
        <div>
          <img src={this.state.avatar} />
        </div>
        <div className={"profile"}>
          {nameTextView}
          {locationTextView}
        </div>
      </div>
    );
  }
}

UserProfileCard.propTypes = {
  avatar: React.PropTypes.string,
  name: React.PropTypes.string,
  location: React.PropTypes.string
};

UserProfileCard.defaultProps = {
  avatar: '/images/avatar-default.svg'
};
