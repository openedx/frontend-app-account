import { getAppConfig, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Button, Hyperlink } from '@openedx/paragon';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { appId } from '../../constants';

// Messages
import messages from './messages';

// Components
import BeforeProceedingBanner from './BeforeProceedingBanner';
import ConnectedConfirmationModal from './ConfirmationModal';
import PrintingInstructions from './PrintingInstructions';
import ConnectedSuccessModal from './SuccessModal';
import { DELETE_STATUS } from './constants';

import { useDeleteAccount } from './hooks/useDeleteAccount';

export const DeleteAccount = ({
  hasLinkedTPA,
  isVerifiedAccount,
  canDeleteAccount,
}) => {
  const intl = useIntl();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [errorType, setErrorType] = useState(null);

  const deleteAccountFailure = (error) => {
    setStatus(DELETE_STATUS.FAILED);
    setErrorType(error ?? 'server');
  };
  const handleMutateSuccess = () => {
    setStatus(DELETE_STATUS.DELETED);
  };

  const handleMutateError = (error) => {
    if (error?.response?.status === 403) {
        deleteAccountFailure('invalid-password');
      } else {
        deleteAccountFailure();
      }
  }

  const { mutate: deleteAccount } = useDeleteAccount(handleMutateSuccess, handleMutateError);

  const deleteAccountConfirmation = () => {
    setStatus(DELETE_STATUS.CONFIRMING);
  };

  const handleSubmit = () => {
    if (password === '') {
      deleteAccountFailure('empty-password');
    } else {
      deleteAccount(password);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setStatus(null);
    setErrorType(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.trim());
    setStatus((prev) => prev === DELETE_STATUS.FAILED ? DELETE_STATUS.CONFIRMING : prev);
    setErrorType(null);
  };

  const handleFinalClose = () => {
    global.location = getAppConfig(appId).LOGOUT_URL;
  };

  const canDelete = isVerifiedAccount && !hasLinkedTPA;
  const supportArticleUrl = getAppConfig(appId).SUPPORT_URL_TO_UNLINK_SOCIAL_MEDIA_ACCOUNT;

  // TODO: We lack a good way of providing custom language for a particular site.  This is a hack
  // to allow edx.org to fulfill its business requirements.
  const deleteAccountText2MessageKey = getSiteConfig().siteName === 'edX'
    ? 'account.settings.delete.account.text.2.edX'
    : 'account.settings.delete.account.text.2';

  const optInInstructionMessageId = getAppConfig(appId).MARKETING_EMAILS_OPT_IN
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
                { siteName: getSiteConfig().siteName },
              )}
            </p>
            <p>
              {intl.formatMessage(
                messages[deleteAccountText2MessageKey],
                { siteName: getSiteConfig().siteName },
              )}
            </p>
            <p>
              <PrintingInstructions />
            </p>
            <p className="text-danger h6">
              {intl.formatMessage(
                messages['account.settings.delete.account.text.warning'],
                { siteName: getSiteConfig().siteName },
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
  hasLinkedTPA: PropTypes.bool,
  isVerifiedAccount: PropTypes.bool,
  canDeleteAccount: PropTypes.bool,
};

DeleteAccount.defaultProps = {
  hasLinkedTPA: false,
  isVerifiedAccount: true,
  canDeleteAccount: true,
};


export default DeleteAccount;
