import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import { IdVerificationContext, MEDIA_ACCESS } from '../IdVerificationContext';

import messages from '../IdVerification.messages';

function RequestCameraAccessPanel(props) {
  const [returnUrl, setReturnUrl] = useState('dashboard');
  const [returnText, setReturnText] = useState('id.verification.return.dashboard');
  const panelSlug = 'request-camera-access';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { tryGetUserMedia, mediaAccess, userId } = useContext(IdVerificationContext);

  useEffect(() => {
    if (mediaAccess === MEDIA_ACCESS.UNSUPPORTED) {
      sendTrackingLogEvent('edx.id_verification.camera.unsupported', {
        category: 'id_verification',
        user_id: userId,
      });
    }
    if (mediaAccess === MEDIA_ACCESS.DENIED) {
      sendTrackingLogEvent('edx.id_verification.camera.denied', {
        category: 'id_verification',
        user_id: userId,
      });
    }
  }, [mediaAccess, userId]);

  // If the user accessed IDV through a course,
  // link back to that course rather than the dashboard
  useEffect(() => {
    if (sessionStorage.getItem('courseRunKey')) {
      setReturnUrl(`courses/${sessionStorage.getItem('courseRunKey')}`);
      setReturnText('id.verification.return.course');
    }
  }, []);

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.camera.access.title'])}
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
            <button className="btn btn-primary" onClick={tryGetUserMedia}>
              {props.intl.formatMessage(messages['id.verification.camera.access.enable'])}
            </button>
          </div>
        </div>
      )}

      {mediaAccess === MEDIA_ACCESS.GRANTED && (
        <div>
          <p>
            {props.intl.formatMessage(messages['id.verification.camera.access.success'])}
          </p>
          <div className="action-row">
            <Link to={nextPanelSlug} className="btn btn-primary">
              {props.intl.formatMessage(messages['id.verification.next'])}
            </Link>
          </div>
        </div>
      )}

      {[MEDIA_ACCESS.UNSUPPORTED, MEDIA_ACCESS.DENIED].includes(mediaAccess) && (
        <div>
          <p>
            {props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary'])}
          </p>
          <div className="action-row">
            <a className="btn btn-primary" href={`${getConfig().LMS_BASE_URL}/${returnUrl}`}>
              {props.intl.formatMessage(messages[returnText])}
            </a>
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
