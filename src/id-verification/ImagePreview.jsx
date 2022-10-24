import React from 'react';
import PropTypes from 'prop-types';

const ImagePreview = ({ src, alt, id }) => (
  <div id={id} className="image-preview">

    <img data-hj-suppress style={{ objectFit: 'contain' }} src={src} alt={alt} />

  </div>
);

ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  id: PropTypes.string,
};

ImagePreview.defaultProps = {
  id: undefined,
};

export default ImagePreview;
