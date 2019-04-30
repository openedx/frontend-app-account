import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { StatefulButton, Hyperlink } from '@edx/paragon';

import { resetPassword } from '../actions';
import { resetPasswordSelector } from '../selectors';
import messages from './EditableField.messages';

function PasswordReset({ email, intl, ...props }) {
  const renderConfirmationMessage = () => (
    <FormattedMessage
      id="account.settings.editable.field.password.reset.button"
      defaultMessage="We've sent a message to {email}. Click the link in the message to reset your password. Didn't receive the message? Contact {technicalSupportLink}."
      description="The password reset button in account settings"
      values={{
        email,
        technicalSupportLink: (
          <Hyperlink
            destination="https://support.edx.org/hc/en-us/articles/206212088-What-if-I-did-not-receive-a-password-reset-message-"
          >
            <FormattedMessage
              id="account.settings.editable.field.password.reset.button.support.link"
              defaultMessage="technical support"
              description="link text used in message: account.settings.editable.field.password.reset.button 'Contact technical support.'"
            />
          </Hyperlink>
        ),
      }}
    />
  );

  return (
    <div className="form-group">
      <h6>
        <FormattedMessage
          id="account.settings.editable.field.password.reset.label"
          defaultMessage="Password"
          description="The password label in account settings"
        />
      </h6>
      <StatefulButton
        className="btn-link"
        state={props.resetPasswordState}
        onClick={props.resetPassword}
        disabledStates={[]}
        labels={{
          default: intl.formatMessage(messages['account.settings.editable.field.password.reset.button']),
        }}
      />
      <p className="small text-muted">
        {props.resetPasswordState === 'complete' ? renderConfirmationMessage() : null}
      </p>
    </div>
  );
}

PasswordReset.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  email: PropTypes.string,
  resetPasswordState: PropTypes.string,
  intl: intlShape.isRequired,
};

PasswordReset.defaultProps = {
  email: '',
  resetPasswordState: undefined,
};


export default connect(resetPasswordSelector, {
  resetPassword,
})(injectIntl(PasswordReset));
