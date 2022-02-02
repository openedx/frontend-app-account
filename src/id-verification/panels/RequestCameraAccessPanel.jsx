import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Bowser from 'bowser';
import { getConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

import { useRedirect } from '../../hooks';
import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import IdVerificationContext, { MEDIA_ACCESS } from '../IdVerificationContext';
import { EnableCameraDirectionsPanel } from './EnableCameraDirectionsPanel';
import { UnsupportedCameraDirectionsPanel } from './UnsupportedCameraDirectionsPanel';

import messages from '../IdVerification.messages';

function RequestCameraAccessPanel(props) {
  const { location: returnUrl, text: returnText } = useRedirect();
  const panelSlug = 'request-camera-access';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const {
    tryGetUserMedia, mediaAccess, userId,
  } = useContext(IdVerificationContext);
  const browserName = Bowser.parse(window.navigator.userAgent).browser.name;

  useEffect(() => {
    if (mediaAccess === MEDIA_ACCESS.UNSUPPORTED) {
      sendTrackEvent('edx.id_verification.camera.unsupported', {
        category: 'id_verification',
        user_id: userId,
      });
    }
    if (mediaAccess === MEDIA_ACCESS.DENIED) {
      sendTrackEvent('edx.id_verification.camera.denied', {
        category: 'id_verification',
        user_id: userId,
      });
    }
  }, [mediaAccess, userId]);

  const getTitle = () => {
    if (mediaAccess === MEDIA_ACCESS.GRANTED) {
      return props.intl.formatMessage(messages['id.verification.camera.access.title.success']);
    }
    if ([MEDIA_ACCESS.UNSUPPORTED, MEDIA_ACCESS.DENIED].includes(mediaAccess)) {
      return props.intl.formatMessage(messages['id.verification.camera.access.title.failed']);
    }
    return props.intl.formatMessage(messages['id.verification.camera.access.title']);
  };

  const returnLink = (
    <a className="btn btn-primary" href={`${getConfig().LMS_BASE_URL}/${returnUrl}`}>
      {props.intl.formatMessage(messages[returnText])}
    </a>
  );

  return (
    <BasePanel
      name={panelSlug}
      title={getTitle()}
    >
      {mediaAccess === MEDIA_ACCESS.PENDING && (
        <div>
          <p>
            <FormattedMessage
              id="id.verification.request.camera.access.instructions"
              defaultMessage="In order to take a photo using your webcam, you may receive a browser prompt for access to your camera. {clickAllow}"
              description="Instructions to enable camera access."
              values={{
                clickAllow: <strong>{props.intl.formatMessage(messages['id.verification.camera.access.click.allow'])}</strong>,
              }}
            />
          </p>
          <div className="action-row">
            <button type="button" className="btn btn-primary" onClick={tryGetUserMedia}>
              {props.intl.formatMessage(messages['id.verification.camera.access.enable'])}
            </button>
          </div>
        </div>
      )}

      {mediaAccess === MEDIA_ACCESS.GRANTED && (
        <div>
          <p data-testid="camera-access-success">
            {props.intl.formatMessage(messages['id.verification.camera.access.success'])}
          </p>
          <div className="action-row">
            <Link to={nextPanelSlug} className="btn btn-primary" data-testid="next-button">
              {props.intl.formatMessage(messages['id.verification.next'])}
            </Link>
          </div>
        </div>
      )}

      {mediaAccess === MEDIA_ACCESS.DENIED && (
        <div data-testid="camera-failure-instructions">
          <p data-testid="camera-access-failure">
            {props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary'])}
          </p>
          <EnableCameraDirectionsPanel browserName={browserName} intl={props.intl} />
          <div className="action-row">
            {returnLink}
          </div>
        </div>
      )}

      {mediaAccess === MEDIA_ACCESS.UNSUPPORTED && (
        <div data-testid="camera-unsupported-instructions">
          <p data-testid="camera-unsupported-failure">
            {props.intl.formatMessage(messages['id.verification.camera.access.failure.unsupported'])}
          </p>
          <UnsupportedCameraDirectionsPanel browserName={browserName} intl={props.intl} />
          <div className="action-row">
            {returnLink}
          </div>
        </div>
      )}

    </BasePanel>
  );
}

RequestCameraAccessPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(RequestCameraAccessPanel);
