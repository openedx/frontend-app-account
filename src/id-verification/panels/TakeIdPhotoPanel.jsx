import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';

import { useNextPanelSlug } from '@src/id-verification/routing-utilities';
import BasePanel from '@src/id-verification/panels/BasePanel';
import Camera from '@src/id-verification/Camera';
import IdVerificationContext from '@src/id-verification/IdVerificationContext';

import messages from '@src/id-verification/IdVerification.messages';
import CameraHelp from '@src/id-verification/CameraHelp';
import ImagePreview from '@src/id-verification/ImagePreview';
import ImageFileUpload from '@src/id-verification/ImageFileUpload';
import CollapsibleImageHelp from '@src/id-verification/CollapsibleImageHelp';
import SupportedMediaTypes from '@src/id-verification/SupportedMediaTypes';

const TakeIdPhotoPanel = () => {
  const panelSlug = 'take-id-photo';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { setIdPhotoFile, idPhotoFile, useCameraForId } = useContext(IdVerificationContext);
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
      title={useCameraForId
        ? intl.formatMessage(messages['id.verification.id.photo.title.camera'])
        : intl.formatMessage(messages['id.verification.id.photo.title.upload'])}
    >
      <div>
        {idPhotoFile && !useCameraForId && (
          <ImagePreview
            src={idPhotoFile}
            alt={intl.formatMessage(messages['id.verification.id.photo.preview.alt'])}
          />
        )}

        {useCameraForId ? (
          <div>
            <p>
              {intl.formatMessage(messages['id.verification.id.photo.instructions.camera'])}
            </p>
            <Camera onImageCapture={setIdPhotoFile} isPortrait={false} />
          </div>
        ) : (
          <div style={{ marginBottom: '1.25rem' }}>
            <p data-testid="upload-text">
              {intl.formatMessage(messages['id.verification.id.photo.instructions.upload'])}
              <SupportedMediaTypes />
            </p>
            <ImageFileUpload onFileChange={setIdPhotoFile} />
          </div>
        )}
      </div>
      {useCameraForId && <CameraHelp />}
      <CollapsibleImageHelp />
      <div className="action-row" style={{ visibility: idPhotoFile ? 'unset' : 'hidden' }}>
        <Link to={`../${nextPanelSlug}`} className="btn btn-primary" data-testid="next-button">
          {intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
};

export default TakeIdPhotoPanel;
