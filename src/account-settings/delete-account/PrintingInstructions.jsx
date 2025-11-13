import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@openedx/paragon';

import { getConfig } from '@edx/frontend-platform';
import messages from './messages';

const PrintingInstructions = () => {
  const intl = useIntl();
  const actionLink = (
    <Hyperlink
      destination={getConfig().CERTIFICATES_SUPPORT_URL}
    >
      {intl.formatMessage(messages['account.settings.delete.account.text.3.link'])}
    </Hyperlink>
  );

  // TODO: Custom messaging through JS configuration
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

export default PrintingInstructions;
