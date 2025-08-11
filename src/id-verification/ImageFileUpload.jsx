import { useCallback, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { Alert } from '@openedx/paragon';
import messages from './IdVerification.messages';
import SupportedMediaTypes from './SupportedMediaTypes';

const ImageFileUpload = ({ onFileChange }) => {
  const intl = useIntl();
  const [error, setError] = useState(null);
  const errorTypes = {
    invalidFileType: 'invalidFileType',
    fileTooLarge: 'fileTooLarge',
  };
  const maxFileSize = 10000000;

  const handleChange = useCallback((e) => {
    if (e.target.files.length === 0) {
      return;
    }

    const fileObject = e.target.files[0];
    if (!fileObject.type.startsWith('image')) {
      setError(errorTypes.invalidFileType);
    } else if (fileObject.size >= maxFileSize) {
      setError(errorTypes.fileTooLarge);
    } else {
      setError(null);
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        onFileChange(fileReader.result);
      });
      fileReader.readAsDataURL(fileObject);
    }
  }, [errorTypes.fileTooLarge, errorTypes.invalidFileType, onFileChange]);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        data-testid="fileUpload"
        onChange={handleChange}
      />
      {error && (
      <Alert
        id="fileError"
        variant="danger"
        tabIndex="-1"
        style={{ marginTop: '1rem' }}
      >
        {intl.formatMessage(messages[`id.verification.id.photo.instructions.upload.error.${error}`])}
        <SupportedMediaTypes />
      </Alert>
      )}
    </>
  );
};

ImageFileUpload.propTypes = {
  onFileChange: PropTypes.func.isRequired,
};

export default ImageFileUpload;
