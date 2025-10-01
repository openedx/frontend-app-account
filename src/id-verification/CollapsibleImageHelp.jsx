import { injectIntl, intlShape, sendTrackEvent } from '@openedx/frontend-base';
import { Button, Collapsible } from '@openedx/paragon';
import { useContext } from 'react';

import messages from './IdVerification.messages';
import IdVerificationContext from './IdVerificationContext';

const CollapsibleImageHelp = (props) => {
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
};

CollapsibleImageHelp.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CollapsibleImageHelp);
