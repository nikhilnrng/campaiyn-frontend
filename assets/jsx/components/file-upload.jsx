const React = require('react');

const Dropzone = require('react-dropzone');

const Paper = require('material-ui/lib/paper');

const FileUpload = React.createClass({

  getInitialState: function() {
    return null;
  },

  render: function() {
    var buttonText = "+Add " + this.props.name;

    // To override the initial dropzone styles
    const style = {};
    const activeStyle = {};
    const rejectStyle = {};
    const imgStyle = {
      width: '50px',
      height: '50px',
      display: 'block',
      margin: 'auto',
      paddingTop: '50px'
    };
    const textStyle = {
      textAlign: 'center',
      marginTop: '24px'
    };

    // TODO remove ids upon deleting file-upload.less
    return (
      <div className={"imageUpload"}>
        <Dropzone
          multiple={this.props.multiple}
          onDrop={this.props.onDrop}
          style={style}
          activeStyle={activeStyle}
          rejectStyle={rejectStyle}>
          <Paper
            zDepth={2}
            id={"upload" + this.props.id + "Button"}
            style={{paddingBottom: '24px'}}>
            <img
              src={"/images/publish-listing/upload-photo-button.png"}
              className={"upload" + this.props.id}
              style={imgStyle} />
            <div
              id={"upload" + this.props.id + "ButtonText"}
              style={textStyle}>
              {buttonText}
            </div>
          </Paper>
        </Dropzone>
      </div>
    );
  }
});

module.exports = FileUpload;
