import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@edx/paragon';

import { getConfig } from '@edx/frontend-platform';
import messages from './messages';

const PrintingInstructions = (props) => {
  const actionLink = (
    <Hyperlink
      // TODO: What would a generic version of this link look like?  Should
      // CERTIFICATE_SHARING_HELP_URL really be a configuration variable?  In the meantime,
      // We've removed the link from the default message.
      destination="https://support.edx.org/hc/en-us/sections/115004173027-Receive-and-Share-edX-Certificates"
    >
      {props.intl.formatMessage(messages['account.settings.delete.account.text.3.link'])}
    </Hyperlink>
  );

  // TODO: We lack a good way of providing custom language for a particular site.  This is a hack
  // to allow edx.org to mention MicroMasters certificates to fulfill its business requirements.
  if (getConfig().SITE_NAME === 'edX') {
    return (
      <FormattedMessage
        id="account.settings.delete.account.text.3.edX"
        defaultMessage="You may also lose access to verified certificates and other program credentials like MicroMasters certificates. You can make a copy of these for your records before proceeding with deletion. {actionLink}."
        description="A message in the user account deletion area warning users that deleting their account will prevent them from accessing their certificates. 'actionLink' is a HTML link with a full sentence that describes how to print a certificate."
        values={{ actionLink }}
      />
    );
  }

  return (
    <FormattedMessage
      id="account.settings.delete.account.text.3"
      defaultMessage="You may also lose access to verified certificates and other program credentials. You can make a copy of these for your records before proceeding with deletion."
      description="A message in the user account deletion area warning users that deleting their account will prevent them from accessing their certificates."
      values={{ actionLink }}
    />
  );
};

PrintingInstructions.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(PrintingInstructions);
