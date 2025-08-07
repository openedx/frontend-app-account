import { injectIntl, intlShape, sendTrackEvent } from '@openedx/frontend-base';
import { Collapsible } from '@openedx/paragon';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';

import messages from './IdVerification.messages';
import IdVerificationContext from './IdVerificationContext';
import ImageFileUpload from './ImageFileUpload';
import ImagePreview from './ImagePreview';
import SupportedMediaTypes from './SupportedMediaTypes';

const CameraHelpWithUpload = (props) => {
  const { setIdPhotoFile, idPhotoFile, userId } = useContext(IdVerificationContext);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);

  const setAndTrackIdPhotoFile = (image) => {
    sendTrackEvent('edx.id_verification.upload_id', {
      category: 'id_verification',
      user_id: userId,
    });
    setHasUploadedImage(true);
    setIdPhotoFile(image);
  };

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
};

CameraHelpWithUpload.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool,
};

CameraHelpWithUpload.defaultProps = {
  isOpen: false,
};

export default injectIntl(CameraHelpWithUpload);
