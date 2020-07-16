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

function TakeIdPhotoPanel(props) {
  const panelSlug = 'take-id-photo';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const { setIdPhotoFile, idPhotoFile } = useContext(IdVerificationContext);
  const shouldUseCamera = true;
  // to reenable upload component:
  // const shouldUseCamera = mediaAccess === MEDIA_ACCESS.GRANTED;

  return (
    <BasePanel
      name={panelSlug}
      title={shouldUseCamera ? props.intl.formatMessage(messages['id.verification.id.photo.title.camera']) : props.intl.formatMessage(messages['id.verification.id.photo.title.upload'])}
    >
      <div>
        {idPhotoFile && !shouldUseCamera && <ImagePreview src={idPhotoFile} alt={props.intl.formatMessage(messages['id.verification.id.photo.preview.alt'])} />}

        {shouldUseCamera ? (
          <div>
            <p>
              {props.intl.formatMessage(messages['id.verification.id.photo.instructions.camera'])}
            </p>
            <Camera onImageCapture={setIdPhotoFile} />
          </div>
        ) : (
          <div>
            <p>
              {props.intl.formatMessage(messages['id.verification.id.photo.instructions.upload'])}
            </p>
            <ImageFileUpload onFileChange={setIdPhotoFile} />
          </div>
        )}
      </div>
      <div className="action-row" style={{ visibility: idPhotoFile ? 'unset' : 'hidden' }}>
        <Link to={nextPanelSlug} className="btn btn-primary">
          {props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
      {shouldUseCamera && <CameraHelp />}
    </BasePanel>
  );
}

TakeIdPhotoPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(TakeIdPhotoPanel);
