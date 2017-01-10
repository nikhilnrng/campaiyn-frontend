import React from 'react';
import ResetPasswordCard from '../components/reset-password-card.jsx';
import Paper from 'material-ui/lib/paper';
import {Link} from 'react-router';

class MyAccountPage extends React.Component {

  render() {
    return (
      <div className="my-account-page">
        <ResetPasswordCard styleName="reset-password-card"/>
        <Paper className="payout-preference-direct-card">
          <Link to="/payout_preferences">Payout Preferences</Link>
        </Paper>
      </div>
    );
  }
}

export default MyAccountPage;
