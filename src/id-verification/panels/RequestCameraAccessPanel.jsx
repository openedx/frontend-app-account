import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Collapsible } from '@edx/paragon';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import { IdVerificationContext, MEDIA_ACCESS } from '../IdVerificationContext';

import messages from '../IdVerification.messages';

function RequestCameraAccessPanel(props) {
  const panelSlug = 'request-camera-access';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { tryGetUserMedia, mediaAccess } = useContext(IdVerificationContext);

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
            <Collapsible.Advanced className="mr-auto">
              <Collapsible.Visible whenClosed>
                <Collapsible.Trigger tag="button" className="btn btn-link px-0">
                  {props.intl.formatMessage(messages['id.verification.camera.access.problems'])}
                </Collapsible.Trigger>
              </Collapsible.Visible>
              <Collapsible.Body>
                <Link to={nextPanelSlug} className="btn btn-link">
                  {props.intl.formatMessage(messages['id.verification.camera.access.skip'])}
                </Link>
              </Collapsible.Body>
            </Collapsible.Advanced>
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
            {props.intl.formatMessage(messages['id.verification.camera.access.failure'])}
          </p>
          <div className="action-row">
            <Link to={nextPanelSlug} className="btn btn-primary">
              {props.intl.formatMessage(messages['id.verification.next'])}
            </Link>
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
