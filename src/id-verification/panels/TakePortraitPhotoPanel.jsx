import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import Camera from '../Camera';
import CameraHelp from '../CameraHelp';
import IdVerificationContext from '../IdVerificationContext';

import messages from '../IdVerification.messages';

const TakePortraitPhotoPanel = () => {
  const panelSlug = 'take-portrait-photo';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { setFacePhotoFile, facePhotoFile } = useContext(IdVerificationContext);
  const [mounted, setMounted] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    // This prevents focus switching to the heading when taking a photo
    setMounted(true);
  }, []);

  return (
    <BasePanel
      name={panelSlug}
      focusOnMount={!mounted}
      title={intl.formatMessage(messages['id.verification.portrait.photo.title.camera'])}
    >
      <div>
        <p>
          {intl.formatMessage(messages['id.verification.portrait.photo.instructions.camera'])}
        </p>
        <Camera onImageCapture={setFacePhotoFile} isPortrait />
      </div>
      <CameraHelp isPortrait />
      <div className="action-row" style={{ visibility: facePhotoFile ? 'unset' : 'hidden' }}>
        <Link to={`/id-verification/${nextPanelSlug}`} className="btn btn-primary" data-testid="next-button">
          {intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
};

export default TakePortraitPhotoPanel;
