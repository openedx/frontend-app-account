import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-i18n'; // eslint-disable-line
import { FormattedMessage } from 'react-intl';
import { StatefulButton, Hyperlink } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { resetPassword } from '../actions';
import { resetPasswordSelector } from '../selectors';
import messages from '../AccountSettingsPage.messages';
import Alert from './Alert';

function PasswordReset({ email, intl, ...props }) {
  const renderConfirmationMessage = () => (

    <Alert
      className="alert-warning mt-n2"
      icon={<FontAwesomeIcon className="mr-2" icon={faExclamationTriangle} />}
    >
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
    </Alert>
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
      <p>
        <StatefulButton
          className="btn-link"
          state={props.resetPasswordState}
          onClick={(e) => {
            // Swallow clicks if the state is pending.
            // We do this instead of disabling the button to prevent
            // it from losing focus (disabled elements cannot have focus).
            // Disabling it would causes upstream issues in focus management.
            // Swallowing the onSubmit event on the form would be better, but
            // we would have to add that logic for every field given our
            // current structure of the application.
            if (props.resetPasswordState === 'pending') e.preventDefault();
            props.resetPassword(email);
          }}
          disabledStates={[]}
          labels={{
            default: intl.formatMessage(messages['account.settings.editable.field.password.reset.button']),
          }}
        />
      </p>
      {props.resetPasswordState === 'complete' ? renderConfirmationMessage() : null}
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
