import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

export default function ImageFileUpload({ onFileChange }) {
  const handleChange = useCallback((e) => {
    if (e.target.files.length === 0) {
      // do something else
      return;
    }

    const fileObject = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => onFileChange(fileReader.result));
    fileReader.readAsDataURL(fileObject);
  }, []);

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleChange}
    />
  );
}

ImageFileUpload.propTypes = {
  onFileChange: PropTypes.func.isRequired,
};
