import React, { useContext } from 'react';
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
  const {
    setIdPhotoFile, idPhotoFile, optimizelyExperimentName, shouldUseCamera,
  } = useContext(IdVerificationContext);

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
      {shouldUseCamera && !optimizelyExperimentName && <CameraHelp />}
      <CollapsibleImageHelp isPortrait={false} />
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
