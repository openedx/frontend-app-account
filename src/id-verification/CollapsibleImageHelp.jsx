import React, { useContext } from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Collapsible } from '@edx/paragon';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import IdVerificationContext, { MEDIA_ACCESS } from './IdVerificationContext';
import messages from './IdVerification.messages';

function CollapsibleImageHelp(props) {
  const {
    shouldUseCamera, setShouldUseCamera, optimizelyExperimentName, mediaAccess,
  } = useContext(IdVerificationContext);

  function handleClick() {
    setShouldUseCamera(!shouldUseCamera);
  }

  if (optimizelyExperimentName && mediaAccess !== MEDIA_ACCESS.DENIED && mediaAccess !== MEDIA_ACCESS.UNSUPPORTED) {
    return (
      <Collapsible
        styling="card"
        title={shouldUseCamera ? props.intl.formatMessage(messages['id.verification.photo.upload.help.title']) : props.intl.formatMessage(messages['id.verification.photo.camera.help.title'])}
        className="mb-4 shadow"
        defaultOpen
      >
        <p data-testid="help-text">
          {shouldUseCamera
            ? props.intl.formatMessage(messages['id.verification.photo.upload.help.text'])
            : props.intl.formatMessage(messages['id.verification.photo.camera.help.text'])}
        </p>
        { (mediaAccess === MEDIA_ACCESS.PENDING && !shouldUseCamera)
          ? (
            // if a user has not enabled camera access yet, and they are trying to switch
            // to camera mode, direct them to panel that requests camera access
            <Link
              to={{ pathname: 'request-camera-access', state: { fromPortraitCapture: props.isPortrait, fromIdCapture: !props.isPortrait } }}
              className="btn btn-primary"
              data-testid="access-link"
            >
              {props.intl.formatMessage(messages['id.verification.photo.camera.help.button'])}
            </Link>
          )
          : (
            <Button
              title={shouldUseCamera ? 'Upload Portrait Photo' : 'Take Portrait Photo'}
              data-testid="toggle-button"
              onClick={handleClick}
              style={{ marginTop: '0.5rem' }}
            >
              {shouldUseCamera ? props.intl.formatMessage(messages['id.verification.photo.upload.help.button']) : props.intl.formatMessage(messages['id.verification.photo.camera.help.button'])}
            </Button>
          )}
      </Collapsible>
    );
  }

  return null;
}

CollapsibleImageHelp.propTypes = {
  intl: intlShape.isRequired,
  isPortrait: PropTypes.bool.isRequired,
};

export default injectIntl(CollapsibleImageHelp);
