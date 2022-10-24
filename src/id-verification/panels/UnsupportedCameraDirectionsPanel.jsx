import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from '../IdVerification.messages';

export const UnsupportedCameraDirectionsPanel = (props) => (
  <>
    {props.browserName === 'Chrome' && <span>{props.intl.formatMessage(messages['id.verification.camera.access.failure.unsupported.chrome.explanation'])}</span>}
    <span> </span>
    <span>{props.intl.formatMessage(messages['id.verification.camera.access.failure.unsupported.instructions'])}</span>
  </>
);

UnsupportedCameraDirectionsPanel.propTypes = {
  intl: intlShape.isRequired,
  browserName: PropTypes.string.isRequired,
};

export default injectIntl(UnsupportedCameraDirectionsPanel);
