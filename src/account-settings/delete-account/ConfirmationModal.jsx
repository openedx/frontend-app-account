import PropTypes from 'prop-types';

import { faExclamationCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSiteConfig, useIntl } from '@openedx/frontend-base';
import {
  ActionRow,
  AlertModal,
  Button, Input, ValidationFormGroup,
} from '@openedx/paragon';
import Alert from '../Alert';
import messages from './messages';
import PrintingInstructions from './PrintingInstructions';

export const ConfirmationModal = ({
  status,
  errorType,
  onCancel,
  onChange,
  onSubmit,
  password,
}) => {
  const intl = useIntl();

  /**
   * @returns String The message id for a short description of the error, suitable for a header or
   * as the error message under an input field.
   */
  const getShortErrorMessageId = (reason) => {
    switch (reason) {
      case 'empty-password':
        return 'account.settings.delete.account.error.no.password';
      case 'invalid-password':
        return 'account.settings.delete.account.error.invalid.password';
      default:
        return 'account.settings.delete.account.error.unable.to.delete';
    }
  };

  const renderError = (reason) => {
    if (errorType === null) {
      return null;
    }
    const headerMessageId = getShortErrorMessageId(errorType);
    const detailsMessageId = reason === 'empty-password'
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

  const open = ['confirming', 'pending', 'failed'].includes(status);
  const passwordFieldId = 'passwordFieldId';
  const invalidMessage = messages[getShortErrorMessageId(errorType)];

  // TODO: We lack a good way of providing custom language for a particular site.  This is a hack
  // to allow edx.org to fulfill its business requirements.
  const deleteAccountModalText2MessageKey = getSiteConfig().siteName === 'edX'
    ? 'account.settings.delete.account.modal.text.2.edX'
    : 'account.settings.delete.account.modal.text.2';

  return (
    <AlertModal
      isOpen={open}
      title={intl.formatMessage(messages['account.settings.delete.account.modal.header'])}
      onClose={onCancel}
      footerNode={(
        <ActionRow>
          <Button variant="link" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onSubmit}>Yes, Delete</Button>
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
            {intl.formatMessage(
              messages['account.settings.delete.account.modal.text.1'],
              { siteName: getSiteConfig().siteName },
            )}
          </h6>
          <p>
            {intl.formatMessage(
              messages[deleteAccountModalText2MessageKey],
              { siteName: getSiteConfig().siteName },
            )}
          </p>
          <p>
            <PrintingInstructions />
          </p>
        </Alert>
        <ValidationFormGroup
          for={passwordFieldId}
          invalid={errorType !== null}
          invalidMessage={intl.formatMessage(invalidMessage)}
        >
          <label className="d-block" htmlFor={passwordFieldId}>
            {intl.formatMessage(messages['account.settings.delete.account.modal.enter.password'])}
          </label>
          <Input
            name="password"
            id={passwordFieldId}
            type="password"
            value={password}
            onChange={onChange}
          />
        </ValidationFormGroup>
      </div>

    </AlertModal>
  );
};

ConfirmationModal.propTypes = {
  status: PropTypes.oneOf(['confirming', 'pending', 'deleted', 'failed']),
  errorType: PropTypes.oneOf(['empty-password', 'server']),
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
};

ConfirmationModal.defaultProps = {
  status: null,
  errorType: null,
};

export default ConfirmationModal;
