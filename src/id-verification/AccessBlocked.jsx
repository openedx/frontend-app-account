import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './IdVerification.messages';
import { ERROR_REASONS } from './IdVerificationContext';

function AccessBlocked({ error, intl }) {
  const handleMessage = () => {
    if (error === ERROR_REASONS.COURSE_ENROLLMENT) {
      return <p>{intl.formatMessage(messages['id.verification.access.blocked.enrollment'])}</p>;
    }
    if (error === ERROR_REASONS.EXISTING_REQUEST) {
      return <p>{intl.formatMessage(messages['id.verification.access.blocked.pending'])}</p>;
    }
    return (
      <FormattedMessage
        id="id.verification.access.blocked.denied"
        defaultMessage="We cannot verify your identity at this time. If you have yet to activate your account, please check your spam folder for the activation email from {email}."
        description="Text that displays when user is denied from making a request, and to check their email for an activation email."
        values={{
          email: <strong>no-reply@registration.edx.org</strong>,
        }}
      />
    );
  };

  return (
    <div>
      <h3 aria-level="1" tabIndex="-1">
        {intl.formatMessage(messages['id.verification.access.blocked.title'])}
      </h3>
      {handleMessage()}
      <div className="action-row">
        <a className="btn btn-primary mt-3" href={`${getConfig().LMS_BASE_URL}/dashboard`}>
          {intl.formatMessage(messages['id.verification.return.dashboard'])}
        </a>
      </div>
    </div>
  );
}

AccessBlocked.propTypes = {
  intl: intlShape.isRequired,
  error: PropTypes.string.isRequired,
};

export default injectIntl(AccessBlocked);
