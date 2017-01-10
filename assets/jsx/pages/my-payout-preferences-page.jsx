import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import Color from '../../js/constants/Color.js';
import StandardButton from '../components/standard-button.jsx';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import UserService from '../../js/services/UserService';
import Paper from 'material-ui/lib/paper';
import {Link} from 'react-router';

/**
 * This form verifies a user as a submerchant, by requesting identifying details such as name,
 * birthdate, SSN, and bank information. This form ultimately allows the user to accept
 * transactions to his or her bank account.
 */
class MyPayoutPreferencesPage extends React.Component {
  constructor() {
    super();
    ES6Utils.bind(
      this,
      'onSubmit'
    );
  }

  render() {
    return (
      <Paper className="my-payout-preferences-page">
        <form>
          <TextField ref="firstNameTextField" floatingLabelText="First Name" />
          <TextField ref="lastNameTextField" floatingLabelText="Last Name" />
          <TextField ref="streetAddressTextField" floatingLabelText="Street Address" />
          <TextField ref="cityTextField" floatingLabelText="City" />
          <TextField ref="stateTextField" floatingLabelText="State" />
          <TextField ref="zipCodeTextField" floatingLabelText="Zip Code" />
          <DatePicker ref="dobDatePicker" hintText="Date of Birth" />
          <TextField ref="ssnTextField" floatingLabelText="Last 4 digits of SSN" />
          <TextField ref="routingNumberTextField" floatingLabelText="Routing Number" />
          <TextField ref="accountNumberTextField" floatingLabelText="Account Number" />
          <div>
            By clicking submit, you are agreeing to our
            <Link to={'terms'}> Terms and Conditions</Link>
          </div>
          <StandardButton
            label="Submit"
            primaryColor={Color.SUCCESS_PRIMARY}
            secondaryColor={Color.SUCCESS_SECONDARY}
            onMouseUp={this.onSubmit} />
        </form>
      </Paper>
    );
  }

  onSubmit() {
    var data = {};
    data.firstName = this.refs.firstNameTextField.getValue();
    data.lastName = this.refs.lastNameTextField.getValue();
    data.streetAddress = this.refs.streetAddressTextField.getValue();
    data.locality = this.refs.cityTextField.getValue();
    data.region = this.refs.stateTextField.getValue();
    data.postalCode = this.refs.zipCodeTextField.getValue();
    data.dateOfBirth = this.refs.dobDatePicker.getDate();
    data.ssn = this.refs.ssnTextField.getValue();
    data.routingNumber = this.refs.routingNumberTextField.getValue();
    data.accountNumber = this.refs.accountNumberTextField.getValue();
    UserService.createSubMerchant(data);
  }
}

export default MyPayoutPreferencesPage;
