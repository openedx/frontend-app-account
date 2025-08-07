import { injectIntl, intlShape, getSiteConfig } from '@openedx/frontend-base';
import { Collapsible } from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from './IdVerification.messages';

const CameraHelp = (props) => (
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
          { siteName: getSiteConfig().SITE_NAME },
        )}
      </p>
    </Collapsible>
  </div>
);

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
