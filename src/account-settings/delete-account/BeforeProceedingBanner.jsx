import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hyperlink } from '@openedx/paragon';

// Messages
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';

// Components
import Alert from '../Alert';

const BeforeProceedingBanner = (props) => {
  const { instructionMessageId, supportArticleUrl } = props;
  const intl = useIntl();

  return (
    <Alert
      className="alert-warning mt-n2"
      icon={<FontAwesomeIcon className="mr-2" icon={faExclamationTriangle} />}
    >
      <FormattedMessage
        id="account.settings.delete.account.before.proceeding"
        defaultMessage="Before proceeding, please {actionLink}."
        description="Error that appears if you are trying to delete your account, but something about your account needs attention first.  The actionLink will be instructions, such as 'unlink your Facebook account'."
        values={{
          actionLink: supportArticleUrl ? (
            <Hyperlink destination={supportArticleUrl}>
              {intl.formatMessage(messages[instructionMessageId])}
            </Hyperlink>
          ) : (
            intl.formatMessage(messages[instructionMessageId])
          ),
          siteName: getConfig().SITE_NAME,
        }}
      />
    </Alert>
  );
};

BeforeProceedingBanner.propTypes = {
  instructionMessageId: PropTypes.string.isRequired,
  supportArticleUrl: PropTypes.string.isRequired,
};

export default BeforeProceedingBanner;
