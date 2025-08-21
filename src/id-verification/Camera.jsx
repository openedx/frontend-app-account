/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-access-key */
import { sendTrackEvent } from '@openedx/frontend-base';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useIntl } from '@openedx/frontend-base';
import { Form, Spinner } from '@openedx/paragon';
import * as blazeface from '@tensorflow-models/blazeface';
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';

import shutter from './data/camera-shutter.base64.json';
import messages from './IdVerification.messages';

const Camera = ({ onImageCapture, isPortrait }) => {
  const intl = useIntl();
  
  // State
  const [dataUri, setDataUri] = useState('');
  const [videoHasLoaded, setVideoHasLoaded] = useState(false);
  const [shouldDetect, setShouldDetect] = useState(false);
  const [isFinishedLoadingDetection, setIsFinishedLoadingDetection] = useState(true);
  const [shouldGiveFeedback, setShouldGiveFeedback] = useState(true);
  const [feedback, setFeedback] = useState('');
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraPhotoRef = useRef(null);

  // Initialize camera on mount
  useEffect(() => {
    cameraPhotoRef.current = new CameraPhoto(videoRef.current);
    cameraPhotoRef.current.startCamera(
      isPortrait ? FACING_MODES.USER : FACING_MODES.ENVIRONMENT,
      { width: 640, height: 480 },
    );

    // Cleanup on unmount
    return () => {
      if (cameraPhotoRef.current) {
        cameraPhotoRef.current.stopCamera();
      }
    };
  }, [isPortrait]);

  const setDetection = () => {
    setShouldDetect(prevDetect => {
      const newDetect = !prevDetect;
      if (newDetect) {
        setIsFinishedLoadingDetection(false);
        startDetection();
      }
      sendEvent(newDetect);
      return newDetect;
    });
  };

  const setVideoHasLoadedHandler = () => {
    setVideoHasLoaded(true);
  };

  const getGridPosition = (coordinates) => {
    // Used to determine where a face is (i.e. top-left, center-right, bottom-center, etc.)

    const x = coordinates[0];
    const y = coordinates[1];

    let messageBase = 'id.verification.photo.feedback';

    const heightUpperLimit = 320;
    const heightMiddleLimit = 160;

    if (y < heightMiddleLimit) {
      messageBase += '.top';
    } else if (y < heightUpperLimit && y >= heightMiddleLimit) {
      messageBase += '.center';
    } else {
      messageBase += '.bottom';
    }

    const widthRightLimit = 213;
    const widthMiddleLimit = 427;

    if (x < widthRightLimit) {
      messageBase += '.right';
    } else if (x >= widthRightLimit && x < widthMiddleLimit) {
      messageBase += '.center';
    } else {
      messageBase += '.left';
    }

    return messageBase;
  };

  const getSizeFactor = () => {
    let sizeFactor = 1;
    const settings = cameraPhotoRef.current?.getCameraSettings();
    if (settings) {
      const videoWidth = settings.width;
      const videoHeight = settings.height;
      // need to multiply by 3 because each pixel contains 3 bytes
      const currentSize = videoWidth * videoHeight * 3;
      // chose a limit of 9,999,999 (bytes) so that result will
      // always be less than 10MB
      const ratio = 9999999 / currentSize;

      if (ratio < 1) {
        // if the current resolution creates an image larger than 10 MB, adjust sizeFactor (resolution)
        // to ensure that image will have a file size of less than 10 MB.
        sizeFactor = ratio;
      } else if (videoWidth === 640 && videoHeight === 480) {
        // otherwise increase the resolution to try and prevent blurry images.
        sizeFactor = 2;
      }
    }
    return sizeFactor;
  };

  const detectFromVideoFrame = (model, video) => {
    model.estimateFaces(video).then((predictions) => {
      if (shouldDetect && !dataUri) {
        showDetections(predictions);

        requestAnimationFrame(() => {
          detectFromVideoFrame(model, video);
        });
      }
    });
  };

  const showDetections = (predictions) => {
    let canvasContext;
    if (predictions.length > 0) {
      canvasContext = canvasRef.current.getContext('2d');
      canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    }
    // predictions is an array of objects describing each detected face
    predictions.forEach((prediction) => {
      const start = [prediction.topLeft[0], prediction.topLeft[1]];
      const end = [prediction.bottomRight[0], prediction.bottomRight[1]];
      const size = [end[0] - start[0], end[1] - start[1]];

      // landmarks is an array of points representing each facial landmark (i.e. right eye, left eye, nose, etc.)
      const features = prediction.landmarks;
      let isInPosition = true;

      // for each of the landmarks, determine if it is in position
      for (let j = 0; j < features.length; j++) {
        const x = features[j][0];
        const y = features[j][1];

        let isInRange;
        if (isPortrait) {
          isInRange = isInRangeForPortrait(x, y);
        } else {
          isInRange = isInRangeForID(x, y);
        }
        // if it is not in range, give feedback depending on which feature is out of range
        isInPosition = isInPosition && isInRange;
      }

      // draw a box depending on if all landmarks are in position
      if (isInPosition) {
        canvasContext.strokeStyle = '#00ffff';
        canvasContext.lineWidth = 6;
        canvasContext.strokeRect(start[0], start[1], size[0], size[1]);
        // give positive feedback here if user is in correct position
        giveFeedback(predictions.length, [], true);
      } else {
        canvasContext.fillStyle = 'rgba(255, 51, 0, 0.75)';
        canvasContext.fillRect(start[0], start[1], size[0], size[1]);
        giveFeedback(predictions.length, features[0], false);
      }
    });

    if (predictions.length === 0) {
      giveFeedback(predictions.length, [], false);
    }
  };

  const startDetection = () => {
    setTimeout(() => {
      if (videoHasLoaded) {
        const loadModelPromise = blazeface.load();
        Promise.all([loadModelPromise])
          .then((values) => {
            setIsFinishedLoadingDetection(true);
            detectFromVideoFrame(values[0], videoRef.current);
          });
      } else {
        setIsFinishedLoadingDetection(true);
        setShouldDetect(false);
        // TODO: add error message
      }
    }, 1000);
  };

  const sendEvent = (detectState = shouldDetect) => {
    let eventName = 'edx.id_verification';
    if (isPortrait) {
      eventName += '.user_photo';
    } else {
      eventName += '.id_photo';
    }

    if (detectState) {
      eventName += '.face_detection_enabled';
    } else {
      eventName += '.face_detection_disabled';
    }
    sendTrackEvent(eventName);
  };

  const giveFeedback = (numFaces, rightEye, isCorrect) => {
    if (shouldGiveFeedback) {
      const currentFeedback = feedback;
      let newFeedback = '';
      if (numFaces === 1) {
        // only give feedback if one face is detected otherwise
        // it would be difficult to tell a user which face to move
        if (isCorrect) {
          newFeedback = intl.formatMessage(messages['id.verification.photo.feedback.correct']);
        } else {
          // give feedback based on where user is
          newFeedback = intl.formatMessage(messages[getGridPosition(rightEye)]);
        }
      } else if (numFaces > 1) {
        newFeedback = intl.formatMessage(messages['id.verification.photo.feedback.two.faces']);
      } else {
        newFeedback = intl.formatMessage(messages['id.verification.photo.feedback.no.faces']);
      }
      if (currentFeedback !== newFeedback) {
        // only update status if it is different, so we don't overload the user with status updates
        setFeedback(newFeedback);
      }
      // turn off feedback for one to ensure that instructions aren't disruptive/interrupting
      setShouldGiveFeedback(false);
      setTimeout(() => {
        setShouldGiveFeedback(true);
      }, 1000);
    }
  };

  const isInRangeForPortrait = (x, y) => {
    return x > 47 && x < 570 && y > 100 && y < 410;
  };

  const isInRangeForID = (x, y) => {
    return x > 120 && x < 470 && y > 120 && y < 350;
  };

  const takePhoto = () => {
    if (dataUri) {
      reset();
      return;
    }

    const config = {
      sizeFactor: getSizeFactor(),
    };

    playShutterClick();
    const newDataUri = cameraPhotoRef.current.getDataUri(config);
    setDataUri(newDataUri);
    onImageCapture(newDataUri);
  };

  const playShutterClick = () => {
    const audio = new Audio(`data:audio/mp3;base64,${shutter.base64}`);
    audio.play();
  };

  const reset = () => {
    setDataUri('');
    if (shouldDetect) {
      startDetection();
    }
  };

  const cameraFlashClass = dataUri
    ? 'do-transition camera-flash'
    : 'camera-flash';

  return (
    <div className="camera-outer-wrapper shadow">
      <Form.Group style={{ textAlign: 'left', padding: '0.5rem', marginBottom: '0.5rem' }}>
        <Form.Check
          id="videoDetection"
          name="videoDetection"
          label={intl.formatMessage(messages['id.verification.photo.enable.detection'])}
          aria-describedby="videoDetectionHelpText"
          checked={shouldDetect}
          onChange={setDetection}
          style={{ padding: '0rem', marginLeft: '1.25rem', float: isFinishedLoadingDetection ? 'none' : 'left' }}
        />
        {!isFinishedLoadingDetection && <Spinner animation="border" variant="primary" style={{ marginLeft: '0.5rem' }} data-testid="spinner" />}
        <Form.Text id="videoDetectionHelpText" data-testid="videoDetectionHelpText">
          {isPortrait
            ? intl.formatMessage(messages['id.verification.photo.enable.detection.portrait.help.text'])
            : intl.formatMessage(messages['id.verification.photo.enable.detection.id.help.text'])}
        </Form.Text>
      </Form.Group>
      <div className="camera-wrapper">
        <div className={cameraFlashClass} />
        <video
          ref={videoRef}
          data-testid="video"
          autoPlay
          className="camera-video"
          onLoadedData={setVideoHasLoadedHandler}
          style={{
            display: dataUri ? 'none' : 'block',
            WebkitTransform: 'scaleX(-1)',
            transform: 'scaleX(-1)',
          }}
          playsInline
        />
        <canvas
          ref={canvasRef}
          data-testid="detection-canvas"
          className="canvas-video"
          style={{
            display: !shouldDetect || dataUri ? 'none' : 'block',
            WebkitTransform: 'scaleX(-1)',
            transform: 'scaleX(-1)',
          }}
          width="640"
          height="480"
        />
        <img
          data-hj-suppress
          alt="imgCamera"
          src={dataUri}
          className="camera-video"
          style={{ display: dataUri ? 'block' : 'none' }}
        />
        <div role="status" className="sr-only">{feedback}</div>
      </div>
      <button
        type="button"
        className={`btn camera-btn ${
          dataUri
            ? 'btn-outline-primary'
            : 'btn-primary'
        }`}
        accessKey="c"
        onClick={takePhoto}
      >
        {dataUri
          ? intl.formatMessage(messages['id.verification.photo.retake'])
          : intl.formatMessage(messages['id.verification.photo.take'])}
      </button>
    </div>
  );
};

Camera.propTypes = {
  onImageCapture: PropTypes.func.isRequired,
  isPortrait: PropTypes.bool.isRequired,
};

export default Camera;
