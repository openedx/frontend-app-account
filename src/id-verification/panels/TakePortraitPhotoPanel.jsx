import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';

import { useNextPanelSlug } from '@src/id-verification/routing-utilities';
import BasePanel from '@src/id-verification/panels/BasePanel';
import Camera from '@src/id-verification/Camera';
import CameraHelp from '@src/id-verification/CameraHelp';
import IdVerificationContext from '@src/id-verification/IdVerificationContext';

import messages from '@src/id-verification/IdVerification.messages';

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
        <Link to={`../${nextPanelSlug}`} className="btn btn-primary" data-testid="next-button">
          {intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
};

export default TakePortraitPhotoPanel;
