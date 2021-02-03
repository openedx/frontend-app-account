import React from 'react';

const IdVerificationContext = React.createContext({});

const MEDIA_ACCESS = {
  PENDING: 'pending',
  UNSUPPORTED: 'unsupported',
  DENIED: 'denied',
  GRANTED: 'granted',
};

const ERROR_REASONS = {
  COURSE_ENROLLMENT: 'course_enrollment',
  EXISTING_REQUEST: 'existing_request',
  CANNOT_VERIFY: 'cannot_verify',
};

const VERIFIED_MODES = ['verified', 'professional', 'masters', 'executive_education'];

export default IdVerificationContext;
export {
  MEDIA_ACCESS,
  ERROR_REASONS,
  VERIFIED_MODES,
};
