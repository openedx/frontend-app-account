import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from '@openedx/frontend-base';
import { StatefulButton } from '@openedx/paragon';

import { getResetPasswordStatus, useResetPassword } from '@src/account-settings/reset-password/data/hooks';
import messages from '@src/account-settings/reset-password/messages';
import ConfirmationAlert from '@src/account-settings/reset-password/ConfirmationAlert';
import RequestInProgressAlert from '@src/account-settings/reset-password/RequestInProgressAlert';

const ResetPassword = ({ email }) => {
  const intl = useIntl();
  const resetPassword = useResetPassword();
  const status = getResetPasswordStatus(resetPassword);

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
              return;
            }
            resetPassword.mutate(email);
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
};

ResetPassword.defaultProps = {
  email: '',
};

export default ResetPassword;
