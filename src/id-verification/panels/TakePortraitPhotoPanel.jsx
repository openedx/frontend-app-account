import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import Camera from '../Camera';
import CameraHelp from '../CameraHelp';
import IdVerificationContext from '../IdVerificationContext';

import messages from '../IdVerification.messages';

function TakePortraitPhotoPanel(props) {
  const panelSlug = 'take-portrait-photo';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { setFacePhotoFile, facePhotoFile } = useContext(IdVerificationContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This prevents focus switching to the heading when taking a photo
    setMounted(true);
  }, []);

  return (
    <BasePanel
      name={panelSlug}
      focusOnMount={!mounted}
      title={props.intl.formatMessage(messages['id.verification.portrait.photo.title.camera'])}
    >
      <div>
        <p>
          {props.intl.formatMessage(messages['id.verification.portrait.photo.instructions.camera'])}
        </p>
        <Camera onImageCapture={setFacePhotoFile} isPortrait />
      </div>
      <CameraHelp isPortrait />
      <div className="action-row" style={{ visibility: facePhotoFile ? 'unset' : 'hidden' }}>
        <Link to={nextPanelSlug} className="btn btn-primary" data-testid="next-button">
          {props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
}

TakePortraitPhotoPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(TakePortraitPhotoPanel);
