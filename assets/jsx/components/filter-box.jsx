import React from 'react';
import ES6Utils from '../../js/utils/ES6Utils.js';
import Checkbox from 'material-ui/lib/checkbox';
import RaisedButton from 'material-ui/lib/raised-button';
import Popover from 'material-ui/lib/popover/popover';
import Color from '../../js/constants/Color.js';

const DEMOGRAPHICS = ['Demographic 1', 'Demographic 2', 'Demographic 3', 'Demographic 4'];
const TYPES = ['Group', 'Event', 'Macro', 'Micro', 'Digital'];

export default class FilterBox extends React.Component {

  constructor(props) {
    super(props);
    ES6Utils.bind(
      this,
      'handleDemographicTouchTap',
      'handleDemographicPopoverClose',
      'handleDemographicCheck',
      'handleTypeCheck'
    );
    this.state = {
      demographicPopoverOpen: false,
      demographicsChecked: [false, false, false, false],
      numDemographicsChecked: 0,
      typesChecked: [false, false, false, false, false]
    };
  }

  render() {
    const popoverStyle = {
      width: '30%',
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingLeft: '20px'
    };
    const popoverColumnStyle = {
      width: '50%',
      display: 'inline-block'
    };
    const checkboxIconStyle = {
      marginRight: '10px',
      fill: Color.CAMPAIYN_PRIMARY
    };
    const checkboxLabelStyle = {
      color: Color.CAMPAIYN_PRIMARY,
      fontSize: '0.85em'
    };
    const filterStyle = {
      fontWeight: 'bold'
    };

    return (
      <div className="filter-box">
        <form>
          <p style={{color: Color.CAMPAIYN_PRIMARY, fontWeight: 'bold'}}>Refine Search:</p>
          <div style={{marginBottom: '20px'}}>
            <p style={filterStyle}>Demographics</p>
            <RaisedButton
              label={this.state.numDemographicsChecked + ' selected'}
              backgroundColor={Color.CAMPAIYN_PRIMARY}
              labelColor={Color.WHITE}
              onTouchTap={this.handleDemographicTouchTap} />
            <Popover
              open={this.state.demographicPopoverOpen}
              anchorEl={this.state.demographicAnchorElement}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleDemographicPopoverClose}
              style={popoverStyle} >
              <div style={popoverColumnStyle}>
                <Checkbox
                  value={'0'}
                  checked={this.state.demographicsChecked[0]}
                  labelPosition="right"
                  label={DEMOGRAPHICS[0]}
                  onCheck={this.handleDemographicCheck}
                  labelStyle={checkboxLabelStyle}
                  iconStyle={checkboxIconStyle} />
                <Checkbox
                  value={'1'}
                  checked={this.state.demographicsChecked[1]}
                  labelPosition="right"
                  label={DEMOGRAPHICS[1]}
                  onCheck={this.handleDemographicCheck}
                  labelStyle={checkboxLabelStyle}
                  iconStyle={checkboxIconStyle} />
              </div>
              <div style={popoverColumnStyle}>
                <Checkbox
                  value={'2'}
                  checked={this.state.demographicsChecked[2]}
                  labelPosition="right"
                  label={DEMOGRAPHICS[2]}
                  onCheck={this.handleDemographicCheck}
                  labelStyle={checkboxLabelStyle}
                  iconStyle={checkboxIconStyle} />
                <Checkbox
                  value={'3'}
                  checked={this.state.demographicsChecked[3]}
                  labelPosition="right"
                  label={DEMOGRAPHICS[3]}
                  onCheck={this.handleDemographicCheck}
                  labelStyle={checkboxLabelStyle}
                  iconStyle={checkboxIconStyle} />
              </div>
            </Popover>
          </div>
          <div style={{marginBottom: '20px'}}>
            <p style={filterStyle}>Type:</p>
            <Checkbox
              value={'0'}
              checked={this.state.typesChecked[0]}
              labelPosition="right"
              label={TYPES[0]}
              onCheck={this.handleTypeCheck}
              labelStyle={checkboxLabelStyle}
              iconStyle={checkboxIconStyle} />
            <Checkbox
              value={'1'}
              checked={this.state.typesChecked[1]}
              labelPosition="right"
              label={TYPES[1]}
              onCheck={this.handleTypeCheck}
              labelStyle={checkboxLabelStyle}
              iconStyle={checkboxIconStyle} />
            <Checkbox
              value={'2'}
              checked={this.state.typesChecked[2]}
              labelPosition="right"
              label={TYPES[2]}
              onCheck={this.handleTypeCheck}
              labelStyle={checkboxLabelStyle}
              iconStyle={checkboxIconStyle} />
            <Checkbox
              value={'3'}
              checked={this.state.typesChecked[3]}
              labelPosition="right"
              label={TYPES[3]}
              onCheck={this.handleTypeCheck}
              labelStyle={checkboxLabelStyle}
              iconStyle={checkboxIconStyle} />
            <Checkbox
              value={'4'}
              checked={this.state.typesChecked[4]}
              labelPosition="right"
              label={TYPES[4]}
              onCheck={this.handleTypeCheck}
              labelStyle={checkboxLabelStyle}
              iconStyle={checkboxIconStyle} />
          </div>
        </form>
      </div>
    );
  }

  handleDemographicTouchTap(event) {
    this.setState({
      demographicPopoverOpen: true,
      demographicAnchorElement: event.currentTarget
    });
  }

  handleDemographicPopoverClose() {
    this.setState({
      demographicPopoverOpen: false
    });
  }

  handleDemographicCheck(event) {
    var demographicsChecked = this.state.demographicsChecked;
    var numDemographicsChecked = this.state.numDemographicsChecked;
    demographicsChecked[event.target.value] = event.target.checked;
    if (event.target.checked) {
      numDemographicsChecked++;
    } else {
      numDemographicsChecked--;
    }
    this.setState({
      demographicsChecked: demographicsChecked,
      numDemographicsChecked: numDemographicsChecked
    });
  }

  handleTypeCheck(event) {
    var typesChecked = this.state.typesChecked;
    typesChecked[event.target.value] = event.target.checked;
    this.setState({
      typesChecked: typesChecked
    });
  }

  getCheckedDemographics() {
    var checkedDemographics = [];
    for (let i = 0; i < DEMOGRAPHICS.length; i++) {
      if (this.state.demographicsChecked[i]) {
        checkedDemographics.push(DEMOGRAPHICS[i].toLowerCase().replace(' ', '-'));
      }
    }
    return checkedDemographics;
  }

  getCheckedTypes() {
    var checkedTypes = [];
    for (let i = 0; i < TYPES.length; i++) {
      if (this.state.typesChecked[i]) {
        checkedTypes.push(TYPES[i].toLowerCase().replace(' ', '-'));
      }
    }
    return checkedTypes;
  }
}
