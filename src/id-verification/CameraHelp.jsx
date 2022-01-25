import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { getConfig } from '@edx/frontend-platform';
import messages from './IdVerification.messages';

function CameraHelp(props) {
  return (
    <div>
      <Collapsible
        styling="card"
        title={props.intl.formatMessage(messages['id.verification.camera.help.sight.question'])}
        className="mb-4 shadow"
        defaultOpen={props.isOpen}
      >
        <p>
          {props.intl.formatMessage(messages[`id.verification.camera.help.sight.answer.${props.isPortrait ? 'portrait' : 'id'}`])}
        </p>
      </Collapsible>
      <Collapsible
        styling="card"
        title={props.intl.formatMessage(messages[`id.verification.camera.help.difficulty.question.${props.isPortrait ? 'portrait' : 'id'}`])}
        className="mb-4 shadow"
        defaultOpen={props.isOpen}
      >
        <p>
          {props.intl.formatMessage(
            messages['id.verification.camera.help.difficulty.answer'],
            { siteName: getConfig().SITE_NAME },
          )}
        </p>
      </Collapsible>
    </div>
  );
}

CameraHelp.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool,
  isPortrait: PropTypes.bool,
};

CameraHelp.defaultProps = {
  isOpen: false,
  isPortrait: false,
};

export default injectIntl(CameraHelp);
