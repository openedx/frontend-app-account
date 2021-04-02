import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import ImageFileUpload from '../ImageFileUpload';
import ImagePreview from '../ImagePreview';
import Camera from '../Camera';
import CameraHelp from '../CameraHelp';
import IdVerificationContext from '../IdVerificationContext';

import messages from '../IdVerification.messages';
import CollapsibleImageHelp from '../CollapsibleImageHelp';
import SupportedMediaTypes from '../SupportedMediaTypes';

function TakePortraitPhotoPanel(props) {
  const panelSlug = 'take-portrait-photo';
  const nextPanelSlug = useNextPanelSlug(panelSlug);
  const {
    setFacePhotoFile, facePhotoFile, shouldUseCamera, optimizelyExperimentName,
  } = useContext(IdVerificationContext);

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
          <div style={{ marginBottom: '1.25rem' }}>
            <p data-testid="upload-text">
              {props.intl.formatMessage(messages['id.verification.portrait.photo.instructions.upload'])}
              <SupportedMediaTypes />
            </p>
            <ImageFileUpload onFileChange={setFacePhotoFile} intl={props.intl} />
          </div>
        )}
      </div>
      {shouldUseCamera && !optimizelyExperimentName && <CameraHelp isPortrait />}
      <CollapsibleImageHelp isPortrait />
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
