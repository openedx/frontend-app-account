import { App } from '@openedx/frontend-base';
import routes from '@src/routes';
import slots from '@src/slots';
import { appId } from '@src/constants';

const app: App = {
  appId,
  routes,
  slots,
  defaultConfig: {
    SUPPORT_URL: null,
    SHOW_PUSH_CHANNEL: false,
    ENABLE_COPPA_COMPLIANCE: false,
    ENABLE_DOB_UPDATE: false,
    ENABLE_ACCOUNT_DELETION: true,
    COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED: [],
    MARKETING_EMAILS_OPT_IN: false,
    PASSWORD_RESET_SUPPORT_LINK: null,
    SUPPORT_URL_TO_UNLINK_SOCIAL_MEDIA_ACCOUNT: 'https://help.edx.org/edxlearner/s/article/How-do-I-link-or-unlink-my-edX-account-to-a-social-media-account',
  },
};

export default app;
