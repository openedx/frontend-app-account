
import React from 'react';
import { Collapsible } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './IdVerification.messages';

function CameraHelp(props) {
  return (
    <div>
      <Collapsible
        styling="card"
        title={props.intl.formatMessage(messages['id.verification.camera.help.sight.question'])}
        className="mb-4 shadow"
      >
        <p>
          {props.intl.formatMessage(messages['id.verification.camera.help.sight.answer'])}
        </p>
      </Collapsible>
      <Collapsible
        styling="card"
        title={props.intl.formatMessage(messages['id.verification.camera.help.head.question'])}
        className="mb-4 shadow"
      >
        <p>
          {props.intl.formatMessage(messages['id.verification.camera.help.head.answer'])}
        </p>
      </Collapsible>
    </div>
  );
}

CameraHelp.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CameraHelp);
