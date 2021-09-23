import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hyperlink } from '@edx/paragon';

// Messages
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';

// Components
import Alert from '../Alert';

const BeforeProceedingBanner = (props) => {
  const { instructionMessageId, intl, supportArticleUrl } = props;

  return (
    <Alert
      className="alert-warning mt-n2"
      icon={<FontAwesomeIcon className="mr-2" icon={faExclamationTriangle} />}
    >
      <FormattedMessage
        defaultMessage=intl.formatMessage(
          messages[instructionMessageId], {linkStart: <Hyperlink destination={supportArticleURL}>, linkEnd=</Hyperlink>}
        )
        values={{
          siteName: getConfig().SITE_NAME,
        }}
      />
    </Alert>
  );
};

BeforeProceedingBanner.propTypes = {
  instructionMessageId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  supportArticleUrl: PropTypes.string.isRequired,
};

export default injectIntl(BeforeProceedingBanner);
