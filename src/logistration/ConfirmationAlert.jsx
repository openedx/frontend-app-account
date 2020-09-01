import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@edx/paragon';

import Alert from '../account-settings/Alert';

const ConfirmationAlert = (props) => {
  const { email } = props;

  const technicalSupportLink = (
    <Hyperlink
      destination="https://support.edx.org/hc/en-us/articles/206212088-What-if-I-did-not-receive-a-password-reset-message-"
    >
      <FormattedMessage
        id="account.settings.editable.field.password.reset.button.confirmation.support.link"
        defaultMessage="technical support"
        description="link text used in message: account.settings.editable.field.password.reset.button.confirmation 'Contact technical support.'"
      />
    </Hyperlink>
  );

  const strongEmail = (<strong>{email}</strong>)

  return (
    <Alert
      className="alert-success mt-n2"
    >
      <h4 style={{ color: 'green' }}>
        <FormattedMessage
          id="logistration.forgot.password.confirmation.title"
          defaultMessage="Check Your Email"
          description="Forgot password confirmation title"
        />
      </h4>
      <FormattedMessage
        id="logistration.forgot.password.confirmation.message"
        defaultMessage="You entered {strongEmail}. If this email address is associated with your edX account, we will send a message with password recovery instructions to this email address. If you do not receive a password reset message after 1 minute, verify that you entered the correct email address, or check your spam folder. If you need further assistance, Contact {technicalSupportLink}."
        description="Forgot password confirmation message"
        values={{
          strongEmail,
          technicalSupportLink,
        }}
      />
    </Alert>
  );
};

ConfirmationAlert.propTypes = {
  email: PropTypes.string.isRequired,
};

export default ConfirmationAlert;
