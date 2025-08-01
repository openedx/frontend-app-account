import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from '../IdVerification.messages';

export const EnableCameraDirectionsPanel = (props) => {
  const intl = useIntl();
  if (props.browserName === 'Internet Explorer') {
    return (
      <>
        <h6>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.ie11'])}</h6>
        <ol>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.ie11.step1'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.ie11.step2'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.ie11.step3'])}</li>
        </ol>
      </>
    );
  }
  if (props.browserName === 'Chrome') {
    return (
      <>
        <h6>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome'])}</h6>
        <ol>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step1'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step2'])}</li>
          <ul>
            <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step2.windows'])}</li>
            <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step2.mac'])}</li>
          </ul>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step3'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step4'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.chrome.step5'])}</li>
        </ol>
      </>
    );
  }
  if (props.browserName === 'Firefox') {
    return (
      <>
        <h6>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox'])}</h6>
        <ol>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step1'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step2'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step3'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step4'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step5'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step6'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.firefox.step7'])}</li>
        </ol>
      </>
    );
  }
  if (props.browserName === 'Safari') {
    return (
      <>
        <h6>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.safari'])}</h6>
        <ol>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.safari.step1'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.safari.step2'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.safari.step3'])}</li>
          <li>{intl.formatMessage(messages['id.verification.camera.access.failure.temporary.safari.step4'])}</li>
        </ol>
      </>
    );
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

EnableCameraDirectionsPanel.propTypes = {
  browserName: PropTypes.string.isRequired,
};

export default EnableCameraDirectionsPanel;
