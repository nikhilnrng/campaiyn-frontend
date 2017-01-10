import React from 'react';
import SignupCard from '../components/signup-card.jsx';

class SignupPage extends React.Component {
  render() {
    const containerStyle = {
      textAlign: 'center'
    };

    return (
      <div style={containerStyle}>
        <SignupCard />
      </div>
    );
  }
}

export default SignupPage;
