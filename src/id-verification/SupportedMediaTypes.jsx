import React from 'react';

export default function SupportedMediaTypes() {
  const SUPPORTED_TYPES = ['.png', '.jpeg', '.jpg', '.bmp', '.webp', '.tiff'];

  const getSupportedTypes = () => SUPPORTED_TYPES.map((type, index) => {
    if (index === SUPPORTED_TYPES.length - 1) {
      return type;
    }
    return `${type}, `;
  });

  return <span>{getSupportedTypes()}</span>;
}
