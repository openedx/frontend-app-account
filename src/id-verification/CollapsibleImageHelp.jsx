import React, { useContext } from 'react';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Collapsible } from '@edx/paragon';

import IdVerificationContext from './IdVerificationContext';
import messages from './IdVerification.messages';

function CollapsibleImageHelp(props) {
  const {
    userId, useCameraForId, setUseCameraForId,
  } = useContext(IdVerificationContext);

  function handleClick() {
    const toggleTo = useCameraForId ? 'upload' : 'camera';
    const eventName = `edx.id_verification.toggle_to.${toggleTo}`;
    sendTrackEvent(eventName, {
      category: 'id_verification',
      user_id: userId,
    });
    setUseCameraForId(!useCameraForId);
  }

  return (
    <Collapsible
      styling="card"
      title={useCameraForId
        ? props.intl.formatMessage(messages['id.verification.photo.upload.help.title'])
        : props.intl.formatMessage(messages['id.verification.photo.camera.help.title'])}
      className="mb-4 shadow"
      defaultOpen
    >
      <p data-testid="help-text">
        {useCameraForId
          ? props.intl.formatMessage(messages['id.verification.photo.upload.help.text'])
          : props.intl.formatMessage(messages['id.verification.photo.camera.help.text'])}
      </p>
      <Button
        title={useCameraForId ? 'Upload Photo' : 'Take Photo'} // TO-DO: translation
        data-testid="toggle-button"
        onClick={handleClick}
        style={{ marginTop: '0.5rem' }}
      >
        {useCameraForId
          ? props.intl.formatMessage(messages['id.verification.photo.upload.help.button'])
          : props.intl.formatMessage(messages['id.verification.photo.camera.help.button'])}
      </Button>
    </Collapsible>
  );
}

CollapsibleImageHelp.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CollapsibleImageHelp);
