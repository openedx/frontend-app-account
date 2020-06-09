
import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './IdVerification.messages';

function CameraHelp(props) {
  return (
    <div>
      <h6>
        {props.intl.formatMessage(messages['id.verification.camera.help.sight.question'])}
      </h6>
      <p>
        {props.intl.formatMessage(messages['id.verification.camera.help.sight.answer'])}
      </p>
      <h6>
        {props.intl.formatMessage(messages['id.verification.camera.help.head.question'])}
      </h6>
      <p>
        {props.intl.formatMessage(messages['id.verification.camera.help.head.answer'])}
      </p>
    </div>
  );
}

CameraHelp.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CameraHelp);
