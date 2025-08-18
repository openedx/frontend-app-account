import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getConfig } from '@edx/frontend-platform';
import messages from './IdVerification.messages';

const CameraHelp = (props) => {
  const intl = useIntl();

  return (
    <div>
      <Collapsible
        styling="card"
        title={intl.formatMessage(messages['id.verification.camera.help.sight.question'])}
        className="mb-4 shadow"
        defaultOpen={props.isOpen}
      >
        <p>
          {intl.formatMessage(messages[`id.verification.camera.help.sight.answer.${props.isPortrait ? 'portrait' : 'id'}`])}
        </p>
      </Collapsible>
      <Collapsible
        styling="card"
        title={intl.formatMessage(messages[`id.verification.camera.help.difficulty.question.${props.isPortrait ? 'portrait' : 'id'}`])}
        className="mb-4 shadow"
        defaultOpen={props.isOpen}
      >
        <p>
          {intl.formatMessage(
            messages['id.verification.camera.help.difficulty.answer'],
            { siteName: getConfig().SITE_NAME },
          )}
        </p>
      </Collapsible>
    </div>
  );
};

CameraHelp.propTypes = {
  isOpen: PropTypes.bool,
  isPortrait: PropTypes.bool,
};

CameraHelp.defaultProps = {
  isOpen: false,
  isPortrait: false,
};

export default CameraHelp;
