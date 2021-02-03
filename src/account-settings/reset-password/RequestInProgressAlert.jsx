import React from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import Alert from '../Alert';

const RequestInProgressAlert = () => (
  <Alert
    className="alert-warning mt-n2"
    icon={<FontAwesomeIcon className="mr-2" icon={faExclamationTriangle} />}
  >
    <FormattedMessage
      id="account.settings.editable.field.password.reset.button.forbidden"
      defaultMessage="Your previous request is in progress, please try again in few moments."
      description="A message displayed when a previous password reset request is still in progress."
    />
  </Alert>
);

export default RequestInProgressAlert;
