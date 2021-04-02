import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import messages from './IdVerification.messages';
import ImageFileUpload from './ImageFileUpload';
import IdVerificationContext from './IdVerificationContext';
import ImagePreview from './ImagePreview';
import SupportedMediaTypes from './SupportedMediaTypes';

function CameraHelpWithUpload(props) {
  const { setIdPhotoFile, idPhotoFile, userId } = useContext(IdVerificationContext);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);

  function setAndTrackIdPhotoFile(image) {
    sendTrackEvent('edx.id_verification.upload_id', {
      category: 'id_verification',
      user_id: userId,
    });
    setHasUploadedImage(true);
    setIdPhotoFile(image);
  }

  return (
    <div>
      <Collapsible
        styling="card"
        title={props.intl.formatMessage(messages['id.verification.id.photo.unclear.question'])}
        data-testid="collapsible"
        className="mb-4 shadow"
        defaultOpen={props.isOpen}
      >
        {idPhotoFile && hasUploadedImage && <ImagePreview src={idPhotoFile} alt={props.intl.formatMessage(messages['id.verification.id.photo.preview.alt'])} />}
        <p>
          {props.intl.formatMessage(messages['id.verification.id.photo.instructions.upload'])}
          <SupportedMediaTypes />
        </p>
        <ImageFileUpload onFileChange={setAndTrackIdPhotoFile} intl={props.intl} />
      </Collapsible>
    </div>
  );
}

CameraHelpWithUpload.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool,
};

CameraHelpWithUpload.defaultProps = {
  isOpen: false,
};

export default injectIntl(CameraHelpWithUpload);
