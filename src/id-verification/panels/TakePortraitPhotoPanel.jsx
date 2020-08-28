import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import ImageFileUpload from '../ImageFileUpload';
import ImagePreview from '../ImagePreview';
import Camera from '../Camera';
import CameraHelp from '../CameraHelp';
import { IdVerificationContext } from '../IdVerificationContext';

import messages from '../IdVerification.messages';

function TakePortraitPhotoPanel(props) {
  const panelSlug = 'take-portrait-photo';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { setFacePhotoFile, facePhotoFile } = useContext(IdVerificationContext);
  const shouldUseCamera = true;
  // to reenable upload component:
  // const shouldUseCamera = mediaAccess === MEDIA_ACCESS.GRANTED;

  return (
    <BasePanel
      name={panelSlug}
      title={shouldUseCamera ? props.intl.formatMessage(messages['id.verification.portrait.photo.title.camera']) : props.intl.formatMessage(messages['id.verification.portrait.photo.title.upload'])}
    >
      <div>
        {facePhotoFile && !shouldUseCamera && <ImagePreview src={facePhotoFile} alt={props.intl.formatMessage(messages['id.verification.portrait.photo.preview.alt'])} />}

        {shouldUseCamera ? (
          <div>
            <p>
              {props.intl.formatMessage(messages['id.verification.portrait.photo.instructions.camera'])}
            </p>
            <Camera onImageCapture={setFacePhotoFile} isPortrait />
          </div>
        ) : (
          <div>
            <p>
              {props.intl.formatMessage(messages['id.verification.portrait.photo.instructions.upload'])}
            </p>
            <ImageFileUpload onFileChange={setFacePhotoFile} />
          </div>
        )}
      </div>
      {shouldUseCamera && <CameraHelp isPortrait />}
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
