import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Collapsible } from '@edx/paragon';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import { IdVerificationContext, MEDIA_ACCESS } from '../IdVerificationContext';

export default function RequestCameraAccessPanel() {
  const panelSlug = 'request-camera-access';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { tryGetUserMedia, mediaAccess } = useContext(IdVerificationContext);

  return (
    <BasePanel
      name={panelSlug}
      title="Camera Permissions"
    >
      {mediaAccess === MEDIA_ACCESS.PENDING && (
        <div>
          <p>In order to take a photo using your webcam, you may receive a browser prompt for access to your camera. <strong>Please make sure to click "Allow"</strong></p>

          <div className="action-row">
            <button className="btn btn-primary" onClick={tryGetUserMedia}>
              Enable Camera
            </button>
            <Collapsible.Advanced className="mr-auto">
              <Collapsible.Visible whenClosed>
                <Collapsible.Trigger tag="button" className="btn btn-link px-0">
                  Having problems?
                </Collapsible.Trigger>
              </Collapsible.Visible>
              <Collapsible.Body>
                <Link to={nextPanelSlug} className="btn btn-link">
                  Skip and upload image files instead
                </Link>
              </Collapsible.Body>
            </Collapsible.Advanced>
          </div>
        </div>
      )}

      {mediaAccess === MEDIA_ACCESS.GRANTED && (
        <div>
          <p>
          Looks like your camera is working and ready.
          </p>
          <div className="action-row">
            <Link to={nextPanelSlug} className="btn btn-primary">
              Next
            </Link>
          </div>
        </div>
      )}

      {[MEDIA_ACCESS.UNSUPPORTED, MEDIA_ACCESS.DENIED].includes(mediaAccess) && (
        <div>
          <p>
            It looks like we're unable to access your camera. You will need to upload
            image files of you and your photo id.
          </p>
          <div className="action-row">
            <Link to={nextPanelSlug} className="btn btn-primary">
              Next
            </Link>
          </div>
        </div>
      )}

    </BasePanel>
  );
}
