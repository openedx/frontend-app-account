import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from '../IdVerification.messages';

export function EnableCameraDirectionsPanel(props) {
  if (props.browserName === 'Internet Explorer') {
    return (
      <>
        <h6>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.ie11'])}</h6>
        <ol>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.ie11.step1'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.ie11.step2'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.ie11.step3'])}</li>
        </ol>
      </>
    );
  }
  if (props.browserName === 'Chrome') {
    return (
      <>
        <h6>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome'])}</h6>
        <ol>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step1'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step2'])}</li>
          <ul>
            <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step2.windows'])}</li>
            <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step2.mac'])}</li>
          </ul>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step3'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step4'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step5'])}</li>
        </ol>
      </>
    );
  }
  if (props.browserName === 'Firefox') {
    return (
      <>
        <h6>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox'])}</h6>
        <ol>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step1'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step2'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step3'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step4'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step5'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step6'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step7'])}</li>
        </ol>
      </>
    );
  }
  if (props.browserName === 'Safari') {
    return (
      <>
        <h6>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.safari'])}</h6>
        <ol>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.safari.step1'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.safari.step2'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.safari.step3'])}</li>
          <li>{props.intl.formatMessage(messages['id.verification.camera.access.failure.temporary.safari.step4'])}</li>
        </ol>
      </>
    );
  }
  return <></>;
}

EnableCameraDirectionsPanel.propTypes = {
  intl: intlShape.isRequired,
  browserName: PropTypes.string.isRequired,
};

export default injectIntl(EnableCameraDirectionsPanel);
