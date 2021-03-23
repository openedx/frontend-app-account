import React, { useCallback, useState } from 'react';
import { intlShape } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { Alert } from '@edx/paragon';
import messages from './IdVerification.messages';

export default function ImageFileUpload({ onFileChange, intl }) {
  const [fileTooLargeError, setFileTooLargeError] = useState(false);
  const maxFileSize = 10000000;

  const handleChange = useCallback((e) => {
    if (e.target.files.length === 0) {
      return;
    }

    const fileObject = e.target.files[0];
    if (fileObject.size < maxFileSize) {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => onFileChange(fileReader.result));
      fileReader.readAsDataURL(fileObject);
    } else {
      setFileTooLargeError(true);
    }
  }, []);

  return (
    <>
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        data-testid="fileUpload"
        onChange={handleChange}
      />
      {fileTooLargeError && (
      <Alert
        id="fileTooLargeError"
        variant="danger"
        tabIndex="-1"
        style={{ marginTop: '1rem' }}
      >
        {intl.formatMessage(messages['id.verification.id.photo.instructions.upload.error'])}
      </Alert>
      )}
    </>
  );
}

ImageFileUpload.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};
