import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from '@openedx/frontend-base';
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
