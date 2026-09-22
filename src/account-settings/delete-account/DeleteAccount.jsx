import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Hyperlink } from '@openedx/paragon';

import { getDeleteAccountErrorType, useDeleteAccount } from './data/hooks';

// Messages
import messages from './messages';

// Components
import IntlConfirmationModal from './ConfirmationModal';
import PrintingInstructions from './PrintingInstructions';
import { SuccessModal } from './SuccessModal';
import BeforeProceedingBanner from './BeforeProceedingBanner';

/**
 * The modal's status is the request's, framed by the two things it cannot know: that the learner
 * has opened it (`confirming`) and that they submitted it without a password.
 */
const getStatus = (deleteAccount, { isConfirming, isPasswordEmpty }) => {
  if (deleteAccount.isSuccess) {
    return { status: 'deleted', errorType: null };
  }
  if (deleteAccount.isPending) {
    return { status: 'pending', errorType: null };
  }
  if (deleteAccount.isError) {
    return { status: 'failed', errorType: getDeleteAccountErrorType(deleteAccount.error) };
  }
  if (isPasswordEmpty) {
    return { status: 'failed', errorType: 'empty-password' };
  }
  if (isConfirming) {
    return { status: 'confirming', errorType: null };
  }
  return { status: null, errorType: null };
};

const DeleteAccount = ({ hasLinkedTPA, isVerifiedAccount, canDeleteAccount }) => {
  const intl = useIntl();
  const [password, setPassword] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const deleteAccount = useDeleteAccount();
  const { status, errorType } = getStatus(deleteAccount, { isConfirming, isPasswordEmpty });

  const handleConfirmation = () => {
    setIsConfirming(true);
  };

  const handleSubmit = () => {
    if (password === '') {
      setIsPasswordEmpty(true);
    } else {
      deleteAccount.mutate(password);
    }
  };

  // Resetting the mutation detaches the modal from a request that is still running, so only do
  // it once that request has settled.
  const handleCancel = () => {
    setPassword('');
    setIsConfirming(false);
    setIsPasswordEmpty(false);
    if (!deleteAccount.isPending) {
      deleteAccount.reset();
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.trim());
    // Clear any error from the previous attempt so the learner can try again.
    setIsPasswordEmpty(false);
    if (deleteAccount.isError) {
      deleteAccount.reset();
    }
  };

  const handleFinalClose = () => {
    global.location = getConfig().LOGOUT_URL;
  };

  const canDelete = isVerifiedAccount && !hasLinkedTPA;
  const supportArticleUrl = process.env.SUPPORT_URL_TO_UNLINK_SOCIAL_MEDIA_ACCOUNT;

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
                onClick={canDelete ? handleConfirmation : null}
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

            <IntlConfirmationModal
              status={status}
              errorType={errorType}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onChange={handlePasswordChange}
              password={password}
            />

            <SuccessModal status={status} onClose={handleFinalClose} />
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
