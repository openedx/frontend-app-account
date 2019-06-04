import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-i18n';
import { Hyperlink } from '@edx/paragon';

import messages from './messages';

const PrintingInstructions = (props) => {
  const actionLink = (
    <Hyperlink
      destination="https://edx.readthedocs.io/projects/edx-guide-for-students/en/latest/SFD_certificates.html#printing-a-certificate"
    >
      {props.intl.formatMessage(messages['account.settings.delete.account.text.3.link'])}
    </Hyperlink>
  );

  return (
    <FormattedMessage
      id="account.settings.delete.account.text.3"
      defaultMessage="You may also lose access to verified certificates and other program credentials like MicroMasters certificates. If you want to make a copy of these for your records before proceeding with deletion, {actionLink}."
      description="A message in the user account deletion area"
      values={{ actionLink }}
    />
  );
};

PrintingInstructions.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(PrintingInstructions);
