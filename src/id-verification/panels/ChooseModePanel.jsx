import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';

import { useNextPanelSlug } from '../routing-utilities';
import BasePanel from './BasePanel';
import IdVerificationContext from '../IdVerificationContext';
import messages from '../IdVerification.messages';

function ChooseModePanel(props) {
  const panelSlug = 'choose-mode';
  const { shouldUseCamera, setShouldUseCamera } = useContext(IdVerificationContext);

  function onPhotoModeChange(value) {
    setShouldUseCamera(value);
  }

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.choose.mode.title'])}
    >
      <p>
        {props.intl.formatMessage(messages['id.verification.choose.mode.help.text'])}
      </p>
      <fieldset>
        <Form.Group controlId="formChoosePhotoOption" style={{ marginLeft: '1.25rem' }}>
          <Form.Check
            type="radio"
            id="useUploadMode"
            label={props.intl.formatMessage(messages['id.verification.choose.mode.radio.upload'])}
            name="photoMode"
            checked={!shouldUseCamera}
            onChange={() => onPhotoModeChange(false)}
          />
          <Form.Check
            type="radio"
            id="useCameraMode"
            label={props.intl.formatMessage(messages['id.verification.choose.mode.radio.camera'])}
            name="photoMode"
            checked={shouldUseCamera}
            onChange={() => onPhotoModeChange(true)}
          />
        </Form.Group>
      </fieldset>
      <div className="action-row">
        <Link to={useNextPanelSlug(panelSlug)} className="btn btn-primary" data-testid="next-button">
          {props.intl.formatMessage(messages['id.verification.next'])}
        </Link>
      </div>
    </BasePanel>
  );
}

ChooseModePanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(ChooseModePanel);
