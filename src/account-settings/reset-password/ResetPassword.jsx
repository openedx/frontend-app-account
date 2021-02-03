import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import { StatefulButton } from '@edx/paragon';

import { resetPassword } from './data/actions';
import messages from './messages';
import ConfirmationAlert from './ConfirmationAlert';
import RequestInProgressAlert from './RequestInProgressAlert';

const ResetPassword = (props) => {
  const { email, intl, status } = props;
  return (
    <div className="form-group">
      <h6 aria-level="3">
        <FormattedMessage
          id="account.settings.editable.field.password.reset.label"
          defaultMessage="Password"
          description="The password label in account settings"
        />
      </h6>
      <p>
        <StatefulButton
          variant="link"
          state={status}
          onClick={(e) => {
            // Swallow clicks if the state is pending.
            // We do this instead of disabling the button to prevent
            // it from losing focus (disabled elements cannot have focus).
            // Disabling it would causes upstream issues in focus management.
            // Swallowing the onSubmit event on the form would be better, but
            // we would have to add that logic for every field given our
            // current structure of the application.
            if (status === 'pending') {
              e.preventDefault();
            }
            props.resetPassword(email);
          }}
          disabledStates={[]}
          labels={{
            default: intl.formatMessage(messages['account.settings.editable.field.password.reset.button']),
          }}
        />
      </p>
      {status === 'complete' ? <ConfirmationAlert email={email} /> : null}
      {status === 'forbidden' ? <RequestInProgressAlert /> : null}
    </div>
  );
};

ResetPassword.propTypes = {
  email: PropTypes.string,
  intl: intlShape.isRequired,
  resetPassword: PropTypes.func.isRequired,
  status: PropTypes.string,
};

ResetPassword.defaultProps = {
  email: '',
  status: null,
};

const mapStateToProps = state => state.accountSettings.resetPassword;

export default connect(
  mapStateToProps,
  {
    resetPassword,
  },
)(injectIntl(ResetPassword));
