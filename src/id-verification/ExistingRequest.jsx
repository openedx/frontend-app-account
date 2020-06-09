import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './IdVerification.messages';

function ExistingRequest(props) {
  return (
    <div>
      <h3 aria-level="1" tabIndex="-1">
        {props.intl.formatMessage(messages['id.verification.existing.request.title'])}
      </h3>
      {props.status === 'pending' || props.status == 'approved'
        ? <p>{props.intl.formatMessage(messages['id.verification.existing.request.pending.text'])}</p>
        : <p>{props.intl.formatMessage(messages['id.verification.existing.request.denied.text'])}</p>
        }
      <a className="btn btn-primary" href={`${getConfig().LMS_BASE_URL}/dashboard`}>
        {props.intl.formatMessage(messages['id.verification.return'])}
      </a>
    </div>
  );
}

ExistingRequest.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(ExistingRequest);
