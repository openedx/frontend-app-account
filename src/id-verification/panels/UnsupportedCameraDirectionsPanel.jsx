import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from '../IdVerification.messages';

export const UnsupportedCameraDirectionsPanel = (props) => {
  const intl = useIntl();
  return (
    <>
      {props.browserName === 'Chrome' && <span>{intl.formatMessage(messages['id.verification.camera.access.failure.unsupported.chrome.explanation'])}</span>}
      <span> </span>
      <span>{intl.formatMessage(messages['id.verification.camera.access.failure.unsupported.instructions'])}</span>
    </>
  );
};

UnsupportedCameraDirectionsPanel.propTypes = {
  browserName: PropTypes.string.isRequired,
};

export default UnsupportedCameraDirectionsPanel;
