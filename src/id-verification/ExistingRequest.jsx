import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './IdVerification.messages';

function ExistingRequest(props) {
  return (
    <div>
      <h3 aria-level="1" tabIndex="-1">
        {props.intl.formatMessage(messages['id.verification.existing.request.title'])}
      </h3>
      {props.status === 'pending' || props.status === 'approved'
        ? <p>{props.intl.formatMessage(messages['id.verification.existing.request.pending.text'])}</p>
        : <FormattedMessage
          id="id.verification.existing.request.denied.text"
          defaultMessage="You cannot verify your identity at this time. If you have yet to activate your account, please check your spam folder for the activation email from {email}."
          description="Text that displays when user is denied from making a request, and to check their email for an activation email."
          values={{
            email: <strong>no-reply@registration.edx.org</strong>,
          }}
        />
        }
      <div className="action-row">
        <a className="btn btn-primary mt-3" href={`${getConfig().LMS_BASE_URL}/dashboard`}>
          {props.intl.formatMessage(messages['id.verification.return.dashboard'])}
        </a>
      </div>
    </div>
  );
}

ExistingRequest.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(ExistingRequest);
