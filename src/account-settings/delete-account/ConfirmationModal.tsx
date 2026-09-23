import { ChangeEvent } from 'react';
import {
  ActionRow, AlertModal, Button, Form,
} from '@openedx/paragon';
import { getSiteConfig, useIntl } from '@openedx/frontend-base';
import { faExclamationCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Alert from '@src/account-settings/Alert';
import messages from '@src/account-settings/delete-account/messages';
import PrintingInstructions from '@src/account-settings/delete-account/PrintingInstructions';

export type DeleteAccountStatus = 'confirming' | 'pending' | 'deleted' | 'failed' | null;
export type DeleteAccountErrorType = 'empty-password' | 'invalid-password' | 'server' | null;

interface ConfirmationModalProps {
  status?: DeleteAccountStatus;
  errorType?: DeleteAccountErrorType;
  onCancel: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  password: string;
}

/**
 * The message id for a short description of the error, suitable for a header or as the error
 * message under an input field.
 */
const getShortErrorMessageId = (errorType: DeleteAccountErrorType) => {
  switch (errorType) {
    case 'empty-password':
      return 'account.settings.delete.account.error.no.password';
    case 'invalid-password':
      return 'account.settings.delete.account.error.invalid.password';
    default:
      return 'account.settings.delete.account.error.unable.to.delete';
  }
};

const ConfirmationModal = ({
  status = null,
  errorType = null,
  onCancel,
  onChange,
  onSubmit,
  password,
}: ConfirmationModalProps) => {
  const intl = useIntl();
  const { siteName } = getSiteConfig();
  const open = status !== null && ['confirming', 'pending', 'failed'].includes(status);
  const passwordFieldId = 'passwordFieldId';

  // TODO: We lack a good way of providing custom language for a particular site.  This is a hack
  // to allow edx.org to fulfill its business requirements.
  const deleteAccountModalText2MessageKey = siteName === 'edX'
    ? 'account.settings.delete.account.modal.text.2.edX'
    : 'account.settings.delete.account.modal.text.2';

  const renderError = () => {
    if (errorType === null) {
      return null;
    }
    const headerMessageId = getShortErrorMessageId(errorType);
    // An empty password needs no further explanation; everything else is a failed request.
    const detailsMessageId = errorType === 'empty-password'
      ? null
      : 'account.settings.delete.account.error.unable.to.delete.details';

    return (
      <Alert
        className="alert-danger mt-n2"
        icon={<FontAwesomeIcon className="mr-2" icon={faExclamationCircle} />}
      >
        <h6>{intl.formatMessage(messages[headerMessageId])}</h6>
        {detailsMessageId ? (
          <p className="text-danger">{intl.formatMessage(messages[detailsMessageId])}</p>
        ) : null}
      </Alert>
    );
  };

  return (
    <AlertModal
      isOpen={open}
      title={intl.formatMessage(messages['account.settings.delete.account.modal.header'])}
      onClose={onCancel}
      footerNode={(
        <ActionRow>
          <Button variant="link" onClick={onCancel}>
            {intl.formatMessage(messages['account.settings.delete.account.modal.confirm.cancel'])}
          </Button>
          <Button variant="danger" onClick={onSubmit}>
            {intl.formatMessage(messages['account.settings.delete.account.modal.confirm.delete'])}
          </Button>
        </ActionRow>
      )}
    >
      <div className="p-3">
        {renderError()}
        <Alert
          className="alert-warning mt-n2"
          icon={<FontAwesomeIcon className="mr-2" icon={faExclamationTriangle} />}
        >
          <h6>
            {intl.formatMessage(messages['account.settings.delete.account.modal.text.1'], { siteName })}
          </h6>
          <p>
            {intl.formatMessage(messages[deleteAccountModalText2MessageKey], { siteName })}
          </p>
          <p>
            <PrintingInstructions />
          </p>
        </Alert>
        <Form.Group isInvalid={errorType !== null}>
          <Form.Label className="d-block" htmlFor={passwordFieldId}>
            {intl.formatMessage(messages['account.settings.delete.account.modal.enter.password'])}
          </Form.Label>
          <Form.Control
            name="password"
            id={passwordFieldId}
            type="password"
            value={password}
            onChange={onChange}
          />
          {errorType !== null && (
            <Form.Control.Feedback type="invalid">
              {intl.formatMessage(messages[getShortErrorMessageId(errorType)])}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </div>
    </AlertModal>
  );
};

export default ConfirmationModal;
