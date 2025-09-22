import { FormattedMessage, useIntl } from '@openedx/frontend-base';
import { StatefulButton } from '@openedx/paragon';
import PropTypes from 'prop-types';

import ConfirmationAlert from './ConfirmationAlert';
import { useResetPasswordMutation } from './hooks';
import messages from './messages';
import RequestInProgressAlert from './RequestInProgressAlert';

const ResetPassword = ({ email }) => {
  const intl = useIntl();
  const resetPasswordMutation = useResetPasswordMutation();

  // Derive status from React Query mutation state
  const getStatus = () => {
    if (resetPasswordMutation.isPending) return 'pending';
    if (resetPasswordMutation.isSuccess) return 'complete';
    if (resetPasswordMutation.isError && resetPasswordMutation.error?.response?.status === 403) {
      return 'forbidden';
    }
    return null;
  };

  const handleResetPassword = (e) => {
    if (resetPasswordMutation.isPending) {
      e.preventDefault();
      return;
    }
    resetPasswordMutation.mutate(email);
  };
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
          state={getStatus()}
          onClick={handleResetPassword}
          disabledStates={[]}
          labels={{
            default: intl.formatMessage(messages['account.settings.editable.field.password.reset.button']),
          }}
        />
      </p>
      {resetPasswordMutation.isSuccess && <ConfirmationAlert email={email} />}
      {resetPasswordMutation.isError && resetPasswordMutation.error?.response?.status === 403 && <RequestInProgressAlert />}
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
