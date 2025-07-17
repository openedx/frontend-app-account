import { useContext } from 'react';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Collapsible } from '@openedx/paragon';

import IdVerificationContext from './IdVerificationContext';
import messages from './IdVerification.messages';

const CollapsibleImageHelp = () => {
  const intl = useIntl();
  const {
    userId, useCameraForId, setUseCameraForId,
  } = useContext(IdVerificationContext);

  const handleClick = () => {
    const toggleTo = useCameraForId ? 'upload' : 'camera';
    const eventName = `edx.id_verification.toggle_to.${toggleTo}`;
    sendTrackEvent(eventName, {
      category: 'id_verification',
      user_id: userId,
    });
    setUseCameraForId(!useCameraForId);
  };

  return (
    <Collapsible
      styling="card"
      title={useCameraForId
        ? intl.formatMessage(messages['id.verification.photo.upload.help.title'])
        : intl.formatMessage(messages['id.verification.photo.camera.help.title'])}
      className="mb-4 shadow"
      defaultOpen
    >
      <p data-testid="help-text">
        {useCameraForId
          ? intl.formatMessage(messages['id.verification.photo.upload.help.text'])
          : intl.formatMessage(messages['id.verification.photo.camera.help.text'])}
      </p>
      <Button
        title={useCameraForId ? 'Upload Photo' : 'Take Photo'} // TO-DO: translation
        data-testid="toggle-button"
        onClick={handleClick}
        style={{ marginTop: '0.5rem' }}
      >
        {useCameraForId
          ? intl.formatMessage(messages['id.verification.photo.upload.help.button'])
          : intl.formatMessage(messages['id.verification.photo.camera.help.button'])}
      </Button>
    </Collapsible>
  );
};

export default CollapsibleImageHelp;
