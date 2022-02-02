import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import Camera from '../Camera';
import IdVerificationContext from '../IdVerificationContext';

import messages from '../IdVerification.messages';
import CameraHelp from '../CameraHelp';
import ImagePreview from '../ImagePreview';
import ImageFileUpload from '../ImageFileUpload';
import CollapsibleImageHelp from '../CollapsibleImageHelp';
import SupportedMediaTypes from '../SupportedMediaTypes';

function TakeIdPhotoPanel(props) {
  const panelSlug = 'take-id-photo';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { setIdPhotoFile, idPhotoFile, useCameraForId } = useContext(IdVerificationContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This prevents focus switching to the heading when taking a photo
    setMounted(true);
  }, []);

  return (
    <BasePanel
      name={panelSlug}
      focusOnMount={!mounted}
      title={useCameraForId
        ? props.intl.formatMessage(messages['id.verification.id.photo.title.camera'])
        : props.intl.formatMessage(messages['id.verification.id.photo.title.upload'])}
    >
      <div>
        {idPhotoFile && !useCameraForId && (
          <ImagePreview
            src={idPhotoFile}
            alt={props.intl.formatMessage(messages['id.verification.id.photo.preview.alt'])}
          />
        )}

        {useCameraForId ? (
          <div>
            <p>
              {props.intl.formatMessage(messages['id.verification.id.photo.instructions.camera'])}
            </p>
            <Camera onImageCapture={setIdPhotoFile} isPortrait={false} />
          </div>
        ) : (
          <div style={{ marginBottom: '1.25rem' }}>
            <p data-testid="upload-text">
              {props.intl.formatMessage(messages['id.verification.id.photo.instructions.upload'])}
              <SupportedMediaTypes />
            </p>
            <ImageFileUpload onFileChange={setIdPhotoFile} intl={props.intl} />
          </div>
        )}
      </div>
      {useCameraForId && <CameraHelp />}
      <CollapsibleImageHelp />
      <div className="action-row" style={{ visibility: idPhotoFile ? 'unset' : 'hidden' }}>
        <Link to={nextPanelSlug} className="btn btn-primary" data-testid="next-button">
          {props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
}

TakeIdPhotoPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(TakeIdPhotoPanel);
