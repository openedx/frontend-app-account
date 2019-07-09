import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-i18n';
import { Button, Hyperlink } from '@edx/paragon';

// Messages
import messages from './messages';

// Components
import ConnectedConfirmationModal from './ConfirmationModal';
import PrintingInstructions from './PrintingInstructions';
import ConnectedSuccessModal from './SuccessModal';
import BeforeProceedingBanner from './BeforeProceedingBanner';
import { postDeleteAccount } from './data/service';
import useAction from '../../common/hooks';

function DeleteAccount(props) {
  const {
    logoutUrl, hasLinkedTPA, isVerifiedAccount, intl,
  } = props;

  const [password, setPassword] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const [validationError, setValidationError] = useState(null);
  const [
    deleteAccountState,
    performDeleteAccount,
    resetDeleteAccount,
  ] = useAction(postDeleteAccount);

  const canDelete = isVerifiedAccount && !hasLinkedTPA;
  const successDialogOpen = deleteAccountState.loaded;
  const error = deleteAccountState.error !== null ? 'server' : validationError;

  // Event handlers
  const handleDeleteAccountClick = useCallback(() => {
    if (canDelete) {
      setConfirmationDialogOpen(true);
    }
  });

  const handleSubmit = useCallback(() => {
    if (password === '') {
      setValidationError('empty-password');
    } else {
      performDeleteAccount(password);
    }
  });

  const handleCancel = useCallback(() => {
    setPassword('');
    setConfirmationDialogOpen(false);
    resetDeleteAccount();
  });

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value.trim());
    setValidationError(null);
  });

  const handleFinalClose = useCallback(() => {
    global.location = logoutUrl;
  });

  return (
    <div>
      <h2 className="section-heading">
        {intl.formatMessage(messages['account.settings.delete.account.header'])}
      </h2>
      <p>{intl.formatMessage(messages['account.settings.delete.account.subheader'])}</p>
      <p>{intl.formatMessage(messages['account.settings.delete.account.text.1'])}</p>
      <p>{intl.formatMessage(messages['account.settings.delete.account.text.2'])}</p>
      <p>
        <PrintingInstructions />
      </p>
      <p className="text-danger h6">
        {intl.formatMessage(messages['account.settings.delete.account.text.warning'])}
      </p>
      <p>
        <Hyperlink destination="https://support.edx.org/hc/en-us/sections/115004139268-Manage-Your-Account-Settings">
          {intl.formatMessage(messages['account.settings.delete.account.text.change.instead'])}
        </Hyperlink>
      </p>
      <p>
        <Button
          className="btn-outline-danger"
          onClick={handleDeleteAccountClick}
          disabled={!canDelete}
        >
          {intl.formatMessage(messages['account.settings.delete.account.button'])}
        </Button>
      </p>

      {isVerifiedAccount ? null : (
        <BeforeProceedingBanner
          instructionMessageId="account.settings.delete.account.please.activate"
          supportUrl="https://support.edx.org/hc/en-us/articles/115000940568-How-do-I-activate-my-account-"
        />
      )}

      {hasLinkedTPA ? (
        <BeforeProceedingBanner
          instructionMessageId="account.settings.delete.account.please.unlink"
          supportUrl="https://support.edx.org/hc/en-us/articles/207206067"
        />
      ) : null}

      <ConnectedConfirmationModal
        open={confirmationDialogOpen}
        errorType={error}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onChange={handlePasswordChange}
        password={password}
      />

      <ConnectedSuccessModal open={successDialogOpen} onClose={handleFinalClose} />
    </div>
  );
}

DeleteAccount.propTypes = {
  hasLinkedTPA: PropTypes.bool,
  isVerifiedAccount: PropTypes.bool,
  logoutUrl: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

DeleteAccount.defaultProps = {
  hasLinkedTPA: false,
  isVerifiedAccount: true,
};

export default injectIntl(DeleteAccount);
