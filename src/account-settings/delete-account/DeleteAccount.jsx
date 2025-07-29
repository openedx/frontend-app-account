import { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Hyperlink } from '@openedx/paragon';

// Actions
import {
  deleteAccount,
  deleteAccountConfirmation,
  deleteAccountFailure,
  deleteAccountReset,
  deleteAccountCancel,
} from './data/actions';

// Messages
import messages from './messages';

// Components
import ConnectedConfirmationModal from './ConfirmationModal';
import PrintingInstructions from './PrintingInstructions';
import ConnectedSuccessModal from './SuccessModal';
import BeforeProceedingBanner from './BeforeProceedingBanner';

export const DeleteAccount = ({
  hasLinkedTPA = false,
  isVerifiedAccount = true,
  status = null,
  errorType = null,
  canDeleteAccount = true,
}) => {
  const intl = useIntl();
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (password === '') {
      deleteAccountFailure('empty-password');
    } else {
      deleteAccount(password);
    }
  };

  const handleCancel = () => {
    setPassword('');
    deleteAccountCancel();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.trim());
    deleteAccountReset();
  };

  const handleFinalClose = () => {
    global.location = getConfig().LOGOUT_URL;
  };

  const canDelete = isVerifiedAccount && !hasLinkedTPA;
  const supportArticleUrl = process.env.SUPPORT_URL_TO_UNLINK_SOCIAL_MEDIA_ACCOUNT || '';

  // TODO: We lack a good way of providing custom language for a particular site.  This is a hack
  // to allow edx.org to fulfill its business requirements.
  const deleteAccountText2MessageKey = getConfig().SITE_NAME === 'edX'
    ? 'account.settings.delete.account.text.2.edX'
    : 'account.settings.delete.account.text.2';

  const optInInstructionMessageId = getConfig().MARKETING_EMAILS_OPT_IN
    ? 'account.settings.delete.account.please.confirm'
    : 'account.settings.delete.account.please.activate';

  return (
    <div>
      <h2 className="section-heading h4 mb-3">
        {intl.formatMessage(messages['account.settings.delete.account.header'])}
      </h2>
      {
          canDeleteAccount ? (
            <>
              <p>{intl.formatMessage(messages['account.settings.delete.account.subheader'])}</p>
              <p>
                {intl.formatMessage(
                  messages['account.settings.delete.account.text.1'],
                  { siteName: getConfig().SITE_NAME },
                )}
              </p>
              <p>
                {intl.formatMessage(
                  messages[deleteAccountText2MessageKey],
                  { siteName: getConfig().SITE_NAME },
                )}
              </p>
              <p>
                <PrintingInstructions />
              </p>
              <p className="text-danger h6">
                {intl.formatMessage(
                  messages['account.settings.delete.account.text.warning'],
                  { siteName: getConfig().SITE_NAME },
                )}
              </p>
              <p>
                <Hyperlink destination="https://help.edx.org/edxlearner/s/topic/0TOQq0000001UdZOAU/account-basics">
                  {intl.formatMessage(messages['account.settings.delete.account.text.change.instead'])}
                </Hyperlink>
              </p>
              <p>
                <Button
                  variant="outline-danger"
                  onClick={canDelete ? deleteAccountConfirmation : null}
                  disabled={!canDelete}
                >
                  {intl.formatMessage(messages['account.settings.delete.account.button'])}
                </Button>
              </p>
              {isVerifiedAccount ? null : (
                <BeforeProceedingBanner
                  instructionMessageId={optInInstructionMessageId}
                  supportArticleUrl="https://support.edx.org/hc/en-us/articles/115000940568-How-do-I-confirm-my-email"
                />
              )}
              {hasLinkedTPA ? (
                <BeforeProceedingBanner
                  instructionMessageId="account.settings.delete.account.please.unlink"
                  supportArticleUrl={supportArticleUrl}
                />
              ) : null}
              <ConnectedConfirmationModal
                status={status}
                errorType={errorType}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onChange={handlePasswordChange}
                password={password}
              />
              <ConnectedSuccessModal status={status} onClose={handleFinalClose} />
            </>
          ) : (
            <p>{intl.formatMessage(messages['account.settings.cannot.delete.account.text'])}</p>
          )
        }
    </div>
  );
};

DeleteAccount.propTypes = {
  status: PropTypes.oneOf(['confirming', 'pending', 'deleted', 'failed']),
  errorType: PropTypes.oneOf(['empty-password', 'server']),
  hasLinkedTPA: PropTypes.bool,
  isVerifiedAccount: PropTypes.bool,
  canDeleteAccount: PropTypes.bool,
};

// Assume we're part of the accountSettings state.
const mapStateToProps = state => state.accountSettings.deleteAccount;

export default connect(
  mapStateToProps,
  {
    deleteAccount,
    deleteAccountConfirmation,
    deleteAccountFailure,
    deleteAccountReset,
    deleteAccountCancel,
  },
)(DeleteAccount);
