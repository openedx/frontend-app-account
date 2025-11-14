import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  AlertModal,
  Button, Form, ActionRow,
} from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { faExclamationCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import Alert from '../Alert';
import PrintingInstructions from './PrintingInstructions';

export class ConfirmationModal extends Component {
  /**
   * @returns String The message id for a short description of the error, suitable for a header or
   * as the error message under an input field.
   */
  getShortErrorMessageId(reason) {
    switch (reason) {
      case 'empty-password':
        return 'account.settings.delete.account.error.no.password';
      case 'invalid-password':
        return 'account.settings.delete.account.error.invalid.password';
      default:
        return 'account.settings.delete.account.error.unable.to.delete';
    }
  }

  renderError(reason) {
    const { errorType, intl } = this.props;

    if (errorType === null) {
      return null;
    }
    const headerMessageId = this.getShortErrorMessageId(errorType);
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
  }

  render() {
    const {
      status,
      errorType,
      intl,
      onCancel,
      onChange,
      onSubmit,
      password,
    } = this.props;
    const open = ['confirming', 'pending', 'failed'].includes(status);
    const passwordFieldId = 'passwordFieldId';
    const invalidMessage = messages[this.getShortErrorMessageId(errorType)];

    // TODO: We lack a good way of providing custom language for a particular site.  This is a hack
    // to allow edx.org to fulfill its business requirements.
    const deleteAccountModalText2MessageKey = getConfig().SITE_NAME === 'edX'
      ? 'account.settings.delete.account.modal.text.2.edX'
      : 'account.settings.delete.account.modal.text.2';

    return (
      <AlertModal
        isOpen={open}
        title={intl.formatMessage(messages['account.settings.delete.account.modal.header'])}
        onClose={onCancel}
        isOverflowVisible
        footerNode={(
          <ActionRow>
            <Button variant="link" onClick={onCancel}>Cancel</Button>
            <Button variant="danger" onClick={onSubmit}>Yes, Delete</Button>
          </ActionRow>
        )}
      >
        <div className="p-3">
          {this.renderError()}
          <Alert
            className="alert-warning mt-n2"
            icon={<FontAwesomeIcon className="mr-2" icon={faExclamationTriangle} />}
          >
            <h6>
              {intl.formatMessage(
                messages['account.settings.delete.account.modal.text.1'],
                { siteName: getConfig().SITE_NAME },
              )}
            </h6>
            <p>
              {intl.formatMessage(
                messages[deleteAccountModalText2MessageKey],
                { siteName: getConfig().SITE_NAME },
              )}
            </p>
            <p>
              <PrintingInstructions />
            </p>
          </Alert>
          <Form.Group
            for={passwordFieldId}
            isInvalid={errorType !== null}
          >
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
              <Form.Control.Feedback type="invalid" feedback-for={passwordFieldId}>
                {intl.formatMessage(invalidMessage)}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </div>

      </AlertModal>
    );
  }
}

ConfirmationModal.propTypes = {
  status: PropTypes.oneOf(['confirming', 'pending', 'deleted', 'failed']),
  errorType: PropTypes.oneOf(['empty-password', 'server']),
  intl: intlShape.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
};

ConfirmationModal.defaultProps = {
  status: null,
  errorType: null,
};

export default injectIntl(ConfirmationModal);
