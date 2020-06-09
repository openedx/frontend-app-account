import React from 'react';
import PropTypes from 'prop-types';
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import shutter from './data/camera-shutter.base64.json';
import messages from './IdVerification.messages';

class Camera extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.cameraPhoto = null;
    this.videoRef = React.createRef();
    this.state = {
      trackedObject: null,
      dataUri: '',
    };
  }

  componentDidMount() {
    this.cameraPhoto = new CameraPhoto(this.videoRef.current);
    this.cameraPhoto.startCameraMaxResolution(FACING_MODES.USER);
  }

  takePhoto() {
    if (this.state.dataUri) {
      return this.reset();
    }
    const config = {
      sizeFactor: 1,
    };

    this.playShutterClick();
    const dataUri = this.cameraPhoto.getDataUri(config);
    this.setState({ dataUri });
    this.props.onImageCapture(dataUri);
  }

  playShutterClick() {
    const audio = new Audio('data:audio/mp3;base64,' + shutter.base64);
    audio.play();
  }

  reset() {
    this.setState({ dataUri: '' });
  }

  render() {
    const cameraFlashClass = this.state.dataUri
      ? 'do-transition camera-flash'
      : 'camera-flash';
    return (
      <div className='camera-outer-wrapper shadow'>
        <div className='camera-wrapper'>
          <div className={cameraFlashClass} />
          <video
            ref={this.videoRef}
            autoPlay={true}
            className='camera-video'
            style={{ display: this.state.dataUri ? 'none' : 'block' }}
          />
          <img
            alt='imgCamera'
            src={this.state.dataUri}
            className='camera-video'
            style={{ display: this.state.dataUri ? 'block' : 'none' }}
          />
        </div>
        <button
          className='btn btn-primary camera-btn'
          accessKey='c'
          onClick={() => {
            this.takePhoto();
          }}
        >
          {this.state.dataUri
            ? this.props.intl.formatMessage(messages['id.verification.photo.retake'])
            : this.props.intl.formatMessage(messages['id.verification.photo.take'])}
        </button>
      </div>
    );
  }
}

Camera.propTypes = {
  intl: intlShape.isRequired,
  onImageCapture: PropTypes.func.isRequired,
};

export default injectIntl(Camera);
