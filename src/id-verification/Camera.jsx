import React from 'react';
import PropTypes from 'prop-types';
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';

import shutter from './data/camera-shutter.base64.json'

const PHOTO_PROMTS = {
  TAKE_PHOTO: 'Take Photo',
  RETAKE_PHOTO: 'Retake Photo'
}

class Camera extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.cameraPhoto = null;
    this.videoRef = React.createRef();
    this.state = {
      trackedObject: null,
      dataUri: ''
    }
  }

  componentDidMount () {
    this.cameraPhoto = new CameraPhoto(this.videoRef.current);
    this.cameraPhoto.startCameraMaxResolution(FACING_MODES.USER)
  }

  takePhoto () {
    if (this.state.dataUri) {
        return this.reset()
    }
    const config = {
      sizeFactor: 1
    };
  
    this.playShutterClick()
    let dataUri = this.cameraPhoto.getDataUri(config);
    this.setState({ dataUri });
    this.props.onImageCapture(dataUri)
  }

  playShutterClick () {
    let audio = new Audio('data:audio/mp3;base64,' + shutter.base64);
    audio.play();
  }

  reset () {
    this.setState({dataUri: ''})
  }

  printTrackingInfo () {
    let trackedObject = this.state.trackedObject;
    if (!trackedObject) {
      trackedObject = {
        x: 'N/A',
        y: 'N/A',
        width: 'N/A',
        height: 'N/A',
      }
    }
    var res = `
      x: ${trackedObject.x}
      y: ${trackedObject.y}
      width: ${trackedObject.width}
      height: ${trackedObject.height}
    `
    return res
  }

  render () {
    let cameraFlashClass = this.state.dataUri ? 'do-transition camera-flash' : 'camera-flash';
    return (
      <div className="camera-outer-wrapper shadow">
        <div className="camera-wrapper">
          <div className={ cameraFlashClass }></div>
          <video
            ref={this.videoRef}
            autoPlay={true}
            className="camera-video"
            style={{ display: this.state.dataUri ? 'none' : 'block' }}
          />
          <img
            alt="imgCamera"
            src={this.state.dataUri}
            className="camera-video"
            style={{ display: this.state.dataUri ? 'block' : 'none' }}
          />
        </div>
        <button className="btn btn-primary camera-btn" accessKey="c" onClick={ () => {
          this.takePhoto();
        }}> {this.state.dataUri ? PHOTO_PROMTS.RETAKE_PHOTO : PHOTO_PROMTS.TAKE_PHOTO} </button>
      </div>
    );
  }
}

Camera.propTypes = {
  onImageCapture: PropTypes.func.isRequired,
}

export default Camera;