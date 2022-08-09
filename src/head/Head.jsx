import React from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import messages from './messages';

const Head = ({ intl }) => (
  <Helmet>
    <title>
      {intl.formatMessage(messages['account.page.title'], { siteName: getConfig().SITE_NAME })}
    </title>
    <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
  </Helmet>
);

Head.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Head);
